import { CronJob } from "cron";
import { Op } from "sequelize";
import moment from "moment";
import Agendamento, { AgendamentoStatus } from "../models/Agendamento";
import AutomacaoService from "../services/AutomacaoServices/AutomacaoService";
import { logger } from "../utils/logger";

/**
 * Job que roda a cada 30 minutos e envia lembretes para agendamentos nas próximas 2h
 * Cron: */30 * * * * (a cada 30 minutos)
 */
export const Lembrete2hJob = new CronJob(
  "*/30 * * * *", // Executa a cada 30 minutos
  async () => {
    logger.info("🕑 Lembrete2hJob: Iniciando verificação de lembretes 2h");

    try {
      // Data/hora atual
      const agora = moment();

      // Intervalo: de 1h50min a 2h10min a partir de agora
      // (janela de 20min para garantir que não perca agendamentos)
      const inicio2h = agora.clone().add(1, "hours").add(50, "minutes");
      const fim2h = agora.clone().add(2, "hours").add(10, "minutes");

      logger.info(
        `Lembrete2hJob: Buscando agendamentos entre ${inicio2h.format(
          "DD/MM/YYYY HH:mm"
        )} e ${fim2h.format("DD/MM/YYYY HH:mm")}`
      );

      // Buscar agendamentos que precisam de lembrete
      const agendamentos = await Agendamento.findAll({
        where: {
          // Status válidos
          status: {
            [Op.in]: [
              AgendamentoStatus.AGENDADO,
              AgendamentoStatus.CONFIRMADO
            ]
          },
          // Lembrete ainda não enviado
          lembrete2hEnviado: false,
          // Lembrete 24h já foi enviado (opcional, mas recomendado)
          lembrete24hEnviado: true,
          // Data/hora do agendamento está no intervalo
          [Op.and]: [
            {
              dataAgendamento: {
                [Op.gte]: inicio2h.format("YYYY-MM-DD"),
                [Op.lte]: fim2h.format("YYYY-MM-DD")
              }
            },
            {
              horaInicio: {
                [Op.gte]: inicio2h.format("HH:mm"),
                [Op.lte]: fim2h.format("HH:mm")
              }
            }
          ]
        },
        include: ["paciente", "procedimento"]
      });

      logger.info(
        `Lembrete2hJob: Encontrados ${agendamentos.length} agendamentos para notificar`
      );

      // Enviar lembretes
      let sucessos = 0;
      let erros = 0;

      for (const agendamento of agendamentos) {
        try {
          await AutomacaoService.enviarLembrete2h(agendamento);
          sucessos++;
          logger.info(
            `✅ Lembrete 2h enviado para ${agendamento.paciente?.name} - Agendamento #${agendamento.id}`
          );
        } catch (error: any) {
          erros++;
          logger.error(
            `❌ Erro ao enviar lembrete 2h para agendamento #${agendamento.id}:`,
            error.message
          );
        }
      }

      logger.info(
        `Lembrete2hJob: Finalizado. Sucessos: ${sucessos}, Erros: ${erros}`
      );
    } catch (error: any) {
      logger.error("❌ Lembrete2hJob: Erro geral:", error);
    }
  },
  null, // onComplete
  false, // start (não inicia automaticamente)
  "America/Sao_Paulo" // timezone
);
