import { Op } from "sequelize";
import Agendamento from "../models/Agendamento";
import Paciente from "../models/Paciente";
import PesquisaNps from "../models/PesquisaNps";
import { SendMessage } from "./WbotServices/SendWhatsAppMessage";

// Templates de mensagem
const TEMPLATES = {
  LEMBRETE_24H: (nome: string, data: string, hora: string, procedimento: string) =>
    `Olá ${nome}! 👋\n\nLembrando que você tem um agendamento amanhã:\n📅 ${data} às ${hora}\n💆 ${procedimento}\n\nConfirma sua presença? Responda SIM ou NÃO.`,

  LEMBRETE_2H: (nome: string, hora: string, procedimento: string) =>
    `Oi ${nome}! Seu horário é daqui a 2 horas! ⏰\n${procedimento} às ${hora}\nEstamos te esperando! 💜`,

  NPS: (nome: string) =>
    `Olá ${nome}! Como foi sua experiência hoje?\nDe 0 a 10, qual nota você dá para nosso atendimento?\n(Responda apenas o número)`,

  REATIVACAO_30D: (nome: string, procedimento: string) =>
    `Oi ${nome}, sentimos sua falta! 💜\nJá faz um tempinho que você não vem nos ver.\nQue tal agendar seu próximo ${procedimento}?\nTemos horários disponíveis essa semana!`
};

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

  for (const agendamento of agendamentos) {
    try {
      const paciente = agendamento.paciente as Paciente;
      const msg = TEMPLATES.LEMBRETE_24H(
        paciente.nome,
        new Date(agendamento.dataAgendamento).toLocaleDateString("pt-BR"),
        agendamento.horaInicio,
        (agendamento as any).procedimento?.nome || "Procedimento"
      );

      // Enviar via WhatsApp (usar função do Whaticket)
      // await SendMessage(paciente.whatsapp, msg, agendamento.companyId);

      await agendamento.update({ lembrete24hEnviado: true });
      console.log(`Lembrete 24h enviado para ${paciente.nome}`);
    } catch (error) {
      console.error(`Erro ao enviar lembrete 24h:`, error);
    }
  }
};

export const enviarLembrete2h = async (): Promise<void> => {
  const agora = new Date();
  const daqui2h = new Date(agora.getTime() + 2 * 60 * 60 * 1000);

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

  for (const agendamento of agendamentos) {
    const [hora, minuto] = agendamento.horaInicio.split(":").map(Number);
    const horaAgendamento = new Date(agora);
    horaAgendamento.setHours(hora, minuto, 0, 0);

    const diffMs = horaAgendamento.getTime() - agora.getTime();
    const diffHoras = diffMs / (1000 * 60 * 60);

    if (diffHoras > 1.5 && diffHoras <= 2.5) {
      try {
        const paciente = agendamento.paciente as Paciente;
        const msg = TEMPLATES.LEMBRETE_2H(
          paciente.nome,
          agendamento.horaInicio,
          (agendamento as any).procedimento?.nome || "Procedimento"
        );

        // await SendMessage(paciente.whatsapp, msg, agendamento.companyId);
        await agendamento.update({ lembrete2hEnviado: true });
        console.log(`Lembrete 2h enviado para ${paciente.nome}`);
      } catch (error) {
        console.error(`Erro ao enviar lembrete 2h:`, error);
      }
    }
  }
};

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

  for (const agendamento of agendamentos) {
    const npsExistente = await PesquisaNps.findOne({
      where: { agendamentoId: agendamento.id }
    });

    if (!npsExistente) {
      try {
        const paciente = agendamento.paciente as Paciente;
        const msg = TEMPLATES.NPS(paciente.nome);

        // await SendMessage(paciente.whatsapp, msg, agendamento.companyId);

        await PesquisaNps.create({
          companyId: agendamento.companyId,
          pacienteId: agendamento.pacienteId,
          agendamentoId: agendamento.id,
          dataEnvio: new Date()
        });

        console.log(`NPS enviado para ${paciente.nome}`);
      } catch (error) {
        console.error(`Erro ao enviar NPS:`, error);
      }
    }
  }
};

export const enviarReativacao = async (): Promise<void> => {
  const dias30Atras = new Date();
  dias30Atras.setDate(dias30Atras.getDate() - 30);

  const pacientesInativos = await Paciente.findAll({
    where: {
      status: "ATIVO",
      ultimoContato: { [Op.lt]: dias30Atras }
    }
  });

  for (const paciente of pacientesInativos) {
    try {
      const msg = TEMPLATES.REATIVACAO_30D(
        paciente.nome,
        paciente.procedimentoFavorito || "tratamento estético"
      );

      // await SendMessage(paciente.whatsapp, msg, paciente.companyId);
      await paciente.update({ ultimoContato: new Date() });

      console.log(`Reativação enviada para ${paciente.nome}`);
    } catch (error) {
      console.error(`Erro ao enviar reativação:`, error);
    }
  }
};
