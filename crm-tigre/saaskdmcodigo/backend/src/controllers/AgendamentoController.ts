import * as Yup from "yup";
import { Request, Response } from "express";
import { getIO } from "../libs/socket";

import ListAgendamentosService from "../services/AgendamentoServices/ListAgendamentosService";
import CreateAgendamentoService from "../services/AgendamentoServices/CreateAgendamentoService";
import ShowAgendamentoService from "../services/AgendamentoServices/ShowAgendamentoService";
import UpdateAgendamentoService from "../services/AgendamentoServices/UpdateAgendamentoService";
import ConfirmarAgendamentoService from "../services/AgendamentoServices/ConfirmarAgendamentoService";
import CancelarAgendamentoService from "../services/AgendamentoServices/CancelarAgendamentoService";
import MarcarRealizadoService from "../services/AgendamentoServices/MarcarRealizadoService";
import MarcarNoShowService from "../services/AgendamentoServices/MarcarNoShowService";
import GetSlotsDisponiveisService from "../services/AgendamentoServices/GetSlotsDisponiveisService";
import AppError from "../errors/AppError";
import { AgendamentoStatus } from "../models/Agendamento";

type IndexQuery = {
  searchParam?: string;
  pageNumber?: string;
  status?: AgendamentoStatus;
  dataInicio?: string;
  dataFim?: string;
  profissionalId?: string;
};

interface AgendamentoData {
  pacienteId: number;
  procedimentoId: number;
  profissionalId?: number;
  dataAgendamento: Date;
  horaInicio: string;
  preco?: number;
  desconto?: number;
  metodoPagamento?: string;
  notas?: string;
}

export const index = async (req: Request, res: Response): Promise<Response> => {
  const {
    searchParam,
    pageNumber,
    status,
    dataInicio,
    dataFim,
    profissionalId
  } = req.query as IndexQuery;
  const { companyId } = req.user;

  const { agendamentos, count, hasMore } = await ListAgendamentosService({
    searchParam,
    pageNumber,
    companyId,
    status,
    dataInicio: dataInicio ? new Date(dataInicio) : undefined,
    dataFim: dataFim ? new Date(dataFim) : undefined,
    profissionalId: profissionalId ? Number(profissionalId) : undefined
  });

  return res.json({ agendamentos, count, hasMore });
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.user;
  const newAgendamento: AgendamentoData = req.body;

  const schema = Yup.object().shape({
    pacienteId: Yup.number().required(),
    procedimentoId: Yup.number().required(),
    dataAgendamento: Yup.date().required(),
    horaInicio: Yup.string()
      .required()
      .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido")
  });

  try {
    await schema.validate(newAgendamento);
  } catch (err: any) {
    throw new AppError(err.message);
  }

  const agendamento = await CreateAgendamentoService({
    ...newAgendamento,
    companyId
  });

  const io = getIO();
  io.emit(`company-${companyId}-agendamento`, {
    action: "create",
    agendamento
  });

  return res.status(200).json(agendamento);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { agendamentoId } = req.params;
  const { companyId } = req.user;

  const agendamento = await ShowAgendamentoService(agendamentoId, companyId);

  return res.status(200).json(agendamento);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const agendamentoData = req.body;
  const { companyId } = req.user;
  const { agendamentoId } = req.params;

  const agendamento = await UpdateAgendamentoService({
    agendamentoData,
    agendamentoId,
    companyId
  });

  const io = getIO();
  io.emit(`company-${companyId}-agendamento`, {
    action: "update",
    agendamento
  });

  return res.status(200).json(agendamento);
};

export const confirmar = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { agendamentoId } = req.params;
  const { companyId } = req.user;

  const agendamento = await ConfirmarAgendamentoService(
    agendamentoId,
    companyId
  );

  const io = getIO();
  io.emit(`company-${companyId}-agendamento`, {
    action: "update",
    agendamento
  });

  return res.status(200).json(agendamento);
};

export const cancelar = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { agendamentoId } = req.params;
  const { companyId } = req.user;
  const { motivoCancelamento } = req.body;

  const agendamento = await CancelarAgendamentoService({
    agendamentoId,
    companyId,
    motivoCancelamento
  });

  const io = getIO();
  io.emit(`company-${companyId}-agendamento`, {
    action: "update",
    agendamento
  });

  return res.status(200).json(agendamento);
};

export const marcarRealizado = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { agendamentoId } = req.params;
  const { companyId } = req.user;
  const { pagamentoStatus, metodoPagamento } = req.body;

  const agendamento = await MarcarRealizadoService({
    agendamentoId,
    companyId,
    pagamentoStatus,
    metodoPagamento
  });

  const io = getIO();
  io.emit(`company-${companyId}-agendamento`, {
    action: "update",
    agendamento
  });

  return res.status(200).json(agendamento);
};

export const marcarNoShow = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { agendamentoId } = req.params;
  const { companyId } = req.user;

  const agendamento = await MarcarNoShowService(agendamentoId, companyId);

  const io = getIO();
  io.emit(`company-${companyId}-agendamento`, {
    action: "update",
    agendamento
  });

  return res.status(200).json(agendamento);
};

export const slotsDisponiveis = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { companyId } = req.user;
  const {
    procedimentoId,
    dataAgendamento,
    profissionalId,
    horaAbertura,
    horaFechamento,
    intervaloMinutos
  } = req.query as any;

  const schema = Yup.object().shape({
    procedimentoId: Yup.number().required(),
    dataAgendamento: Yup.date().required()
  });

  try {
    await schema.validate({ procedimentoId, dataAgendamento });
  } catch (err: any) {
    throw new AppError(err.message);
  }

  const slots = await GetSlotsDisponiveisService({
    companyId,
    procedimentoId: Number(procedimentoId),
    dataAgendamento: new Date(dataAgendamento),
    profissionalId: profissionalId ? Number(profissionalId) : undefined,
    horaAbertura,
    horaFechamento,
    intervaloMinutos: intervaloMinutos ? Number(intervaloMinutos) : undefined
  });

  return res.status(200).json(slots);
};
