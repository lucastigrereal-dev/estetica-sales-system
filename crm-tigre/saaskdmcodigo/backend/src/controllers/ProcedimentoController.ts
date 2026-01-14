import * as Yup from "yup";
import { Request, Response } from "express";
import { getIO } from "../libs/socket";

import ListProcedimentosService from "../services/ProcedimentoServices/ListProcedimentosService";
import CreateProcedimentoService from "../services/ProcedimentoServices/CreateProcedimentoService";
import ShowProcedimentoService from "../services/ProcedimentoServices/ShowProcedimentoService";
import UpdateProcedimentoService from "../services/ProcedimentoServices/UpdateProcedimentoService";
import DeleteProcedimentoService from "../services/ProcedimentoServices/DeleteProcedimentoService";
import AppError from "../errors/AppError";

type IndexQuery = {
  searchParam: string;
  pageNumber: string;
  ativo?: string;
  categoria?: string;
};

interface ProcedimentoData {
  nome: string;
  descricao?: string;
  categoria?: string;
  duracaoMinutos: number;
  precoPadrao: number;
  precoPromocional?: number;
  ativo?: boolean;
  imagemUrl?: string;
}

export const index = async (req: Request, res: Response): Promise<Response> => {
  const { searchParam, pageNumber, ativo, categoria } = req.query as IndexQuery;
  const { companyId } = req.user;

  const { procedimentos, count, hasMore } = await ListProcedimentosService({
    searchParam,
    pageNumber,
    companyId,
    ativo: ativo ? ativo === "true" : undefined,
    categoria
  });

  return res.json({ procedimentos, count, hasMore });
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.user;
  const newProcedimento: ProcedimentoData = req.body;

  const schema = Yup.object().shape({
    nome: Yup.string().required(),
    duracaoMinutos: Yup.number().required().positive(),
    precoPadrao: Yup.number().required().positive()
  });

  try {
    await schema.validate(newProcedimento);
  } catch (err: any) {
    throw new AppError(err.message);
  }

  const procedimento = await CreateProcedimentoService({
    ...newProcedimento,
    companyId
  });

  const io = getIO();
  io.emit(`company-${companyId}-procedimento`, {
    action: "create",
    procedimento
  });

  return res.status(200).json(procedimento);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { procedimentoId } = req.params;
  const { companyId } = req.user;

  const procedimento = await ShowProcedimentoService(procedimentoId, companyId);

  return res.status(200).json(procedimento);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const procedimentoData: ProcedimentoData = req.body;
  const { companyId } = req.user;

  const schema = Yup.object().shape({
    nome: Yup.string(),
    duracaoMinutos: Yup.number().positive(),
    precoPadrao: Yup.number().positive(),
    precoPromocional: Yup.number().min(0)
  });

  try {
    await schema.validate(procedimentoData);
  } catch (err: any) {
    throw new AppError(err.message);
  }

  const { procedimentoId } = req.params;

  const procedimento = await UpdateProcedimentoService({
    procedimentoData,
    procedimentoId,
    companyId
  });

  const io = getIO();
  io.emit(`company-${companyId}-procedimento`, {
    action: "update",
    procedimento
  });

  return res.status(200).json(procedimento);
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { procedimentoId } = req.params;
  const { companyId } = req.user;

  await ShowProcedimentoService(procedimentoId, companyId);

  await DeleteProcedimentoService(procedimentoId, companyId);

  const io = getIO();
  io.emit(`company-${companyId}-procedimento`, {
    action: "delete",
    procedimentoId
  });

  return res.status(200).json({ message: "Procedimento deleted" });
};
