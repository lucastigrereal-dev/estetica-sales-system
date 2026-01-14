import Agendamento from "../../models/Agendamento";
import Contact from "../../models/Contact";
import Automacao, { TipoAutomacao, StatusAutomacao } from "../../models/Automacao";
import Ticket from "../../models/Ticket";
import Whatsapp from "../../models/Whatsapp";
import GetDefaultWhatsApp from "../../helpers/GetDefaultWhatsApp";
import CreateOrUpdateContactService from "../ContactServices/CreateOrUpdateContactService";
import FindOrCreateTicketService from "../TicketServices/FindOrCreateTicketService";
import SendWhatsAppMessage from "../WbotServices/SendWhatsAppMessage";
import moment from "moment";
import { getIO } from "../../libs/socket";
import AppError from "../../errors/AppError";

// Templates de mensagem
const TEMPLATES = {
  LEMBRETE_24H: `Olá {nome}! 👋
Lembrando que você tem um agendamento amanhã:
📅 {data} às {hora}
💆 {procedimento}
📍 {endereco}

Confirma sua presença? Responda SIM ou NÃO.`,

  LEMBRETE_2H: `Oi {nome}! Seu horário é daqui a 2 horas! ⏰

{procedimento} às {hora}

Estamos te esperando! 💜`,

  NPS: `Olá {nome}! Como foi sua experiência hoje?

De 0 a 10, qual nota você dá para nosso atendimento?

(Responda apenas o número)`,

  REATIVACAO_30D: `Oi {nome}, sentimos sua falta! 💜

Já faz um tempinho que você não vem nos ver.
Que tal agendar seu próximo {procedimentoFavorito}?

Temos horários disponíveis essa semana!`,

  REATIVACAO_60D: `Oi {nome}! Tudo bem com você? 😊

Notamos que faz 2 meses que você não vem nos visitar.
Estamos com uma promoção especial para você retomar seus cuidados!

Quer saber mais? Responda SIM!`,

  REATIVACAO_90D: `{nome}, estamos com saudades! 💜

Já faz 3 meses! Que tal voltarmos a cuidar de você?
Preparamos condições especiais para seu retorno.

Responda este número e vamos agendar! ✨`
};

interface EnviarLembreteRequest {
  agendamento: Agendamento;
  tipo: TipoAutomacao;
}

interface EnviarReativacaoRequest {
  paciente: Contact;
  diasSemContato: number;
  companyId: number;
  procedimentoFavorito?: string;
}

class AutomacaoService {
  async enviarLembrete24h(agendamento: Agendamento): Promise<Automacao> {
    return this.enviarLembrete({
      agendamento,
      tipo: TipoAutomacao.LEMBRETE_24H
    });
  }

  async enviarLembrete2h(agendamento: Agendamento): Promise<Automacao> {
    return this.enviarLembrete({
      agendamento,
      tipo: TipoAutomacao.LEMBRETE_2H
    });
  }

  async enviarNps(agendamento: Agendamento): Promise<Automacao> {
    try {
      // Buscar paciente e procedimento
      const agendamentoCompleto = await Agendamento.findByPk(agendamento.id, {
        include: ["paciente", "procedimento"]
      });

      if (!agendamentoCompleto) {
        throw new AppError("Agendamento não encontrado");
      }

      const paciente = agendamentoCompleto.paciente;
      const template = TEMPLATES.NPS;

      // Substituir variáveis
      const mensagem = template.replace(/{nome}/g, paciente.name);

      // Enviar mensagem
      const automacao = await this.enviarMensagemWhatsApp(
        paciente,
        mensagem,
        agendamentoCompleto.companyId,
        TipoAutomacao.NPS,
        agendamentoCompleto.id
      );

      return automacao;
    } catch (error: any) {
      console.error("Erro ao enviar NPS:", error);
      throw error;
    }
  }

  async enviarReativacao(
    paciente: Contact,
    diasSemContato: number,
    companyId: number,
    procedimentoFavorito: string = "tratamento"
  ): Promise<Automacao> {
    try {
      let tipo: TipoAutomacao;
      let template: string;

      if (diasSemContato >= 90) {
        tipo = TipoAutomacao.REATIVACAO_90D;
        template = TEMPLATES.REATIVACAO_90D;
      } else if (diasSemContato >= 60) {
        tipo = TipoAutomacao.REATIVACAO_60D;
        template = TEMPLATES.REATIVACAO_60D;
      } else {
        tipo = TipoAutomacao.REATIVACAO_30D;
        template = TEMPLATES.REATIVACAO_30D;
      }

      // Substituir variáveis
      const mensagem = template
        .replace(/{nome}/g, paciente.name)
        .replace(/{procedimentoFavorito}/g, procedimentoFavorito);

      // Enviar mensagem
      const automacao = await this.enviarMensagemWhatsApp(
        paciente,
        mensagem,
        companyId,
        tipo
      );

      return automacao;
    } catch (error: any) {
      console.error("Erro ao enviar reativação:", error);
      throw error;
    }
  }

  private async enviarLembrete({
    agendamento,
    tipo
  }: EnviarLembreteRequest): Promise<Automacao> {
    try {
      // Buscar agendamento completo com relacionamentos
      const agendamentoCompleto = await Agendamento.findByPk(agendamento.id, {
        include: ["paciente", "procedimento", "company"]
      });

      if (!agendamentoCompleto) {
        throw new AppError("Agendamento não encontrado");
      }

      const paciente = agendamentoCompleto.paciente;
      const procedimento = agendamentoCompleto.procedimento;

      // Selecionar template
      const template =
        tipo === TipoAutomacao.LEMBRETE_24H
          ? TEMPLATES.LEMBRETE_24H
          : TEMPLATES.LEMBRETE_2H;

      // Formatar data e hora
      const dataFormatada = moment(agendamentoCompleto.dataAgendamento).format(
        "DD/MM/YYYY"
      );

      // Substituir variáveis no template
      const mensagem = template
        .replace(/{nome}/g, paciente.name)
        .replace(/{data}/g, dataFormatada)
        .replace(/{hora}/g, agendamentoCompleto.horaInicio)
        .replace(/{procedimento}/g, procedimento.nome)
        .replace(/{endereco}/g, "Rua Exemplo, 123"); // TODO: Pegar do company

      // Enviar mensagem via WhatsApp
      const automacao = await this.enviarMensagemWhatsApp(
        paciente,
        mensagem,
        agendamentoCompleto.companyId,
        tipo,
        agendamentoCompleto.id
      );

      // Atualizar agendamento
      if (tipo === TipoAutomacao.LEMBRETE_24H) {
        await agendamentoCompleto.update({ lembrete24hEnviado: true });
      } else if (tipo === TipoAutomacao.LEMBRETE_2H) {
        await agendamentoCompleto.update({ lembrete2hEnviado: true });
      }

      return automacao;
    } catch (error: any) {
      console.error("Erro ao enviar lembrete:", error);
      throw error;
    }
  }

  private async enviarMensagemWhatsApp(
    paciente: Contact,
    mensagem: string,
    companyId: number,
    tipo: TipoAutomacao,
    agendamentoId?: number
  ): Promise<Automacao> {
    try {
      // Buscar WhatsApp padrão da empresa
      const whatsapp = await GetDefaultWhatsApp(companyId);

      // Criar ou buscar contato
      const contact = await Contact.findByPk(paciente.id);

      if (!contact) {
        throw new AppError("Contato não encontrado");
      }

      // Criar ou buscar ticket
      const ticket = await FindOrCreateTicketService(
        contact,
        whatsapp.id,
        0, // unreadMessages
        companyId,
        0 // queueId (0 = sem fila)
      );

      // Enviar mensagem
      await SendWhatsAppMessage({
        body: mensagem,
        ticket
      });

      // Criar registro de automação
      const automacao = await Automacao.create({
        tipo,
        companyId,
        pacienteId: paciente.id,
        agendamentoId,
        dataEnvio: new Date(),
        status: StatusAutomacao.ENVIADO,
        mensagemEnviada: mensagem
      });

      // Emitir evento via socket
      const io = getIO();
      io.emit(`company-${companyId}-automacao`, {
        action: "create",
        automacao
      });

      return automacao;
    } catch (error: any) {
      console.error("Erro ao enviar mensagem WhatsApp:", error);

      // Registrar erro
      const automacao = await Automacao.create({
        tipo,
        companyId,
        pacienteId: paciente.id,
        agendamentoId,
        dataEnvio: new Date(),
        status: StatusAutomacao.ERRO,
        mensagemEnviada: mensagem,
        erroMensagem: error.message
      });

      throw error;
    }
  }
}

export default new AutomacaoService();
