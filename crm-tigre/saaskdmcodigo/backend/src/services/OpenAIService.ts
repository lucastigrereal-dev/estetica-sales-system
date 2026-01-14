import OpenAI from "openai";
import { logger } from "../utils/logger";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

interface ContextoConversa {
  nomeClinica: string;
  procedimentosDisponiveis: string[];
  horarioFuncionamento: string;
  nomeContato: string;
}

interface HistoricoMensagem {
  role: "user" | "assistant" | "system";
  content: string;
}

interface AnaliseSentimento {
  score: number; // -1 a 1
  emocao: string; // "positivo", "neutro", "negativo"
}

interface QualificacaoLead {
  score: number; // 0-100
  procedimentoInteresse: string;
  experienciaPrevia: string;
  melhorDia: string;
  melhorHorario: string;
  observacoes: string;
  pronto: boolean; // Tem informações suficientes?
}

class OpenAIService {
  async gerarResposta(
    mensagem: string,
    contexto: ContextoConversa,
    historico: HistoricoMensagem[]
  ): Promise<string> {
    try {
      const systemPrompt = this.buildSystemPrompt(contexto);

      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4-turbo-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...historico,
          { role: "user", content: mensagem }
        ],
        temperature: 0.7,
        max_tokens: 300
      });

      return response.choices[0].message.content;
    } catch (error) {
      logger.error("Erro ao gerar resposta OpenAI:", error);
      throw error;
    }
  }

  async analisarSentimento(mensagem: string): Promise<AnaliseSentimento> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Analise o sentimento da mensagem. Retorne JSON: {score: number (-1 a 1), emocao: string}"
          },
          { role: "user", content: mensagem }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      logger.error("Erro ao analisar sentimento:", error);
      return { score: 0, emocao: "neutro" };
    }
  }

  async qualificarLead(
    historicoConversa: HistoricoMensagem[]
  ): Promise<QualificacaoLead> {
    try {
      const prompt = `
Analise esta conversa de qualificação de lead para clínica de estética.
Extraia as seguintes informações:
1. procedimentoInteresse (string)
2. experienciaPrevia ("sim" | "nao" | "nao informado")
3. melhorDia (dia da semana ou "nao informado")
4. melhorHorario ("manha" | "tarde" | "noite" | "nao informado")
5. observacoes (urgência, budget implícito, dores mencionadas)
6. score (0-100 baseado em: interesse demonstrado, clareza, urgência, viabilidade)
7. pronto (boolean: tem informações suficientes para agendar?)

Retorne JSON válido com essas chaves.
`;

      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          { role: "system", content: prompt },
          ...historicoConversa
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      logger.error("Erro ao qualificar lead:", error);
      throw error;
    }
  }

  async gerarResumoConversa(mensagens: HistoricoMensagem[]): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Resuma esta conversa em 2-3 frases focando no interesse do cliente e próximos passos."
          },
          ...mensagens
        ],
        temperature: 0.5,
        max_tokens: 150
      });

      return response.choices[0].message.content;
    } catch (error) {
      logger.error("Erro ao gerar resumo:", error);
      return "Erro ao gerar resumo da conversa.";
    }
  }

  private buildSystemPrompt(contexto: ContextoConversa): string {
    return `Você é Anna, assistente virtual da ${contexto.nomeClinica}.

Você é simpática, profissional e objetiva.
Seu objetivo é qualificar leads e coletar informações para agendamento.

Procedimentos disponíveis: ${contexto.procedimentosDisponiveis.join(", ")}
Horário de funcionamento: ${contexto.horarioFuncionamento}

REGRAS:
1. Converse naturalmente, não seja robótica
2. Extraia estas 5 informações ao longo da conversa:
   - Procedimento de interesse
   - Já fez esse procedimento antes?
   - Qual melhor dia da semana?
   - Qual horário prefere (manhã/tarde/noite)?
   - Tem alguma urgência ou data específica?
3. NUNCA invente preços - diga que vai verificar
4. Se cliente pedir para falar com humano, confirme transferência
5. Seja empática com dores/inseguranças do cliente
6. Responda em no máximo 2-3 frases por vez

Contato atual: ${contexto.nomeContato}`;
  }
}

export default new OpenAIService();
