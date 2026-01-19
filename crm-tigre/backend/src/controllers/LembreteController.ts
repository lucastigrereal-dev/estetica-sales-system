import { Request, Response } from "express";
import { Op, Sequelize } from "sequelize";
import LembreteLog from "../models/LembreteLog";
import PesquisaNps from "../models/PesquisaNps";
import Agendamento from "../models/Agendamento";
import AppError from "../errors/AppError";

interface AuthRequest extends Request {
  user?: {
    id: string;
    companyId: number;
  };
}

/**
 * GET /lembretes/dashboard
 * Retorna resumo de lembretes do dia
 */
export const dashboard = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const { companyId } = req.user;

    // Lembretes de hoje
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);

    // Lembretes enviados hoje
    const totalEnviados = await LembreteLog.count({
      where: {
        companyId,
        status: { [Op.in]: ["ENVIADO", "RESPONDIDO"] },
        createdAt: { [Op.between]: [hoje, amanha] }
      }
    });

    // Lembretes com falha hoje
    const totalFalhas = await LembreteLog.count({
      where: {
        companyId,
        status: "FALHA",
        createdAt: { [Op.between]: [hoje, amanha] }
      }
    });

    // Taxa de entrega
    const totalTentativas = totalEnviados + totalFalhas;
    const taxaEntrega = totalTentativas > 0
      ? ((totalEnviados / totalTentativas) * 100).toFixed(1)
      : "0";

    // Lembretes respondidos
    const respondidos = await LembreteLog.count({
      where: {
        companyId,
        status: "RESPONDIDO",
        createdAt: { [Op.between]: [hoje, amanha] }
      }
    });

    const taxaResposta = totalEnviados > 0
      ? ((respondidos / totalEnviados) * 100).toFixed(1)
      : "0";

    // Próximos lembretes (próximas 24h)
    const amanhaPlusUm = new Date(amanha);
    amanhaPlusUm.setDate(amanhaPlusUm.getDate() + 1);

    const proximosLembretes = await LembreteLog.count({
      where: {
        companyId,
        status: "PENDENTE",
        createdAt: { [Op.between]: [amanha, amanhaPlusUm] }
      }
    });

    // Erros recentes
    const errosRecentes = await LembreteLog.findAll({
      where: {
        companyId,
        status: "FALHA",
        createdAt: { [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      },
      order: [["createdAt", "DESC"]],
      limit: 5,
      attributes: ["id", "tipo", "erroMensagem", "createdAt"]
    });

    return res.json({
      sucesso: true,
      dados: {
        hoje: {
          totalEnviados,
          totalFalhas,
          taxaEntrega: `${taxaEntrega}%`,
          respondidos,
          taxaResposta: `${taxaResposta}%`
        },
        proximos24h: proximosLembretes,
        errosRecentes: errosRecentes.map(e => ({
          id: e.id,
          tipo: e.tipo,
          erro: e.erroMensagem,
          data: e.createdAt
        }))
      }
    });
  } catch (error) {
    console.error("Erro ao buscar dashboard:", error);
    throw new AppError("Erro ao buscar dashboard de lembretes", 500);
  }
};

/**
 * GET /nps/resultado
 * Retorna análise de NPS com scores e feedback
 */
export const resultadoNps = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const { companyId } = req.user;

    // Total de respostas NPS
    const pesquisas = await PesquisaNps.findAll({
      where: {
        companyId,
        respondido: true
      }
    });

    // Scores por categoria
    let promotores = 0; // 9-10
    let passivos = 0; // 7-8
    let detratores = 0; // 0-6
    let totalScore = 0;

    pesquisas.forEach(p => {
      const score = p.score || 0;
      totalScore += score;

      if (score >= 9) {
        promotores++;
      } else if (score >= 7) {
        passivos++;
      } else {
        detratores++;
      }
    });

    const scoreMedio = pesquisas.length > 0
      ? (totalScore / pesquisas.length).toFixed(1)
      : "0";

    // NPS Score: (Promotores - Detratores) / Total * 100
    const total = pesquisas.length;
    const npsScore = total > 0
      ? Math.round(((promotores - detratores) / total) * 100)
      : 0;

    // Feedback por categoria
    const feedbackPromoteres = await PesquisaNps.findAll({
      where: {
        companyId,
        score: { [Op.gte]: 9 },
        respondido: true
      },
      attributes: ["id", "score", "comentario", "dataResposta"],
      order: [["dataResposta", "DESC"]],
      limit: 5
    });

    const feedbackPassivos = await PesquisaNps.findAll({
      where: {
        companyId,
        score: { [Op.between]: [7, 8] },
        respondido: true
      },
      attributes: ["id", "score", "comentario", "dataResposta"],
      order: [["dataResposta", "DESC"]],
      limit: 5
    });

    const feedbackDetratores = await PesquisaNps.findAll({
      where: {
        companyId,
        score: { [Op.lt]: 7 },
        respondido: true
      },
      attributes: ["id", "score", "comentario", "dataResposta"],
      order: [["dataResposta", "DESC"]],
      limit: 5
    });

    return res.json({
      sucesso: true,
      nps: {
        scoreMedio: parseFloat(String(scoreMedio)),
        npsScore,
        totalRespostas: total,
        promotores,
        passivos,
        detratores,
        distribuicao: {
          promotores: total > 0 ? ((promotores / total) * 100).toFixed(1) : "0",
          passivos: total > 0 ? ((passivos / total) * 100).toFixed(1) : "0",
          detratores: total > 0 ? ((detratores / total) * 100).toFixed(1) : "0"
        },
        feedbacks: {
          promotores: feedbackPromoteres,
          passivos: feedbackPassivos,
          detratores: feedbackDetratores
        }
      }
    });
  } catch (error) {
    console.error("Erro ao buscar resultado NPS:", error);
    throw new AppError("Erro ao buscar resultado NPS", 500);
  }
};

/**
 * POST /lembretes/reenviar/:id
 * Reenvia um lembrete que falhou
 */
export const reenviarLembrete = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const { companyId } = req.user;
    const { id } = req.params;

    const lembreteLog = await LembreteLog.findOne({
      where: {
        id,
        companyId
      }
    });

    if (!lembreteLog) {
      throw new AppError("Lembrete não encontrado", 404);
    }

    if (lembreteLog.status === "ENVIADO" || lembreteLog.status === "RESPONDIDO") {
      throw new AppError("Este lembrete já foi enviado com sucesso", 400);
    }

    // Atualizar tentativa
    const novasTentativas = (lembreteLog.tentativas || 0) + 1;

    try {
      // Aqui você chamaria a função de envio real
      // await SendMessage(lembreteLog.numeroWhatsapp, lembreteLog.mensagem, companyId);

      await lembreteLog.update({
        status: "ENVIADO",
        tentativas: novasTentativas,
        ultimaTentativa: new Date(),
        erroMensagem: null
      });

      return res.json({
        sucesso: true,
        mensagem: "Lembrete reenviado com sucesso",
        dados: {
          id: lembreteLog.id,
          status: "ENVIADO",
          tentativas: novasTentativas
        }
      });
    } catch (error) {
      await lembreteLog.update({
        status: "FALHA",
        tentativas: novasTentativas,
        ultimaTentativa: new Date(),
        erroMensagem: String(error)
      });

      throw new AppError("Erro ao reenviar lembrete", 500);
    }
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error("Erro ao reenviar lembrete:", error);
    throw new AppError("Erro ao reenviar lembrete", 500);
  }
};

/**
 * GET /lembretes/stats
 * Retorna estatísticas gerais de lembretes
 */
export const stats = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const { companyId } = req.user;

    // Total de lembretes por tipo (últimos 30 dias)
    const agoraM30d = new Date();
    agoraM30d.setDate(agoraM30d.getDate() - 30);

    const estatisticas = await LembreteLog.findAll({
      where: {
        companyId,
        createdAt: { [Op.gte]: agoraM30d }
      },
      attributes: [
        "tipo",
        "status",
        [Sequelize.fn("COUNT", Sequelize.col("id")), "count"]
      ],
      group: ["tipo", "status"],
      raw: true
    });

    // Totalizar por tipo
    const porTipo: Record<string, any> = {};

    estatisticas.forEach((stat: any) => {
      if (!porTipo[stat.tipo]) {
        porTipo[stat.tipo] = {
          total: 0,
          enviados: 0,
          falhas: 0,
          respondidos: 0
        };
      }

      const count = parseInt(stat.count, 10);
      porTipo[stat.tipo].total += count;

      if (stat.status === "ENVIADO") porTipo[stat.tipo].enviados = count;
      if (stat.status === "FALHA") porTipo[stat.tipo].falhas = count;
      if (stat.status === "RESPONDIDO") porTipo[stat.tipo].respondidos = count;
    });

    // Total geral
    const totalGeral = await LembreteLog.count({
      where: {
        companyId,
        createdAt: { [Op.gte]: agoraM30d }
      }
    });

    const totalEnviados = await LembreteLog.count({
      where: {
        companyId,
        status: { [Op.in]: ["ENVIADO", "RESPONDIDO"] },
        createdAt: { [Op.gte]: agoraM30d }
      }
    });

    const totalFalhas = await LembreteLog.count({
      where: {
        companyId,
        status: "FALHA",
        createdAt: { [Op.gte]: agoraM30d }
      }
    });

    const taxaEntrega = totalGeral > 0
      ? ((totalEnviados / totalGeral) * 100).toFixed(1)
      : "0";

    return res.json({
      sucesso: true,
      stats: {
        periodoAnalise: "30 últimos dias",
        totalGeral,
        totalEnviados,
        totalFalhas,
        taxaEntrega: `${taxaEntrega}%`,
        porTipo,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    throw new AppError("Erro ao buscar estatísticas", 500);
  }
};

/**
 * GET /lembretes/status/:id
 * Retorna status de um lembrete específico
 */
export const statusLembrete = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const { companyId } = req.user;
    const { id } = req.params;

    const lembreteLog = await LembreteLog.findOne({
      where: {
        id,
        companyId
      },
      include: [
        { association: "paciente", attributes: ["id", "nome", "whatsapp"] },
        { association: "agendamento", attributes: ["id", "status", "dataAgendamento"] }
      ]
    });

    if (!lembreteLog) {
      throw new AppError("Lembrete não encontrado", 404);
    }

    return res.json({
      sucesso: true,
      dados: lembreteLog
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error("Erro ao buscar status:", error);
    throw new AppError("Erro ao buscar status do lembrete", 500);
  }
};
