import { Request, Response } from "express";
import Agendamento from "../models/Agendamento";
import Paciente from "../models/Paciente";
import Pagamento from "../models/Pagamento";
import Ticket from "../models/Ticket";
import { Op, fn, col, literal } from "sequelize";

export const resumoHoje = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.user;
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const amanha = new Date(hoje);
  amanha.setDate(amanha.getDate() + 1);

  const agendamentosHoje = await Agendamento.count({
    where: { companyId, dataAgendamento: { [Op.between]: [hoje, amanha] } }
  });

  const realizadosHoje = await Agendamento.count({
    where: { companyId, dataAgendamento: { [Op.between]: [hoje, amanha] }, status: "REALIZADO" }
  });

  const noShowsHoje = await Agendamento.count({
    where: { companyId, dataAgendamento: { [Op.between]: [hoje, amanha] }, status: "NO_SHOW" }
  });

  const faturamentoHoje = await Pagamento.sum("valorFinal", {
    where: { companyId, status: "APROVADO", dataPagamento: { [Op.between]: [hoje, amanha] } }
  }) || 0;

  const novosLeadsHoje = await Ticket.count({
    where: { companyId, createdAt: { [Op.between]: [hoje, amanha] } }
  });

  const novosPacientesHoje = await Paciente.count({
    where: { companyId, createdAt: { [Op.between]: [hoje, amanha] } }
  });

  return res.json({
    agendamentosHoje,
    realizadosHoje,
    noShowsHoje,
    faturamentoHoje,
    novosLeadsHoje,
    novosPacientesHoje,
    taxaNoShow: agendamentosHoje > 0 ? ((noShowsHoje / agendamentosHoje) * 100).toFixed(1) : 0
  });
};

export const metricas = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.user;
  const { dias = 30 } = req.query;

  const dataInicio = new Date();
  dataInicio.setDate(dataInicio.getDate() - parseInt(dias as string));

  const agendamentosPorDia = await Agendamento.findAll({
    where: { companyId, dataAgendamento: { [Op.gte]: dataInicio } },
    attributes: [
      [fn("DATE", col("dataAgendamento")), "data"],
      [fn("COUNT", col("id")), "total"],
      [fn("SUM", literal("CASE WHEN status = 'REALIZADO' THEN 1 ELSE 0 END")), "realizados"],
      [fn("SUM", literal("CASE WHEN status = 'NO_SHOW' THEN 1 ELSE 0 END")), "noShows"]
    ],
    group: [fn("DATE", col("dataAgendamento"))],
    order: [[fn("DATE", col("dataAgendamento")), "ASC"]]
  });

  const faturamentoPorDia = await Pagamento.findAll({
    where: { companyId, status: "APROVADO", dataPagamento: { [Op.gte]: dataInicio } },
    attributes: [
      [fn("DATE", col("dataPagamento")), "data"],
      [fn("SUM", col("valorFinal")), "total"]
    ],
    group: [fn("DATE", col("dataPagamento"))],
    order: [[fn("DATE", col("dataPagamento")), "ASC"]]
  });

  return res.json({ agendamentosPorDia, faturamentoPorDia });
};

export const conversao = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.user;
  const { dias = 30 } = req.query;

  const dataInicio = new Date();
  dataInicio.setDate(dataInicio.getDate() - parseInt(dias as string));

  const totalLeads = await Ticket.count({
    where: { companyId, createdAt: { [Op.gte]: dataInicio } }
  });

  const leadsConvertidos = await Paciente.count({
    where: { companyId, createdAt: { [Op.gte]: dataInicio } }
  });

  const agendamentosRealizados = await Agendamento.count({
    where: { companyId, status: "REALIZADO", createdAt: { [Op.gte]: dataInicio } }
  });

  return res.json({
    totalLeads,
    leadsConvertidos,
    agendamentosRealizados,
    taxaConversaoLead: totalLeads > 0 ? ((leadsConvertidos / totalLeads) * 100).toFixed(1) : 0,
    taxaConversaoAgendamento: leadsConvertidos > 0 ? ((agendamentosRealizados / leadsConvertidos) * 100).toFixed(1) : 0
  });
};

export const topProcedimentos = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.user;
  const { dias = 30 } = req.query;

  const dataInicio = new Date();
  dataInicio.setDate(dataInicio.getDate() - parseInt(dias as string));

  const top = await Agendamento.findAll({
    where: { companyId, status: "REALIZADO", dataAgendamento: { [Op.gte]: dataInicio } },
    attributes: [
      "procedimentoId",
      [fn("COUNT", col("Agendamento.id")), "quantidade"],
      [fn("SUM", col("precoFinal")), "faturamento"]
    ],
    include: [{ association: "procedimento", attributes: ["nome", "categoria"] }],
    group: ["procedimentoId", "procedimento.id"],
    order: [[fn("COUNT", col("Agendamento.id")), "DESC"]],
    limit: 10
  });

  return res.json(top);
};

export const topPacientes = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.user;
  const { dias = 90 } = req.query;

  const dataInicio = new Date();
  dataInicio.setDate(dataInicio.getDate() - parseInt(dias as string));

  const top = await Pagamento.findAll({
    where: { companyId, status: "APROVADO", dataPagamento: { [Op.gte]: dataInicio } },
    attributes: [
      "pacienteId",
      [fn("SUM", col("valorFinal")), "totalGasto"],
      [fn("COUNT", col("Pagamento.id")), "quantidadePagamentos"]
    ],
    include: [{ association: "paciente", attributes: ["nome", "classificacao"] }],
    group: ["pacienteId", "paciente.id"],
    order: [[fn("SUM", col("valorFinal")), "DESC"]],
    limit: 10
  });

  return res.json(top);
};

export const proximosAgendamentos = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.user;
  const agora = new Date();

  const proximos = await Agendamento.findAll({
    where: {
      companyId,
      dataAgendamento: { [Op.gte]: agora },
      status: { [Op.in]: ["AGENDADO", "CONFIRMADO"] }
    },
    include: [
      { association: "paciente", attributes: ["nome", "telefone"] },
      { association: "procedimento", attributes: ["nome"] }
    ],
    order: [["dataAgendamento", "ASC"], ["horaInicio", "ASC"]],
    limit: 10
  });

  return res.json(proximos);
};
