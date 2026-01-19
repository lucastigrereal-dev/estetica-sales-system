import { Request, Response } from "express";
import { processarMensagemAurora, qualificarLead, gerarResposta, analisarSentimento } from "../services/AuroraService";
import Ticket from "../models/Ticket";
import Message from "../models/Message";

/**
 * AURORA CONTROLLER
 * Endpoints para gerenciar Aurora IA
 */

/**
 * POST /aurora/processar-mensagem
 * Processa uma mensagem com Aurora
 * Retorna resposta, score de qualificação e análise
 */
export const processarMensagem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ticketId, mensagem, companyId } = req.body;

    // Validação
    if (!ticketId || !mensagem || !companyId) {
      res.status(400).json({
        error: "Parâmetros inválidos",
        requeridos: ["ticketId", "mensagem", "companyId"]
      });
      return;
    }

    // Verificar se ticket existe
    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket) {
      res.status(404).json({ error: "Ticket não encontrado" });
      return;
    }

    // Processar com Aurora
    const resultado = await processarMensagemAurora(ticketId, mensagem, companyId);

    // Retornar resultado
    res.status(200).json({
      sucesso: true,
      dados: {
        resposta: resultado.resposta,
        score: resultado.score,
        qualificacao: {
          score: resultado.qualificacao.score,
          interessado: resultado.qualificacao.interessado,
          procedimentoSugerido: resultado.qualificacao.procedimentoSugerido,
          melhorDia: resultado.qualificacao.melhorDia,
          melhorHorario: resultado.qualificacao.melhorHorario,
          sentimento: resultado.qualificacao.sentimento
        },
        status: resultado.score >= 70 ? "qualificado" : resultado.score >= 40 ? "em_qualificacao" : "nao_qualificado"
      }
    });
  } catch (error) {
    console.error("❌ Erro processarMensagem:", error);
    res.status(500).json({
      error: "Erro ao processar mensagem com Aurora",
      detalhes: error instanceof Error ? error.message : "Erro desconhecido"
    });
  }
};

/**
 * GET /aurora/qualificar/:ticketId
 * Qualifica um lead baseado no histórico do ticket
 */
export const qualificarLeadEndpoint = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ticketId } = req.params;

    // Verificar se ticket existe
    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket) {
      res.status(404).json({ error: "Ticket não encontrado" });
      return;
    }

    // Qualificar
    const qualificacao = await qualificarLead(parseInt(ticketId));

    res.status(200).json({
      sucesso: true,
      dados: {
        ticketId: parseInt(ticketId),
        qualificacao: {
          score: qualificacao.score,
          status: qualificacao.score >= 70 ? "qualificado" : qualificacao.score >= 40 ? "em_qualificacao" : "nao_qualificado",
          interessado: qualificacao.interessado,
          procedimento: qualificacao.procedimentoSugerido,
          melhorDia: qualificacao.melhorDia,
          melhorHorario: qualificacao.melhorHorario,
          sentimento: qualificacao.sentimento,
          sentimentoLabel:
            qualificacao.sentimento > 0.5 ? "muito_positivo" :
            qualificacao.sentimento > 0 ? "positivo" :
            qualificacao.sentimento > -0.5 ? "neutro" :
            "negativo"
        }
      }
    });
  } catch (error) {
    console.error("❌ Erro qualificarLeadEndpoint:", error);
    res.status(500).json({
      error: "Erro ao qualificar lead",
      detalhes: error instanceof Error ? error.message : "Erro desconhecido"
    });
  }
};

/**
 * POST /aurora/testar
 * Testa Aurora com uma mensagem customizada
 * Útil para debugging e testes
 */
export const testarAurora = async (req: Request, res: Response): Promise<void> => {
  try {
    const { mensagem, historico = [] } = req.body;

    if (!mensagem) {
      res.status(400).json({ error: "Mensagem é obrigatória" });
      return;
    }

    // Gerar resposta de teste
    const resposta = await gerarResposta(mensagem, historico);

    // Analisar sentimento
    const sentimento = await analisarSentimento(mensagem);

    res.status(200).json({
      sucesso: true,
      teste: {
        mensagemRecebida: mensagem,
        respostaAurora: resposta,
        sentimento: {
          score: sentimento,
          label:
            sentimento > 0.5 ? "muito_positivo" :
            sentimento > 0 ? "positivo" :
            sentimento > -0.5 ? "neutro" :
            "negativo"
        }
      }
    });
  } catch (error) {
    console.error("❌ Erro testarAurora:", error);
    res.status(500).json({
      error: "Erro ao testar Aurora",
      detalhes: error instanceof Error ? error.message : "Erro desconhecido"
    });
  }
};

/**
 * GET /aurora/stats
 * Retorna estatísticas de uso de Aurora
 */
export const getStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { companyId } = req.query;

    if (!companyId) {
      res.status(400).json({ error: "companyId é obrigatório" });
      return;
    }

    // Buscar tickets da empresa
    const tickets = await Ticket.findAll({
      where: { companyId: parseInt(companyId as string) },
      limit: 100,
      order: [["createdAt", "DESC"]]
    });

    // Calcular estatísticas
    const totalTickets = tickets.length;
    const ticketsAbertos = tickets.filter(t => t.status !== "closed").length;
    const ticketsFechados = tickets.filter(t => t.status === "closed").length;

    res.status(200).json({
      sucesso: true,
      stats: {
        totalTickets,
        ticketsAbertos,
        ticketsFechados,
        taxaFechamento: totalTickets > 0 ? ((ticketsFechados / totalTickets) * 100).toFixed(1) + "%" : "0%",
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("❌ Erro getStats:", error);
    res.status(500).json({
      error: "Erro ao obter estatísticas",
      detalhes: error instanceof Error ? error.message : "Erro desconhecido"
    });
  }
};

/**
 * GET /aurora/health
 * Verifica se Aurora está funcionando
 */
export const health = async (req: Request, res: Response): Promise<void> => {
  try {
    // Testar com uma mensagem simples
    const testMessage = "Olá";
    const testResponse = await gerarResposta(testMessage, []);

    const isHealthy = testResponse && testResponse.length > 0;

    res.status(isHealthy ? 200 : 500).json({
      sucesso: isHealthy,
      status: isHealthy ? "ativo" : "inativo",
      servico: "Aurora IA",
      timestamp: new Date().toISOString(),
      detalhes: {
        openaiConfigured: !!process.env.OPENAI_API_KEY,
        model: process.env.OPENAI_MODEL || "gpt-4-turbo-preview"
      }
    });
  } catch (error) {
    console.error("❌ Erro health check Aurora:", error);
    res.status(500).json({
      sucesso: false,
      status: "erro",
      servico: "Aurora IA",
      error: error instanceof Error ? error.message : "Erro desconhecido"
    });
  }
};

export default {
  processarMensagem,
  qualificarLeadEndpoint,
  testarAurora,
  getStats,
  health
};
