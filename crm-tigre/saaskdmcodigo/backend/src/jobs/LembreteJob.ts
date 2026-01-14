import { CronJob } from "cron";
import { Op } from "sequelize";
import moment from "moment";
import Agendamento, { AgendamentoStatus } from "../models/Agendamento";
import AutomacaoService from "../services/AutomacaoServices/AutomacaoService";
import { logger } from "../utils/logger";

/**
 * Job que roda a cada hora e envia lembretes para agendamentos nas próximas 24h
 * Cron: 0 * * * * (a cada hora)
 */
export const LembreteJob = new CronJob(
  "0 * * * *", // Executa a cada hora no minuto 0
  async () => {
    logger.info("🕐 LembreteJob: Iniciando verificação de lembretes 24h");

    try {
      // Data/hora atual
      const agora = moment();

      // Intervalo: de 23h a 25h a partir de agora
      // (janela de 2h para garantir que não perca agendamentos)
      const inicio24h = agora.clone().add(23, "hours");
      const fim24h = agora.clone().add(25, "hours");

      logger.info(
        `LembreteJob: Buscando agendamentos entre ${inicio24h.format(
          "DD/MM/YYYY HH:mm"
        )} e ${fim24h.format("DD/MM/YYYY HH:mm")}`
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
          lembrete24hEnviado: false,
          // Data/hora do agendamento está no intervalo
          [Op.and]: [
            {
              dataAgendamento: {
                [Op.gte]: inicio24h.format("YYYY-MM-DD")
              }
            },
            {
              [Op.or]: [
                // Mesmo dia, hora dentro do intervalo
                {
                  [Op.and]: [
                    {
                      dataAgendamento: inicio24h.format("YYYY-MM-DD")
                    },
                    {
                      horaInicio: {
                        [Op.gte]: inicio24h.format("HH:mm")
                      }
                    }
                  ]
                },
                // Dia seguinte, hora dentro do intervalo
                {
                  [Op.and]: [
                    {
                      dataAgendamento: fim24h.format("YYYY-MM-DD")
                    },
                    {
                      horaInicio: {
                        [Op.lte]: fim24h.format("HH:mm")
                      }
                    }
                  ]
                }
              ]
            }
          ]
        },
        include: ["paciente", "procedimento"]
      });

      logger.info(
        `LembreteJob: Encontrados ${agendamentos.length} agendamentos para notificar`
      );

      // Enviar lembretes
      let sucessos = 0;
      let erros = 0;

      for (const agendamento of agendamentos) {
        try {
          await AutomacaoService.enviarLembrete24h(agendamento);
          sucessos++;
          logger.info(
            `✅ Lembrete 24h enviado para ${agendamento.paciente?.name} - Agendamento #${agendamento.id}`
          );
        } catch (error: any) {
          erros++;
          logger.error(
            `❌ Erro ao enviar lembrete 24h para agendamento #${agendamento.id}:`,
            error.message
          );
        }
      }

      logger.info(
        `LembreteJob: Finalizado. Sucessos: ${sucessos}, Erros: ${erros}`
      );
    } catch (error: any) {
      logger.error("❌ LembreteJob: Erro geral:", error);
    }
  },
  null, // onComplete
  false, // start (não inicia automaticamente, será iniciado pelo queues.ts)
  "America/Sao_Paulo" // timezone
);
