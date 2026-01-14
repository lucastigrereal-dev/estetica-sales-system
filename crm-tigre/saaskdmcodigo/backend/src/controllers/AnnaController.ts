import { Request, Response } from "express";
import { Op } from "sequelize";
import AnnaService from "../services/AnnaService";
import TicketAnalysis from "../models/TicketAnalysis";
import sequelize from "sequelize";

export const getAnalysis = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { ticketId } = req.params;
  const { companyId } = req.user;

  const analysis = await TicketAnalysis.findOne({
    where: { ticketId, companyId }
  });

  return res.json(analysis || {});
};

export const getResumo = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { ticketId } = req.params;

  const resumo = await AnnaService.gerarResumo(Number(ticketId));

  return res.json({ resumo });
};

export const converterAgendamento = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { ticketId } = req.params;
  const { scheduleId } = req.body;

  await AnnaService.converterEmAgendamento(Number(ticketId), scheduleId);

  return res.json({ success: true });
};

export const getDashboard = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { companyId } = req.user;

  // Métricas da Anna
  const totalConversas = await TicketAnalysis.count({ where: { companyId } });
  const totalQualificados = await TicketAnalysis.count({
    where: { companyId, scoreQualificacao: { [Op.gte]: 70 } }
  });
  const totalConvertidos = await TicketAnalysis.count({
    where: { companyId, convertido: true }
  });

  const taxaConversao =
    totalConversas > 0
      ? ((totalConvertidos / totalConversas) * 100).toFixed(2)
      : 0;

  // Procedimentos mais procurados
  const procedimentos = await TicketAnalysis.findAll({
    where: { companyId, procedimentoInteresse: { [Op.ne]: null } },
    attributes: [
      "procedimentoInteresse",
      [sequelize.fn("COUNT", sequelize.col("id")), "count"]
    ],
    group: ["procedimentoInteresse"],
    order: [[sequelize.literal("count"), "DESC"]],
    limit: 10,
    raw: true
  });

  return res.json({
    totalConversas,
    totalQualificados,
    totalConvertidos,
    taxaConversao,
    procedimentos
  });
};
