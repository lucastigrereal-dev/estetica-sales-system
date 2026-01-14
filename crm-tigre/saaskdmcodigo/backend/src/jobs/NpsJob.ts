import { CronJob } from "cron";
import { Op } from "sequelize";
import moment from "moment";
import Agendamento, { AgendamentoStatus } from "../models/Agendamento";
import Automacao, { TipoAutomacao } from "../models/Automacao";
import AutomacaoService from "../services/AutomacaoServices/AutomacaoService";
import { logger } from "../utils/logger";

/**
 * Job que roda às 20:00 e envia pesquisa NPS para agendamentos realizados no dia
 * Cron: 0 20 * * * (todos os dias às 20:00)
 */
export const NpsJob = new CronJob(
  "0 20 * * *", // Executa às 20:00 todos os dias
  async () => {
    logger.info("📊 NpsJob: Iniciando envio de pesquisas NPS");

    try {
      // Data de hoje
      const hoje = moment().format("YYYY-MM-DD");

      logger.info(`NpsJob: Buscando agendamentos realizados em ${hoje}`);

      // Buscar agendamentos realizados hoje
      const agendamentos = await Agendamento.findAll({
        where: {
          // Status REALIZADO
          status: AgendamentoStatus.REALIZADO,
          // Data de hoje
          dataAgendamento: hoje
        },
        include: ["paciente", "procedimento"]
      });

      logger.info(
        `NpsJob: Encontrados ${agendamentos.length} agendamentos realizados hoje`
      );

      // Filtrar agendamentos que ainda não receberam NPS
      const agendamentosSemNps = [];

      for (const agendamento of agendamentos) {
        // Verificar se já existe automação NPS para este agendamento
        const npsExistente = await Automacao.findOne({
          where: {
            tipo: TipoAutomacao.NPS,
            agendamentoId: agendamento.id
          }
        });

        if (!npsExistente) {
          agendamentosSemNps.push(agendamento);
        }
      }

      logger.info(
        `NpsJob: ${agendamentosSemNps.length} agendamentos sem NPS enviado`
      );

      // Enviar NPS
      let sucessos = 0;
      let erros = 0;

      for (const agendamento of agendamentosSemNps) {
        try {
          await AutomacaoService.enviarNps(agendamento);
          sucessos++;
          logger.info(
            `✅ NPS enviado para ${agendamento.paciente?.name} - Agendamento #${agendamento.id}`
          );
        } catch (error: any) {
          erros++;
          logger.error(
            `❌ Erro ao enviar NPS para agendamento #${agendamento.id}:`,
            error.message
          );
        }
      }

      logger.info(`NpsJob: Finalizado. Sucessos: ${sucessos}, Erros: ${erros}`);
    } catch (error: any) {
      logger.error("❌ NpsJob: Erro geral:", error);
    }
  },
  null, // onComplete
  false, // start (não inicia automaticamente)
  "America/Sao_Paulo" // timezone
);
