import * as Yup from "yup";
import { Request, Response } from "express";
import { getIO } from "../libs/socket";

import ListPacientesService from "../services/PacienteServices/ListPacientesService";
import CreatePacienteService from "../services/PacienteServices/CreatePacienteService";
import ShowPacienteService from "../services/PacienteServices/ShowPacienteService";
import UpdatePacienteService from "../services/PacienteServices/UpdatePacienteService";
import DeletePacienteService from "../services/PacienteServices/DeletePacienteService";
import ConvertFromContactService from "../services/PacienteServices/ConvertFromContactService";
import AppError from "../errors/AppError";

type IndexQuery = {
  searchParam?: string;
  pageNumber?: string;
  status?: string;
  classificacao?: string;
};

interface PacienteData {
  visitorId?: number;
  nome: string;
  email?: string;
  telefone: string;
  whatsapp?: string;
  cpf?: string;
  dataNascimento?: Date;
  genero?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  numeroProcedimentos?: number;
  procedimentoFavorito?: string;
  status?: string;
  classificacao?: string;
  observacoes?: string;
  alergias?: string;
  historicoMedico?: string;
  ultimoContato?: Date;
}

export const index = async (req: Request, res: Response): Promise<Response> => {
  const { searchParam, pageNumber, status, classificacao } = req.query as IndexQuery;
  const { companyId } = req.user;

  const { pacientes, count, hasMore } = await ListPacientesService({
    searchParam,
    pageNumber,
    status,
    classificacao,
    companyId
  });

  return res.json({ pacientes, count, hasMore });
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { pacienteId } = req.params;
  const { companyId } = req.user;

  const paciente = await ShowPacienteService(pacienteId, companyId);

  return res.status(200).json(paciente);
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.user;
  const pacienteData: PacienteData = req.body;

  const schema = Yup.object().shape({
    nome: Yup.string().required("Nome é obrigatório"),
    telefone: Yup.string().required("Telefone é obrigatório"),
    email: Yup.string().email("Email inválido"),
    cpf: Yup.string().matches(
      /^\d{11}$/,
      "CPF deve conter 11 dígitos numéricos"
    )
  });

  try {
    await schema.validate(pacienteData);
  } catch (err: any) {
    throw new AppError(err.message);
  }

  const paciente = await CreatePacienteService({
    ...pacienteData,
    companyId
  });

  const io = getIO();
  io.emit(`company-${companyId}-paciente`, {
    action: "create",
    paciente
  });

  return res.status(200).json(paciente);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const pacienteData: PacienteData = req.body;
  const { companyId } = req.user;
  const { pacienteId } = req.params;

  const schema = Yup.object().shape({
    nome: Yup.string(),
    telefone: Yup.string(),
    email: Yup.string().email("Email inválido"),
    cpf: Yup.string().matches(
      /^\d{11}$/,
      "CPF deve conter 11 dígitos numéricos"
    )
  });

  try {
    await schema.validate(pacienteData);
  } catch (err: any) {
    throw new AppError(err.message);
  }

  const paciente = await UpdatePacienteService({
    pacienteData,
    pacienteId,
    companyId
  });

  const io = getIO();
  io.emit(`company-${companyId}-paciente`, {
    action: "update",
    paciente
  });

  return res.status(200).json(paciente);
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { pacienteId } = req.params;
  const { companyId } = req.user;

  await DeletePacienteService(pacienteId, companyId);

  const io = getIO();
  io.emit(`company-${companyId}-paciente`, {
    action: "delete",
    pacienteId
  });

  return res.status(200).json({ message: "Paciente deletado com sucesso" });
};

export const convertFromContact = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { contactId } = req.params;
  const { companyId } = req.user;

  const paciente = await ConvertFromContactService({
    contactId,
    companyId
  });

  const io = getIO();
  io.emit(`company-${companyId}-paciente`, {
    action: "create",
    paciente
  });

  return res.status(200).json(paciente);
};
