import { CronJob } from "cron";
import { Op, QueryTypes } from "sequelize";
import moment from "moment";
import Contact from "../models/Contact";
import Agendamento from "../models/Agendamento";
import Automacao, { TipoAutomacao } from "../models/Automacao";
import AutomacaoService from "../services/AutomacaoServices/AutomacaoService";
import { logger } from "../utils/logger";
import sequelize from "../database";

/**
 * Job que roda toda segunda-feira às 10:00 e envia mensagens de reativação
 * para pacientes sem agendamento há 30, 60 ou 90 dias
 * Cron: 0 10 * * 1 (toda segunda às 10:00)
 */
export const ReativacaoJob = new CronJob(
  "0 10 * * 1", // Executa toda segunda-feira às 10:00
  async () => {
    logger.info("🔄 ReativacaoJob: Iniciando busca de pacientes inativos");

    try {
      // Datas de referência
      const data30dias = moment().subtract(30, "days").format("YYYY-MM-DD");
      const data60dias = moment().subtract(60, "days").format("YYYY-MM-DD");
      const data90dias = moment().subtract(90, "days").format("YYYY-MM-DD");

      logger.info(
        `ReativacaoJob: Buscando pacientes sem agendamento desde ${data90dias}`
      );

      // Query SQL para buscar pacientes com último agendamento em períodos específicos
      const query = `
        SELECT
          c.id,
          c.name,
          c.number,
          c.companyId,
          MAX(a.dataAgendamento) as ultimoAgendamento,
          DATEDIFF(CURRENT_DATE, MAX(a.dataAgendamento)) as diasSemContato
        FROM Contacts c
        INNER JOIN Agendamentos a ON a.pacienteId = c.id
        WHERE a.status IN ('REALIZADO', 'CONFIRMADO')
        GROUP BY c.id, c.name, c.number, c.companyId
        HAVING
          (DATEDIFF(CURRENT_DATE, MAX(a.dataAgendamento)) BETWEEN 30 AND 35)
          OR (DATEDIFF(CURRENT_DATE, MAX(a.dataAgendamento)) BETWEEN 60 AND 65)
          OR (DATEDIFF(CURRENT_DATE, MAX(a.dataAgendamento)) BETWEEN 90 AND 95)
      `;

      const pacientes: any[] = await sequelize.query(query, {
        type: QueryTypes.SELECT
      });

      logger.info(
        `ReativacaoJob: Encontrados ${pacientes.length} pacientes inativos`
      );

      // Agrupar por período
      const pacientes30d = pacientes.filter(
        (p) => p.diasSemContato >= 30 && p.diasSemContato < 60
      );
      const pacientes60d = pacientes.filter(
        (p) => p.diasSemContato >= 60 && p.diasSemContato < 90
      );
      const pacientes90d = pacientes.filter((p) => p.diasSemContato >= 90);

      logger.info(`ReativacaoJob: 30 dias: ${pacientes30d.length}`);
      logger.info(`ReativacaoJob: 60 dias: ${pacientes60d.length}`);
      logger.info(`ReativacaoJob: 90 dias: ${pacientes90d.length}`);

      let sucessos = 0;
      let erros = 0;

      // Processar todos os pacientes
      for (const pacienteData of pacientes) {
        try {
          // Verificar se já enviou reativação recentemente (últimos 7 dias)
          const reativacaoRecente = await Automacao.findOne({
            where: {
              pacienteId: pacienteData.id,
              tipo: {
                [Op.in]: [
                  TipoAutomacao.REATIVACAO_30D,
                  TipoAutomacao.REATIVACAO_60D,
                  TipoAutomacao.REATIVACAO_90D
                ]
              },
              createdAt: {
                [Op.gte]: moment().subtract(7, "days").toDate()
              }
            }
          });

          if (reativacaoRecente) {
            logger.info(
              `⏭️ Pulando ${pacienteData.name} - reativação enviada recentemente`
            );
            continue;
          }

          // Buscar contato completo
          const contato = await Contact.findByPk(pacienteData.id);

          if (!contato) {
            logger.warn(`Contato ${pacienteData.id} não encontrado`);
            continue;
          }

          // Buscar procedimento favorito (mais realizado)
          const procedimentoFavorito = await sequelize.query(
            `
            SELECT p.nome, COUNT(*) as total
            FROM Agendamentos a
            INNER JOIN Procedimentos p ON p.id = a.procedimentoId
            WHERE a.pacienteId = :pacienteId
            AND a.status = 'REALIZADO'
            GROUP BY p.id, p.nome
            ORDER BY total DESC
            LIMIT 1
          `,
            {
              replacements: { pacienteId: pacienteData.id },
              type: QueryTypes.SELECT
            }
          );

          const nomeProcedimento =
            procedimentoFavorito && procedimentoFavorito.length > 0
              ? (procedimentoFavorito[0] as any).nome
              : "tratamento";

          // Enviar mensagem de reativação
          await AutomacaoService.enviarReativacao(
            contato,
            pacienteData.diasSemContato,
            pacienteData.companyId,
            nomeProcedimento
          );

          sucessos++;
          logger.info(
            `✅ Reativação enviada para ${pacienteData.name} (${pacienteData.diasSemContato} dias)`
          );
        } catch (error: any) {
          erros++;
          logger.error(
            `❌ Erro ao enviar reativação para ${pacienteData.name}:`,
            error.message
          );
        }
      }

      logger.info(
        `ReativacaoJob: Finalizado. Sucessos: ${sucessos}, Erros: ${erros}`
      );
    } catch (error: any) {
      logger.error("❌ ReativacaoJob: Erro geral:", error);
    }
  },
  null, // onComplete
  false, // start (não inicia automaticamente)
  "America/Sao_Paulo" // timezone
);
