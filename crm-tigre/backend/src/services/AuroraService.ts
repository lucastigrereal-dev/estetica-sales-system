import OpenAI from "openai";
import Ticket from "../models/Ticket";
import Message from "../models/Message";
import Procedimento from "../models/Procedimento";
import { MESSAGE_TEMPLATES, getGreetingByTime, getNpsTemplate } from "../config/messageTemplates";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface QualificacaoResult {
  score: number;
  interessado: boolean;
  procedimentoSugerido: string | null;
  melhorDia: string | null;
  melhorHorario: string | null;
  sentimento: number;
}

// Premium System Prompt - Instituto Rodovansky
const getSystemPrompt = (): string => `Você é Aurora, assistente virtual premium do Instituto Rodovansky.
Você é elegante, sofisticada, profissional e acolhedora.
Seu objetivo é qualificar leads e oferecer a melhor experiência.

SOBRE VOCÊ:
- Nome: Aurora
- Empresa: Instituto Rodovansky
- Lema: "Excelência em Estética Avançada"
- Especialidade: Atendimento exclusivo e personalizado

REGRAS DE OURO:
1. Seja sempre sofisticada e acolhedora
2. Use emojis com moderação (máximo 2 por mensagem)
3. Personalize cada interação com o nome do cliente
4. Pergunte: qual procedimento, já fez antes, melhor dia, melhor horário
5. Nunca invente preços - sempre diga que vai verificar com a especialista
6. Se o cliente pedir para falar com humano, transfira IMEDIATAMENTE
7. Mensagens curtas e diretas (máximo 3 linhas)
8. Tom: profissional + acolhedor (não robótico)

PROCEDIMENTOS DISPONÍVEIS:
✨ Botox - Eliminação de rugas de expressão
💋 Preenchimento Labial - Aumento e definição
👁️ Harmonização Facial - Proporcionalidade perfeita
🧴 Limpeza de Pele - Higiene profunda
🌟 Peeling - Renovação da pele
🔬 Microagulhamento - Rejuvenescimento
✂️ Depilação a Laser - Permanente e segura
❄️ Criolipólise - Eliminação de gordura localizada
💆 Drenagem Linfática - Desintoxicação

QUANDO QUALIFICADO (score ≥ 70):
- Sugira agendamento com entusiasmo
- Ofereça os horários disponíveis
- Destaque o valor único do procedimento
- Faça transferência suave para consultora

EXEMPLO DE CONVERSA IDEAL:
Cliente: "Oi, gostaria de saber sobre Botox"
Aurora: "Que maravilha que você se interessou pelo Botox! 💫 Você já realizou algum procedimento antes?"
Cliente: "Não, primeira vez"
Aurora: "Perfeito! Botox é excelente para quem quer começar. Qual dia da semana funciona melhor para você?"
...continua qualificando...
Resultado final: Transferência para consultora com score 80+`;

export const gerarResposta = async (
  mensagem: string,
  historico: { role: string; content: string }[]
): Promise<string> => {
  try {
    const messages = [
      { role: "system" as const, content: getSystemPrompt() },
      ...historico.map(h => ({ role: h.role as "user" | "assistant", content: h.content })),
      { role: "user" as const, content: mensagem }
    ];

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4-turbo-preview",
      messages,
      max_tokens: 300,
      temperature: 0.7
    });

    return response.choices[0]?.message?.content || "Desculpe, não consegui processar sua mensagem. Pode tentar novamente?";
  } catch (error) {
    console.error("❌ Erro Aurora (gerarResposta):", error);
    return "Desculpe, estou com dificuldades técnicas. Um atendente humano vai te ajudar em breve! 💙";
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
    // Analisar qualificação
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `Analise a conversa de atendimento e extraia:
1. score (0-100): quanto mais qualificado, maior o score
2. interessado (true/false): cliente está interessado?
3. procedimentoSugerido (string ou null): qual procedimento?
4. melhorDia (string ou null): qual dia prefere?
5. melhorHorario (string ou null): qual horário?
6. sentimento (-1 a 1): análise de sentimento da conversa

Responda APENAS em JSON válido sem explicações adicionais.`
        },
        { role: "user", content: `Conversa para qualificar:\n\n${conversa}` }
      ],
      max_tokens: 300
    });

    const resultText = response.choices[0]?.message?.content || "{}";

    // Tentar parsear JSON
    let result;
    try {
      result = JSON.parse(resultText);
    } catch {
      // Se falhar, retornar valores padrão
      console.warn("⚠️ Erro ao parsear resposta Aurora:", resultText);
      return {
        score: 0,
        interessado: false,
        procedimentoSugerido: null,
        melhorDia: null,
        melhorHorario: null,
        sentimento: 0
      };
    }

    // Validar e limpar dados
    const sentimento = await analisarSentimento(conversa);

    return {
      score: Math.min(100, Math.max(0, result.score || 0)),
      interessado: result.interessado || false,
      procedimentoSugerido: result.procedimentoSugerido || null,
      melhorDia: result.melhorDia || null,
      melhorHorario: result.melhorHorario || null,
      sentimento: sentimento
    };
  } catch (error) {
    console.error("❌ Erro ao qualificar lead:", error);
    return {
      score: 0,
      interessado: false,
      procedimentoSugerido: null,
      melhorDia: null,
      melhorHorario: null,
      sentimento: 0
    };
  }
};

export const processarMensagemAurora = async (
  ticketId: number,
  mensagemRecebida: string,
  companyId: number
): Promise<{
  resposta: string;
  score: number;
  qualificacao: QualificacaoResult;
}> => {
  try {
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

    let respostaFinal = resposta;

    // Se score alto, sugerir agendamento
    if (qualificacao.score >= 70 && qualificacao.interessado) {
      const procedimentos = await Procedimento.findAll({
        where: { companyId, ativo: true },
        limit: 5
      });

      const sugestao = procedimentos.find(p =>
        p.nome.toLowerCase().includes((qualificacao.procedimentoSugerido || "").toLowerCase())
      );

      if (sugestao) {
        // Template de agendamento premium
        const msgAgendamento = MESSAGE_TEMPLATES.scheduling.confirmed
          .replace("{NOME}", "querida")
          .replace("{DATA}", qualificacao.melhorDia || "esta semana");

        respostaFinal = `${resposta}\n\n✨ Perfeito! Vou conectá-la com nossa especialista para agendar seu ${sugestao.nome}. Um momentinho... 💫`;
      }
    }

    // Se score baixo, manter na fila de atendimento
    if (qualificacao.score < 40) {
      respostaFinal = `${resposta}\n\nVou conectá-la com um atendente para entender melhor suas necessidades. Um momentinho... 💙`;
    }

    return {
      resposta: respostaFinal,
      score: qualificacao.score,
      qualificacao
    };
  } catch (error) {
    console.error("❌ Erro processarMensagemAurora:", error);
    return {
      resposta: "Desculpe, estou com dificuldades técnicas. Um atendente humano vai te ajudar em breve! 💙",
      score: 0,
      qualificacao: {
        score: 0,
        interessado: false,
        procedimentoSugerido: null,
        melhorDia: null,
        melhorHorario: null,
        sentimento: 0
      }
    };
  }
};
