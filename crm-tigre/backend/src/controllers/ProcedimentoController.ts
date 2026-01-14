import { Request, Response } from "express";
import { getIO } from "../libs/socket";
import Procedimento from "../models/Procedimento";
import AppError from "../errors/AppError";
import { Op } from "sequelize";

export const index = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.user;
  const { searchParam, categoria, ativo } = req.query;

  const whereCondition: any = { companyId };

  if (searchParam) {
    whereCondition.nome = { [Op.like]: `%${searchParam}%` };
  }
  if (categoria) whereCondition.categoria = categoria;
  if (ativo !== undefined) whereCondition.ativo = ativo === "true";

  const procedimentos = await Procedimento.findAll({
    where: whereCondition,
    order: [["nome", "ASC"]]
  });

  return res.json(procedimentos);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { companyId } = req.user;

  const procedimento = await Procedimento.findOne({ where: { id, companyId } });

  if (!procedimento) {
    throw new AppError("Procedimento não encontrado", 404);
  }

  return res.json(procedimento);
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.user;
  const data = { ...req.body, companyId };

  const procedimento = await Procedimento.create(data);

  const io = getIO();
  io.emit(`company-${companyId}-procedimento`, { action: "create", procedimento });

  return res.status(201).json(procedimento);
};

export const update = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { companyId } = req.user;

  const procedimento = await Procedimento.findOne({ where: { id, companyId } });

  if (!procedimento) {
    throw new AppError("Procedimento não encontrado", 404);
  }

  await procedimento.update(req.body);

  const io = getIO();
  io.emit(`company-${companyId}-procedimento`, { action: "update", procedimento });

  return res.json(procedimento);
};

export const remove = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { companyId } = req.user;

  const procedimento = await Procedimento.findOne({ where: { id, companyId } });

  if (!procedimento) {
    throw new AppError("Procedimento não encontrado", 404);
  }

  await procedimento.destroy();

  const io = getIO();
  io.emit(`company-${companyId}-procedimento`, { action: "delete", procedimentoId: id });

  return res.status(200).json({ message: "Procedimento removido" });
};
