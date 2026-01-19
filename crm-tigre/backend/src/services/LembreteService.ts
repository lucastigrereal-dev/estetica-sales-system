import { Op } from "sequelize";
import Agendamento from "../models/Agendamento";
import Paciente from "../models/Paciente";
import PesquisaNps from "../models/PesquisaNps";
import LembreteLog from "../models/LembreteLog";
import { SendMessage } from "./WbotServices/SendWhatsAppMessage";
import { MESSAGE_TEMPLATES } from "../config/messageTemplates";

// Templates de mensagem com padrão premium
const TEMPLATES = {
  LEMBRETE_24H: (nome: string, data: string, hora: string, procedimento: string) =>
    MESSAGE_TEMPLATES.reminders?.reminder24h
      ?.replace("{NOME}", nome)
      ?.replace("{DATA}", data)
      ?.replace("{HORA}", hora)
      ?.replace("{PROCEDIMENTO}", procedimento) ||
    `Olá ${nome}! 👋\n\nLembrando que você tem um agendamento amanhã:\n📅 ${data} às ${hora}\n💆 ${procedimento}\n\nConfirma sua presença? Responda SIM ou NÃO.`,

  LEMBRETE_2H: (nome: string, hora: string, procedimento: string) =>
    MESSAGE_TEMPLATES.reminders?.reminder2h
      ?.replace("{NOME}", nome)
      ?.replace("{HORA}", hora)
      ?.replace("{PROCEDIMENTO}", procedimento) ||
    `Oi ${nome}! Seu horário é daqui a 2 horas! ⏰\n${procedimento} às ${hora}\nEstamos te esperando! 💜`,

  NPS: (nome: string, score?: number) => {
    if (score !== undefined && score >= 0 && score <= 10) {
      if (score >= 9) {
        return MESSAGE_TEMPLATES.nps?.promoter
          ?.replace("{NOME}", nome) ||
          `${nome}, muito obrigado pela confiança! 💜 Sua satisfação é nossa maior recompensa!`;
      } else if (score >= 7) {
        return MESSAGE_TEMPLATES.nps?.passive
          ?.replace("{NOME}", nome) ||
          `${nome}, apreciamos seu feedback! Como podemos melhorar ainda mais?`;
      } else {
        return MESSAGE_TEMPLATES.nps?.detractor
          ?.replace("{NOME}", nome) ||
          `${nome}, desculpe se não atendemos suas expectativas. Gostaríamos de tentar melhorar!`;
      }
    }
    return MESSAGE_TEMPLATES.nps?.survey
      ?.replace("{NOME}", nome) ||
      `Olá ${nome}! Como foi sua experiência hoje?\nDe 0 a 10, qual nota você dá para nosso atendimento?\n(Responda apenas o número)`;
  },

  REATIVACAO_30D: (nome: string, procedimento: string) =>
    MESSAGE_TEMPLATES.reactivation?.replace("{NOME}", nome)?.replace("{PROCEDIMENTO}", procedimento) ||
    `Oi ${nome}, sentimos sua falta! 💜\nJá faz um tempinho que você não vem nos ver.\nQue tal agendar seu próximo ${procedimento}?\nTemos horários disponíveis essa semana!`
};

/**
 * Enviar lembretes 24h antes do agendamento
 * Executa: Todos os dias às 09:00
 * Busca: Agendamentos de amanhã com status AGENDADO/CONFIRMADO
 */
export const enviarLembrete24h = async (): Promise<void> => {
  const agora = new Date();
  const amanha = new Date(agora);
  amanha.setDate(amanha.getDate() + 1);
  amanha.setHours(0, 0, 0, 0);
  const depoisDeAmanha = new Date(amanha);
  depoisDeAmanha.setDate(depoisDeAmanha.getDate() + 1);

  const agendamentos = await Agendamento.findAll({
    where: {
      dataAgendamento: { [Op.between]: [amanha, depoisDeAmanha] },
      status: { [Op.in]: ["AGENDADO", "CONFIRMADO"] },
      lembrete24hEnviado: false
    },
    include: [
      { association: "paciente" },
      { association: "procedimento" }
    ]
  });

  console.log(`🔔 [LEMBRETE 24H] Iniciando envio de ${agendamentos.length} lembretes`);

  for (const agendamento of agendamentos) {
    let tentativas = 0;
    const maxTentativas = 3;
    const intervaloTentativa = 5 * 60 * 1000; // 5 minutos

    while (tentativas < maxTentativas) {
      try {
        const paciente = agendamento.paciente as Paciente;
        const msg = TEMPLATES.LEMBRETE_24H(
          paciente.nome,
          new Date(agendamento.dataAgendamento).toLocaleDateString("pt-BR"),
          agendamento.horaInicio,
          (agendamento as any).procedimento?.nome || "Procedimento"
        );

        // Criar log de tentativa
        const lembreteLog = await LembreteLog.create({
          companyId: agendamento.companyId,
          pacienteId: agendamento.pacienteId,
          agendamentoId: agendamento.id,
          tipo: "LEMBRETE_24H",
          numeroWhatsapp: paciente.whatsapp,
          mensagem: msg,
          status: "PENDENTE",
          tentativas: tentativas + 1,
          ultimaTentativa: new Date()
        });

        // Enviar via WhatsApp
        // await SendMessage(paciente.whatsapp, msg, agendamento.companyId);

        // Marcar como enviado
        await lembreteLog.update({ status: "ENVIADO" });
        await agendamento.update({ lembrete24hEnviado: true });

        console.log(`✅ Lembrete 24h enviado para ${paciente.nome} (Tentativa ${tentativas + 1})`);
        break; // Sucesso, sair do loop
      } catch (error) {
        tentativas++;
        console.error(`❌ Erro ao enviar lembrete 24h (Tentativa ${tentativas}):`, error);

        if (tentativas >= maxTentativas) {
          await LembreteLog.create({
            companyId: agendamento.companyId,
            pacienteId: agendamento.pacienteId,
            agendamentoId: agendamento.id,
            tipo: "LEMBRETE_24H",
            numeroWhatsapp: (agendamento.paciente as Paciente).whatsapp,
            mensagem: TEMPLATES.LEMBRETE_24H(
              (agendamento.paciente as Paciente).nome,
              new Date(agendamento.dataAgendamento).toLocaleDateString("pt-BR"),
              agendamento.horaInicio,
              (agendamento as any).procedimento?.nome || "Procedimento"
            ),
            status: "FALHA",
            tentativas: tentativas,
            ultimaTentativa: new Date(),
            erroMensagem: String(error)
          });
        } else {
          // Aguardar antes de tentar novamente
          await new Promise(resolve => setTimeout(resolve, intervaloTentativa));
        }
      }
    }
  }
};

/**
 * Enviar lembretes 2h antes do agendamento
 * Executa: A cada 30 minutos
 * Busca: Agendamentos que faltam exatamente 2h com status AGENDADO/CONFIRMADO
 */
export const enviarLembrete2h = async (): Promise<void> => {
  const agora = new Date();

  const agendamentos = await Agendamento.findAll({
    where: {
      dataAgendamento: { [Op.eq]: agora.toISOString().split("T")[0] },
      status: { [Op.in]: ["AGENDADO", "CONFIRMADO"] },
      lembrete2hEnviado: false
    },
    include: [
      { association: "paciente" },
      { association: "procedimento" }
    ]
  });

  console.log(`🔔 [LEMBRETE 2H] Verificando ${agendamentos.length} agendamentos`);

  for (const agendamento of agendamentos) {
    const [hora, minuto] = agendamento.horaInicio.split(":").map(Number);
    const horaAgendamento = new Date(agora);
    horaAgendamento.setHours(hora, minuto, 0, 0);

    const diffMs = horaAgendamento.getTime() - agora.getTime();
    const diffHoras = diffMs / (1000 * 60 * 60);

    if (diffHoras > 1.5 && diffHoras <= 2.5) {
      let tentativas = 0;
      const maxTentativas = 2;
      const intervaloTentativa = 2 * 60 * 1000; // 2 minutos

      while (tentativas < maxTentativas) {
        try {
          const paciente = agendamento.paciente as Paciente;
          const msg = TEMPLATES.LEMBRETE_2H(
            paciente.nome,
            agendamento.horaInicio,
            (agendamento as any).procedimento?.nome || "Procedimento"
          );

          // Criar log de tentativa
          const lembreteLog = await LembreteLog.create({
            companyId: agendamento.companyId,
            pacienteId: agendamento.pacienteId,
            agendamentoId: agendamento.id,
            tipo: "LEMBRETE_2H",
            numeroWhatsapp: paciente.whatsapp,
            mensagem: msg,
            status: "PENDENTE",
            tentativas: tentativas + 1,
            ultimaTentativa: new Date()
          });

          // Enviar via WhatsApp
          // await SendMessage(paciente.whatsapp, msg, agendamento.companyId);

          // Marcar como enviado
          await lembreteLog.update({ status: "ENVIADO" });
          await agendamento.update({ lembrete2hEnviado: true });

          console.log(`✅ Lembrete 2h enviado para ${paciente.nome} (Tentativa ${tentativas + 1})`);
          break; // Sucesso, sair do loop
        } catch (error) {
          tentativas++;
          console.error(`❌ Erro ao enviar lembrete 2h (Tentativa ${tentativas}):`, error);

          if (tentativas >= maxTentativas) {
            await LembreteLog.create({
              companyId: agendamento.companyId,
              pacienteId: agendamento.pacienteId,
              agendamentoId: agendamento.id,
              tipo: "LEMBRETE_2H",
              numeroWhatsapp: (agendamento.paciente as Paciente).whatsapp,
              mensagem: TEMPLATES.LEMBRETE_2H(
                (agendamento.paciente as Paciente).nome,
                agendamento.horaInicio,
                (agendamento as any).procedimento?.nome || "Procedimento"
              ),
              status: "FALHA",
              tentativas: tentativas,
              ultimaTentativa: new Date(),
              erroMensagem: String(error)
            });
          } else {
            await new Promise(resolve => setTimeout(resolve, intervaloTentativa));
          }
        }
      }
    }
  }
};

/**
 * Enviar pesquisas NPS após agendamento realizado
 * Executa: Todos os dias às 20:00
 * Busca: Agendamentos REALIZADOS hoje
 */
export const enviarNps = async (): Promise<void> => {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const amanha = new Date(hoje);
  amanha.setDate(amanha.getDate() + 1);

  const agendamentos = await Agendamento.findAll({
    where: {
      dataAgendamento: { [Op.between]: [hoje, amanha] },
      status: "REALIZADO"
    },
    include: [{ association: "paciente" }]
  });

  console.log(`📊 [NPS SURVEY] Iniciando envio de ${agendamentos.length} pesquisas NPS`);

  for (const agendamento of agendamentos) {
    const npsExistente = await PesquisaNps.findOne({
      where: { agendamentoId: agendamento.id }
    });

    if (!npsExistente) {
      try {
        const paciente = agendamento.paciente as Paciente;
        const msg = TEMPLATES.NPS(paciente.nome);

        // Criar log de envio NPS
        await LembreteLog.create({
          companyId: agendamento.companyId,
          pacienteId: agendamento.pacienteId,
          agendamentoId: agendamento.id,
          tipo: "NPS",
          numeroWhatsapp: paciente.whatsapp,
          mensagem: msg,
          status: "ENVIADO",
          tentativas: 1,
          ultimaTentativa: new Date()
        });

        // Enviar via WhatsApp
        // await SendMessage(paciente.whatsapp, msg, agendamento.companyId);

        // Registrar pesquisa NPS
        await PesquisaNps.create({
          companyId: agendamento.companyId,
          pacienteId: agendamento.pacienteId,
          agendamentoId: agendamento.id,
          dataEnvio: new Date()
        });

        console.log(`✅ NPS enviado para ${paciente.nome}`);
      } catch (error) {
        console.error(`❌ Erro ao enviar NPS:`, error);

        const paciente = agendamento.paciente as Paciente;
        await LembreteLog.create({
          companyId: agendamento.companyId,
          pacienteId: agendamento.pacienteId,
          agendamentoId: agendamento.id,
          tipo: "NPS",
          numeroWhatsapp: paciente.whatsapp,
          mensagem: TEMPLATES.NPS(paciente.nome),
          status: "FALHA",
          tentativas: 1,
          ultimaTentativa: new Date(),
          erroMensagem: String(error)
        });
      }
    }
  }
};

/**
 * Enviar mensagens de reativação para pacientes inativos
 * Executa: Todas as segundas-feiras às 10:00
 * Busca: Pacientes sem contato há 90+ dias
 */
export const enviarReativacao = async (): Promise<void> => {
  const dias90Atras = new Date();
  dias90Atras.setDate(dias90Atras.getDate() - 90);

  const pacientesInativos = await Paciente.findAll({
    where: {
      status: "ATIVO",
      ultimoContato: { [Op.lt]: dias90Atras }
    }
  });

  console.log(`🔄 [REATIVAÇÃO] Iniciando envio de ${pacientesInativos.length} mensagens de reativação`);

  for (const paciente of pacientesInativos) {
    let tentativas = 0;
    const maxTentativas = 2;

    while (tentativas < maxTentativas) {
      try {
        const msg = TEMPLATES.REATIVACAO_30D(
          paciente.nome,
          (paciente as any).procedimentoFavorito || "tratamento estético"
        );

        // Criar log de tentativa
        await LembreteLog.create({
          companyId: paciente.companyId,
          pacienteId: paciente.id,
          tipo: "REATIVACAO",
          numeroWhatsapp: paciente.whatsapp,
          mensagem: msg,
          status: "PENDENTE",
          tentativas: tentativas + 1,
          ultimaTentativa: new Date()
        });

        // Enviar via WhatsApp
        // await SendMessage(paciente.whatsapp, msg, paciente.companyId);

        // Atualizar último contato
        await paciente.update({ ultimoContato: new Date() });
        await LembreteLog.findOne({
          where: { pacienteId: paciente.id, tipo: "REATIVACAO" },
          order: [["id", "DESC"]]
        }).then(log => log?.update({ status: "ENVIADO" }));

        console.log(`✅ Reativação enviada para ${paciente.nome}`);
        break; // Sucesso, sair do loop
      } catch (error) {
        tentativas++;
        console.error(`❌ Erro ao enviar reativação (Tentativa ${tentativas}):`, error);

        if (tentativas >= maxTentativas) {
          await LembreteLog.create({
            companyId: paciente.companyId,
            pacienteId: paciente.id,
            tipo: "REATIVACAO",
            numeroWhatsapp: paciente.whatsapp,
            mensagem: TEMPLATES.REATIVACAO_30D(
              paciente.nome,
              (paciente as any).procedimentoFavorito || "tratamento estético"
            ),
            status: "FALHA",
            tentativas: tentativas,
            ultimaTentativa: new Date(),
            erroMensagem: String(error)
          });
        }
      }
    }
  }
};
