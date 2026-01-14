import { Request, Response } from "express";
import { getIO } from "../libs/socket";
import Paciente from "../models/Paciente";
import Contact from "../models/Contact";
import AppError from "../errors/AppError";
import { Op } from "sequelize";

export const index = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.user;
  const { searchParam, status, classificacao, pageNumber = "1" } = req.query;

  const whereCondition: any = { companyId };

  if (searchParam) {
    whereCondition[Op.or] = [
      { nome: { [Op.like]: `%${searchParam}%` } },
      { email: { [Op.like]: `%${searchParam}%` } },
      { telefone: { [Op.like]: `%${searchParam}%` } },
      { cpf: { [Op.like]: `%${searchParam}%` } }
    ];
  }

  if (status) whereCondition.status = status;
  if (classificacao) whereCondition.classificacao = classificacao;

  const limit = 20;
  const offset = limit * (parseInt(pageNumber as string) - 1);

  const { count, rows: pacientes } = await Paciente.findAndCountAll({
    where: whereCondition,
    limit,
    offset,
    order: [["nome", "ASC"]],
    include: [{ model: Contact, as: "contact" }]
  });

  const hasMore = count > offset + pacientes.length;

  return res.json({ pacientes, count, hasMore });
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { companyId } = req.user;

  const paciente = await Paciente.findOne({
    where: { id, companyId },
    include: [{ model: Contact, as: "contact" }]
  });

  if (!paciente) {
    throw new AppError("Paciente não encontrado", 404);
  }

  return res.json(paciente);
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.user;
  const data = { ...req.body, companyId };

  const paciente = await Paciente.create(data);

  const io = getIO();
  io.emit(`company-${companyId}-paciente`, {
    action: "create",
    paciente
  });

  return res.status(201).json(paciente);
};

export const update = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { companyId } = req.user;

  const paciente = await Paciente.findOne({ where: { id, companyId } });

  if (!paciente) {
    throw new AppError("Paciente não encontrado", 404);
  }

  await paciente.update(req.body);

  const io = getIO();
  io.emit(`company-${companyId}-paciente`, {
    action: "update",
    paciente
  });

  return res.json(paciente);
};

export const remove = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { companyId } = req.user;

  const paciente = await Paciente.findOne({ where: { id, companyId } });

  if (!paciente) {
    throw new AppError("Paciente não encontrado", 404);
  }

  await paciente.destroy();

  const io = getIO();
  io.emit(`company-${companyId}-paciente`, {
    action: "delete",
    pacienteId: id
  });

  return res.status(200).json({ message: "Paciente removido" });
};

export const convertFromContact = async (req: Request, res: Response): Promise<Response> => {
  const { contactId } = req.params;
  const { companyId } = req.user;

  const contact = await Contact.findOne({ where: { id: contactId, companyId } });

  if (!contact) {
    throw new AppError("Contato não encontrado", 404);
  }

  const existingPaciente = await Paciente.findOne({ where: { contactId, companyId } });

  if (existingPaciente) {
    return res.json(existingPaciente);
  }

  const paciente = await Paciente.create({
    companyId,
    contactId,
    nome: contact.name,
    email: contact.email || "",
    telefone: contact.number,
    whatsapp: contact.number,
    status: "ATIVO",
    classificacao: "NOVO"
  });

  return res.status(201).json(paciente);
};

export const updateClassificacao = async (pacienteId: number): Promise<void> => {
  const paciente = await Paciente.findByPk(pacienteId);
  if (!paciente) return;

  let classificacao = "NOVO";
  if (paciente.numeroProcedimentos >= 10) classificacao = "OURO";
  else if (paciente.numeroProcedimentos >= 5) classificacao = "PRATA";
  else if (paciente.numeroProcedimentos >= 1) classificacao = "BRONZE";

  await paciente.update({ classificacao });
};
