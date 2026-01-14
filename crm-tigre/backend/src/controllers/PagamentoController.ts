import { Request, Response } from "express";
import { getIO } from "../libs/socket";
import Pagamento from "../models/Pagamento";
import Agendamento from "../models/Agendamento";
import Paciente from "../models/Paciente";
import AppError from "../errors/AppError";
import { Op } from "sequelize";

export const index = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.user;
  const { dataInicio, dataFim, status, metodo, pacienteId } = req.query;

  const whereCondition: any = { companyId };

  if (dataInicio && dataFim) {
    whereCondition.createdAt = { [Op.between]: [dataInicio, dataFim] };
  }
  if (status) whereCondition.status = status;
  if (metodo) whereCondition.metodo = metodo;
  if (pacienteId) whereCondition.pacienteId = pacienteId;

  const pagamentos = await Pagamento.findAll({
    where: whereCondition,
    include: [
      { model: Paciente, as: "paciente" },
      { model: Agendamento, as: "agendamento" }
    ],
    order: [["createdAt", "DESC"]]
  });

  return res.json(pagamentos);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { companyId } = req.user;

  const pagamento = await Pagamento.findOne({
    where: { id, companyId },
    include: [
      { model: Paciente, as: "paciente" },
      { model: Agendamento, as: "agendamento" }
    ]
  });

  if (!pagamento) throw new AppError("Pagamento não encontrado", 404);

  return res.json(pagamento);
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.user;
  const { agendamentoId, pacienteId, valor, desconto = 0, metodo, observacoes } = req.body;

  const valorFinal = valor - desconto;

  const pagamento = await Pagamento.create({
    companyId,
    agendamentoId,
    pacienteId,
    valor,
    desconto,
    valorFinal,
    metodo,
    status: metodo === "DINHEIRO" ? "APROVADO" : "PENDENTE",
    dataPagamento: metodo === "DINHEIRO" ? new Date() : null,
    observacoes
  });

  // Atualizar status do agendamento
  if (agendamentoId) {
    await Agendamento.update(
      { pagamentoStatus: "PAGO", metodoPagamento: metodo },
      { where: { id: agendamentoId } }
    );
  }

  const io = getIO();
  io.emit(`company-${companyId}-pagamento`, { action: "create", pagamento });

  return res.status(201).json(pagamento);
};

export const gerarLinkPagamento = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.user;
  const { agendamentoId, pacienteId, valor } = req.body;

  // Integração com Stripe seria aqui
  // Por enquanto, criar pagamento pendente
  const pagamento = await Pagamento.create({
    companyId,
    agendamentoId,
    pacienteId,
    valor,
    valorFinal: valor,
    metodo: "CARTAO",
    status: "PENDENTE",
    stripeCheckoutUrl: `https://checkout.stripe.com/placeholder/${Date.now()}`
  });

  return res.json({
    pagamento,
    checkoutUrl: pagamento.stripeCheckoutUrl
  });
};

export const gerarPix = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.user;
  const { agendamentoId, pacienteId, valor } = req.body;

  // Gerar código PIX (placeholder - integrar com API de PIX real)
  const pixCode = `00020126580014br.gov.bcb.pix0136${Date.now()}520400005303986540${valor.toFixed(2)}5802BR`;

  const pagamento = await Pagamento.create({
    companyId,
    agendamentoId,
    pacienteId,
    valor,
    valorFinal: valor,
    metodo: "PIX",
    status: "PENDENTE",
    pixCode
  });

  return res.json({
    pagamento,
    pixCode: pagamento.pixCode
  });
};

export const webhookStripe = async (req: Request, res: Response): Promise<Response> => {
  const { type, data } = req.body;

  if (type === "checkout.session.completed") {
    const stripePaymentId = data.object.id;
    
    const pagamento = await Pagamento.findOne({ where: { stripePaymentId } });
    if (pagamento) {
      await pagamento.update({
        status: "APROVADO",
        dataPagamento: new Date()
      });

      if (pagamento.agendamentoId) {
        await Agendamento.update(
          { pagamentoStatus: "PAGO" },
          { where: { id: pagamento.agendamentoId } }
        );
      }
    }
  }

  return res.json({ received: true });
};

export const resumoFinanceiro = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.user;
  const { periodo = "mes" } = req.query;

  let dataInicio = new Date();
  if (periodo === "dia") dataInicio.setHours(0, 0, 0, 0);
  else if (periodo === "semana") dataInicio.setDate(dataInicio.getDate() - 7);
  else if (periodo === "mes") dataInicio.setMonth(dataInicio.getMonth() - 1);

  const pagamentos = await Pagamento.findAll({
    where: {
      companyId,
      status: "APROVADO",
      dataPagamento: { [Op.gte]: dataInicio }
    }
  });

  const total = pagamentos.reduce((sum, p) => sum + parseFloat(p.valorFinal as any), 0);
  const porMetodo = pagamentos.reduce((acc: any, p) => {
    acc[p.metodo] = (acc[p.metodo] || 0) + parseFloat(p.valorFinal as any);
    return acc;
  }, {});

  return res.json({
    total,
    quantidade: pagamentos.length,
    porMetodo,
    ticketMedio: pagamentos.length > 0 ? total / pagamentos.length : 0
  });
};
