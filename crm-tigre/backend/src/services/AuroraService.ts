import OpenAI from "openai";
import Ticket from "../models/Ticket";
import Message from "../models/Message";
import Procedimento from "../models/Procedimento";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface QualificacaoResult {
  score: number;
  interessado: boolean;
  procedimentoSugerido: string | null;
  melhorDia: string | null;
  melhorHorario: string | null;
}

const SYSTEM_PROMPT = `Você é Aurora, assistente virtual de uma clínica de estética.
Você é simpática, profissional e objetiva.
Seu objetivo é qualificar leads e agendar procedimentos estéticos.

REGRAS:
1. Faça perguntas para entender o interesse do paciente
2. Pergunte: qual procedimento, se já fez antes, melhor dia, melhor horário
3. Quando qualificado (respondeu as 4 perguntas), sugira agendamento
4. Nunca invente preços - diga que vai verificar
5. Se pedir humano, transfira imediatamente
6. Seja breve e direta nas respostas

PROCEDIMENTOS DISPONÍVEIS:
- Botox, Preenchimento labial, Harmonização facial
- Limpeza de pele, Peeling, Microagulhamento
- Depilação a laser, Criolipólise, Drenagem linfática`;

export const gerarResposta = async (
  mensagem: string,
  historico: { role: string; content: string }[]
): Promise<string> => {
  try {
    const messages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...historico.map(h => ({ role: h.role as "user" | "assistant", content: h.content })),
      { role: "user" as const, content: mensagem }
    ];

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4-turbo-preview",
      messages,
      max_tokens: 300,
      temperature: 0.7
    });

    return response.choices[0]?.message?.content || "Desculpe, não entendi. Pode repetir?";
  } catch (error) {
    console.error("Erro OpenAI:", error);
    return "Desculpe, estou com dificuldades técnicas. Um atendente humano vai te ajudar em breve!";
  }
};

export const analisarSentimento = async (mensagem: string): Promise<number> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: "Analise o sentimento da mensagem e responda APENAS com um número de -1 (muito negativo) a 1 (muito positivo)." },
        { role: "user", content: mensagem }
      ],
      max_tokens: 10
    });

    const score = parseFloat(response.choices[0]?.message?.content || "0");
    return isNaN(score) ? 0 : Math.max(-1, Math.min(1, score));
  } catch {
    return 0;
  }
};

export const qualificarLead = async (ticketId: number): Promise<QualificacaoResult> => {
  const mensagens = await Message.findAll({
    where: { ticketId },
    order: [["createdAt", "ASC"]]
  });

  const conversa = mensagens.map(m => m.body).join("\n");

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `Analise a conversa e extraia:
1. Score de qualificação (0-100)
2. Se está interessado (true/false)
3. Procedimento de interesse
4. Melhor dia
5. Melhor horário
Responda em JSON: {"score":0,"interessado":false,"procedimentoSugerido":null,"melhorDia":null,"melhorHorario":null}`
        },
        { role: "user", content: conversa }
      ],
      max_tokens: 200
    });

    const result = JSON.parse(response.choices[0]?.message?.content || "{}");
    return {
      score: result.score || 0,
      interessado: result.interessado || false,
      procedimentoSugerido: result.procedimentoSugerido || null,
      melhorDia: result.melhorDia || null,
      melhorHorario: result.melhorHorario || null
    };
  } catch {
    return { score: 0, interessado: false, procedimentoSugerido: null, melhorDia: null, melhorHorario: null };
  }
};

export const processarMensagemAurora = async (
  ticketId: number,
  mensagemRecebida: string,
  companyId: number
): Promise<string> => {
  // Buscar histórico
  const mensagens = await Message.findAll({
    where: { ticketId },
    order: [["createdAt", "ASC"]],
    limit: 20
  });

  const historico = mensagens.map(m => ({
    role: m.fromMe ? "assistant" : "user",
    content: m.body
  }));

  // Gerar resposta
  const resposta = await gerarResposta(mensagemRecebida, historico);

  // Qualificar lead
  const qualificacao = await qualificarLead(ticketId);

  // Se score alto, sugerir agendamento
  if (qualificacao.score >= 70 && qualificacao.interessado) {
    const procedimentos = await Procedimento.findAll({ where: { companyId, ativo: true } });
    const sugestao = procedimentos.find(p => 
      p.nome.toLowerCase().includes((qualificacao.procedimentoSugerido || "").toLowerCase())
    );

    if (sugestao) {
      return `${resposta}\n\n✨ Ótimo! Posso agendar seu ${sugestao.nome} para ${qualificacao.melhorDia || "esta semana"}? Temos horários disponíveis!`;
    }
  }

  return resposta;
};
