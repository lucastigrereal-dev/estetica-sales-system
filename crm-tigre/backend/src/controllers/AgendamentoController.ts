import { Request, Response } from "express";
import { getIO } from "../libs/socket";
import Agendamento from "../models/Agendamento";
import Paciente from "../models/Paciente";
import Procedimento from "../models/Procedimento";
import User from "../models/User";
import AppError from "../errors/AppError";
import { Op } from "sequelize";
import { updateClassificacao } from "./PacienteController";

export const index = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.user;
  const { dataInicio, dataFim, status, pacienteId, profissionalId } = req.query;

  const whereCondition: any = { companyId };

  if (dataInicio && dataFim) {
    whereCondition.dataAgendamento = { [Op.between]: [dataInicio, dataFim] };
  }
  if (status) whereCondition.status = status;
  if (pacienteId) whereCondition.pacienteId = pacienteId;
  if (profissionalId) whereCondition.profissionalId = profissionalId;

  const agendamentos = await Agendamento.findAll({
    where: whereCondition,
    include: [
      { model: Paciente, as: "paciente" },
      { model: Procedimento, as: "procedimento" },
      { model: User, as: "profissional", attributes: ["id", "name", "email"] }
    ],
    order: [["dataAgendamento", "ASC"], ["horaInicio", "ASC"]]
  });

  return res.json(agendamentos);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { companyId } = req.user;

  const agendamento = await Agendamento.findOne({
    where: { id, companyId },
    include: [
      { model: Paciente, as: "paciente" },
      { model: Procedimento, as: "procedimento" },
      { model: User, as: "profissional", attributes: ["id", "name", "email"] }
    ]
  });

  if (!agendamento) {
    throw new AppError("Agendamento não encontrado", 404);
  }

  return res.json(agendamento);
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.user;
  const { pacienteId, procedimentoId, dataAgendamento, horaInicio, profissionalId, notas } = req.body;

  const procedimento = await Procedimento.findByPk(procedimentoId);
  if (!procedimento) throw new AppError("Procedimento não encontrado", 404);

  const duracaoMinutos = procedimento.duracaoMinutos;
  const [hora, minuto] = horaInicio.split(":").map(Number);
  const horaFimDate = new Date(2000, 0, 1, hora, minuto + duracaoMinutos);
  const horaFim = `${String(horaFimDate.getHours()).padStart(2, "0")}:${String(horaFimDate.getMinutes()).padStart(2, "0")}`;

  // Verificar conflito
  const conflito = await Agendamento.findOne({
    where: {
      companyId,
      profissionalId,
      dataAgendamento,
      status: { [Op.notIn]: ["CANCELADO", "NO_SHOW"] },
      [Op.or]: [
        { horaInicio: { [Op.between]: [horaInicio, horaFim] } },
        { horaFim: { [Op.between]: [horaInicio, horaFim] } }
      ]
    }
  });

  if (conflito) {
    throw new AppError("Já existe um agendamento neste horário", 400);
  }

  const agendamento = await Agendamento.create({
    companyId,
    pacienteId,
    procedimentoId,
    profissionalId,
    dataAgendamento,
    horaInicio,
    horaFim,
    duracaoMinutos,
    preco: procedimento.precoPromocional || procedimento.precoPadrao,
    precoFinal: procedimento.precoPromocional || procedimento.precoPadrao,
    notas,
    status: "AGENDADO"
  });

  const io = getIO();
  io.emit(`company-${companyId}-agendamento`, { action: "create", agendamento });

  return res.status(201).json(agendamento);
};

export const update = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { companyId } = req.user;

  const agendamento = await Agendamento.findOne({ where: { id, companyId } });
  if (!agendamento) throw new AppError("Agendamento não encontrado", 404);

  await agendamento.update(req.body);

  const io = getIO();
  io.emit(`company-${companyId}-agendamento`, { action: "update", agendamento });

  return res.json(agendamento);
};

export const confirmar = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { companyId } = req.user;

  const agendamento = await Agendamento.findOne({ where: { id, companyId } });
  if (!agendamento) throw new AppError("Agendamento não encontrado", 404);

  await agendamento.update({ status: "CONFIRMADO" });

  const io = getIO();
  io.emit(`company-${companyId}-agendamento`, { action: "update", agendamento });

  return res.json(agendamento);
};

export const cancelar = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { companyId } = req.user;
  const { motivo } = req.body;

  const agendamento = await Agendamento.findOne({ where: { id, companyId } });
  if (!agendamento) throw new AppError("Agendamento não encontrado", 404);

  await agendamento.update({ status: "CANCELADO", motivoCancelamento: motivo });

  const io = getIO();
  io.emit(`company-${companyId}-agendamento`, { action: "update", agendamento });

  return res.json(agendamento);
};

export const marcarRealizado = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { companyId } = req.user;

  const agendamento = await Agendamento.findOne({ where: { id, companyId } });
  if (!agendamento) throw new AppError("Agendamento não encontrado", 404);

  await agendamento.update({ status: "REALIZADO" });

  // Atualizar contador do paciente
  const paciente = await Paciente.findByPk(agendamento.pacienteId);
  if (paciente) {
    await paciente.update({ 
      numeroProcedimentos: paciente.numeroProcedimentos + 1,
      ultimoContato: new Date()
    });
    await updateClassificacao(paciente.id);
  }

  const io = getIO();
  io.emit(`company-${companyId}-agendamento`, { action: "update", agendamento });

  return res.json(agendamento);
};

export const marcarNoShow = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { companyId } = req.user;

  const agendamento = await Agendamento.findOne({ where: { id, companyId } });
  if (!agendamento) throw new AppError("Agendamento não encontrado", 404);

  await agendamento.update({ status: "NO_SHOW" });

  const io = getIO();
  io.emit(`company-${companyId}-agendamento`, { action: "update", agendamento });

  return res.json(agendamento);
};

export const slotsDisponiveis = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.user;
  const { data, procedimentoId, profissionalId } = req.query;

  const procedimento = await Procedimento.findByPk(procedimentoId as string);
  if (!procedimento) throw new AppError("Procedimento não encontrado", 404);

  const agendamentosExistentes = await Agendamento.findAll({
    where: {
      companyId,
      dataAgendamento: data,
      profissionalId,
      status: { [Op.notIn]: ["CANCELADO", "NO_SHOW"] }
    }
  });

  // Gerar slots de 30 em 30 minutos das 8h às 18h
  const slots = [];
  for (let hora = 8; hora < 18; hora++) {
    for (let minuto = 0; minuto < 60; minuto += 30) {
      const horaStr = `${String(hora).padStart(2, "0")}:${String(minuto).padStart(2, "0")}`;
      const ocupado = agendamentosExistentes.some(a => a.horaInicio === horaStr);
      slots.push({ hora: horaStr, disponivel: !ocupado });
    }
  }

  return res.json(slots);
};

export const remove = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { companyId } = req.user;

  const agendamento = await Agendamento.findOne({ where: { id, companyId } });
  if (!agendamento) throw new AppError("Agendamento não encontrado", 404);

  await agendamento.destroy();

  const io = getIO();
  io.emit(`company-${companyId}-agendamento`, { action: "delete", agendamentoId: id });

  return res.status(200).json({ message: "Agendamento removido" });
};
