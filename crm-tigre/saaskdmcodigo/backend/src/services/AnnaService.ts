import Ticket from "../models/Ticket";
import TicketAnalysis from "../models/TicketAnalysis";
import Contact from "../models/Contact";
import Company from "../models/Company";
import Setting from "../models/Setting";
import OpenAIService from "./OpenAIService";
import SendWhatsAppMessage from "./WbotServices/SendWhatsAppMessage";
import { logger } from "../utils/logger";
import { getIO } from "../libs/socket";

interface ProcessarMensagemResponse {
  deveContinuar: boolean;
  transferirPara?: "chatbot" | "humano";
  mensagemResposta?: string;
}

class AnnaService {
  async processarMensagem(
    ticketId: number,
    mensagemUsuario: string,
    companyId: number
  ): Promise<ProcessarMensagemResponse> {
    try {
      // 1. Buscar ticket e análise
      const ticket = await Ticket.findByPk(ticketId, {
        include: [
          { model: Contact, as: "contact" },
          { model: Company, as: "company" }
        ]
      });

      if (!ticket) {
        throw new Error("Ticket não encontrado");
      }

      // 2. Buscar ou criar TicketAnalysis
      let analysis = await TicketAnalysis.findOne({ where: { ticketId } });
      if (!analysis) {
        analysis = await TicketAnalysis.create({
          ticketId,
          companyId,
          historicoConversa: []
        });
      }

      // 3. Buscar configurações da clínica
      const procedimentosSetting = await Setting.findOne({
        where: { key: "procedimentosDisponiveis", companyId }
      });
      const horarioSetting = await Setting.findOne({
        where: { key: "horarioFuncionamento", companyId }
      });

      const contexto = {
        nomeClinica: ticket.company.name,
        procedimentosDisponiveis: procedimentosSetting?.value?.split(",") || [
          "Botox",
          "Preenchimento",
          "Limpeza de Pele",
          "Peeling"
        ],
        horarioFuncionamento:
          horarioSetting?.value || "Segunda a Sexta: 9h às 18h",
        nomeContato: ticket.contact.name
      };

      // 4. Atualizar histórico
      const historicoAtualizado = [
        ...(analysis.historicoConversa as any[]),
        { role: "user", content: mensagemUsuario }
      ];

      // 5. Gerar resposta conversacional
      const respostaAnna = await OpenAIService.gerarResposta(
        mensagemUsuario,
        contexto,
        historicoAtualizado
      );

      historicoAtualizado.push({
        role: "assistant",
        content: respostaAnna
      });

      // 6. Analisar sentimento
      const sentimento = await OpenAIService.analisarSentimento(
        mensagemUsuario
      );
      const sentimentoAtualizado =
        (analysis.sentimentoMedio * ticket.annaStage + sentimento.score) /
        (ticket.annaStage + 1);

      // 7. Qualificar lead (a cada 3 mensagens ou quando >= 6 mensagens)
      let qualificacao = null;
      if (
        historicoAtualizado.length >= 6 &&
        historicoAtualizado.length % 6 === 0
      ) {
        qualificacao = await OpenAIService.qualificarLead(historicoAtualizado);

        await analysis.update({
          scoreQualificacao: qualificacao.score,
          procedimentoInteresse: qualificacao.procedimentoInteresse,
          experienciaPrevia: qualificacao.experienciaPrevia,
          melhorDia: qualificacao.melhorDia,
          melhorHorario: qualificacao.melhorHorario,
          observacoes: qualificacao.observacoes,
          sentimentoMedio: sentimentoAtualizado,
          historicoConversa: historicoAtualizado as any
        });

        // Emitir atualização de análise via Socket.IO
        const io = getIO();
        io.to(`company-${companyId}-ticket`).emit("ticketAnalysis", {
          action: "update",
          ticketId,
          analysis
        });

        // 8. Decidir próximo passo
        if (qualificacao.pronto && qualificacao.score > 70) {
          // QUALIFICADO - Sugerir agendamento
          await ticket.update({ annaActive: false, annaStage: 5 });

          const mensagemAgendamento = `${respostaAnna}\n\n*Você está qualificado(a)! 🎉*\n\nGostaria de agendar sua avaliação gratuita?\n\n*[ 1 ]* - Sim, agendar agora\n*[ 2 ]* - Falar com atendente\n*[ 3 ]* - Depois eu retorno`;

          await SendWhatsAppMessage({ body: mensagemAgendamento, ticket });

          return {
            deveContinuar: false,
            mensagemResposta: mensagemAgendamento
          };
        } else if (qualificacao.score < 40) {
          // NÃO QUALIFICADO - Transferir para chatbot ou humano
          await ticket.update({ annaActive: false, chatbot: true });

          return {
            deveContinuar: false,
            transferirPara: "chatbot",
            mensagemResposta: respostaAnna
          };
        }
      } else {
        // Apenas atualizar histórico
        await analysis.update({
          sentimentoMedio: sentimentoAtualizado,
          historicoConversa: historicoAtualizado as any
        });
        await ticket.update({ annaStage: ticket.annaStage + 1 });
      }

      // 9. Enviar resposta
      await SendWhatsAppMessage({ body: respostaAnna, ticket });

      return {
        deveContinuar: true,
        mensagemResposta: respostaAnna
      };
    } catch (error) {
      logger.error("Erro ao processar mensagem Anna:", error);
      throw error;
    }
  }

  async gerarResumo(ticketId: number): Promise<string> {
    const analysis = await TicketAnalysis.findOne({ where: { ticketId } });
    if (!analysis || !(analysis.historicoConversa as any[]).length) {
      return "Sem histórico de conversa.";
    }

    return await OpenAIService.gerarResumoConversa(
      analysis.historicoConversa as any[]
    );
  }

  async converterEmAgendamento(
    ticketId: number,
    scheduleId: number
  ): Promise<void> {
    const analysis = await TicketAnalysis.findOne({ where: { ticketId } });
    if (analysis) {
      await analysis.update({
        convertido: true,
        agendamentoId: scheduleId
      });
    }
  }
}

export default new AnnaService();
