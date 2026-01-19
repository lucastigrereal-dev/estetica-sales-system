import CronJob from "cron";
import {
  enviarLembrete24h,
  enviarLembrete2h,
  enviarNps,
  enviarReativacao
} from "../services/LembreteService";

/**
 * LEMBRETE JOBS
 * Cron jobs para envio automático de lembretes via WhatsApp
 */

let jobs: CronJob[] = [];

/**
 * Job 1: Lembrete 24h
 * Executa: Todos os dias às 09:00
 * Ação: Envia lembretes para agendamentos de amanhã
 */
const setupLembrete24h = (): CronJob => {
  const job = new CronJob("0 9 * * *", async () => {
    console.log("\n⏰ [LEMBRETE 24H] Iniciando job agendado às 09:00");
    try {
      await enviarLembrete24h();
      console.log("✅ [LEMBRETE 24H] Job completado com sucesso\n");
    } catch (error) {
      console.error("❌ [LEMBRETE 24H] Erro ao executar job:", error);
    }
  });

  job.start();
  console.log("✅ Job LEMBRETE 24H registrado: 0 9 * * * (09:00 diariamente)");
  return job;
};

/**
 * Job 2: Lembrete 2h
 * Executa: A cada 30 minutos (*/30 * * * *)
 * Ação: Envia lembretes para agendamentos nos próximos 2 horas
 */
const setupLembrete2h = (): CronJob => {
  const job = new CronJob("*/30 * * * *", async () => {
    console.log("\n⏰ [LEMBRETE 2H] Verificando agendamentos (a cada 30 min)");
    try {
      await enviarLembrete2h();
      console.log("✅ [LEMBRETE 2H] Verificação completada\n");
    } catch (error) {
      console.error("❌ [LEMBRETE 2H] Erro ao executar job:", error);
    }
  });

  job.start();
  console.log("✅ Job LEMBRETE 2H registrado: */30 * * * * (a cada 30 minutos)");
  return job;
};

/**
 * Job 3: NPS Survey
 * Executa: Todos os dias às 20:00
 * Ação: Envia pesquisa NPS para agendamentos realizados hoje
 */
const setupNpsJob = (): CronJob => {
  const job = new CronJob("0 20 * * *", async () => {
    console.log("\n⏰ [NPS SURVEY] Iniciando job agendado às 20:00");
    try {
      await enviarNps();
      console.log("✅ [NPS SURVEY] Job completado com sucesso\n");
    } catch (error) {
      console.error("❌ [NPS SURVEY] Erro ao executar job:", error);
    }
  });

  job.start();
  console.log("✅ Job NPS SURVEY registrado: 0 20 * * * (20:00 diariamente)");
  return job;
};

/**
 * Job 4: Reativação
 * Executa: Toda segunda-feira às 10:00
 * Ação: Envia mensagens de reativação para pacientes inativos (90+ dias)
 */
const setupReativacaoJob = (): CronJob => {
  const job = new CronJob("0 10 * * 1", async () => {
    console.log("\n⏰ [REATIVAÇÃO] Iniciando job agendado às 10:00 (segunda-feira)");
    try {
      await enviarReativacao();
      console.log("✅ [REATIVAÇÃO] Job completado com sucesso\n");
    } catch (error) {
      console.error("❌ [REATIVAÇÃO] Erro ao executar job:", error);
    }
  });

  job.start();
  console.log("✅ Job REATIVAÇÃO registrado: 0 10 * * 1 (10:00 às segundas-feiras)");
  return job;
};

/**
 * Iniciar todos os jobs de lembrete
 */
export const startLembreteJobs = (): void => {
  console.log("\n🚀 ========== INICIANDO JOBS DE LEMBRETE ==========\n");

  try {
    // Registrar todos os jobs
    jobs.push(setupLembrete24h());
    jobs.push(setupLembrete2h());
    jobs.push(setupNpsJob());
    jobs.push(setupReativacaoJob());

    console.log("\n✅ Todos os 4 jobs de lembrete foram registrados com sucesso!");
    console.log("\n📋 CRONOGRAMA DE EXECUÇÃO:");
    console.log("   1️⃣  LEMBRETE 24H ......... 09:00 (diariamente)");
    console.log("   2️⃣  LEMBRETE 2H .......... a cada 30 minutos");
    console.log("   3️⃣  NPS SURVEY ........... 20:00 (diariamente)");
    console.log("   4️⃣  REATIVAÇÃO ........... 10:00 (segundas-feiras)");
    console.log("\n==============================================\n");
  } catch (error) {
    console.error("❌ Erro ao iniciar jobs de lembrete:", error);
    throw error;
  }
};

/**
 * Parar todos os jobs de lembrete
 */
export const stopLembreteJobs = (): void => {
  console.log("\n⏹️  Parando todos os jobs de lembrete...");

  jobs.forEach((job, index) => {
    job.stop();
    console.log(`  ✓ Job ${index + 1} parado`);
  });

  jobs = [];
  console.log("✅ Todos os jobs foram parados\n");
};

/**
 * Obter status dos jobs
 */
export const getLembreteJobsStatus = (): Array<{
  id: number;
  descricao: string;
  cronExpression: string;
  ativo: boolean;
}> => {
  return [
    {
      id: 1,
      descricao: "Lembrete 24h",
      cronExpression: "0 9 * * * (09:00 diariamente)",
      ativo: jobs.length > 0 && jobs[0]?.running === true
    },
    {
      id: 2,
      descricao: "Lembrete 2h",
      cronExpression: "*/30 * * * * (a cada 30 minutos)",
      ativo: jobs.length > 1 && jobs[1]?.running === true
    },
    {
      id: 3,
      descricao: "NPS Survey",
      cronExpression: "0 20 * * * (20:00 diariamente)",
      ativo: jobs.length > 2 && jobs[2]?.running === true
    },
    {
      id: 4,
      descricao: "Reativação",
      cronExpression: "0 10 * * 1 (10:00 segundas-feiras)",
      ativo: jobs.length > 3 && jobs[3]?.running === true
    }
  ];
};

export default {
  startLembreteJobs,
  stopLembreteJobs,
  getLembreteJobsStatus
};
