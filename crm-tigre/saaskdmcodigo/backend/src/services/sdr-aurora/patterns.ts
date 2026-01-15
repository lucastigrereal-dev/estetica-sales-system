import { SignalCategory } from "./types";

export interface PatternDef {
  category: SignalCategory;
  patterns: RegExp[];
  weight: number;
}

export const INTIMAX_PATTERNS: PatternDef[] = [
  {
    category: SignalCategory.DOR,
    patterns: [
      /\b(vergonha|inseguran[cç]a|constrangimento|desconfort[oa]|incomod[oa]|sofr[eo]|trauma)\b/i,
      /\b(autoestima|auto-estima|me sinto mal|n[aã]o me aceito|odeio)\b/i,
      /\b(evito|escondo|n[aã]o consigo|me trava|paralisa)\b/i,
      /\b(relacionamento|parceiro|namorad[oa]|casamento|intimidade)\b/i,
      /\b(anos|tempo|sempre|desde|muito tempo)\b/i,
    ],
    weight: 1.0,
  },
  {
    category: SignalCategory.URGENCIA,
    patterns: [
      /\b(urgente|r[aá]pido|logo|agora|hoje|essa semana|esse m[eê]s)\b/i,
      /\b(viagem|casamento|evento|consulta|anivers[aá]rio)\b/i,
      /\b(decidi|resolvi|quero resolver|preciso resolver)\b/i,
      /\b(n[aã]o aguento mais|cansei|chega)\b/i,
    ],
    weight: 1.0,
  },
  {
    category: SignalCategory.ECONOMICO,
    patterns: [
      /\b(quanto custa|valor|pre[cç]o|investimento)\b/i,
      /\b(parcel[ao]|parcela|em \d+\s*x|entrada)\b/i,
      /\b(caro|barato|acessível|condições)\b/i,
      /\b(cart[aã]o|pix|boleto|dinheiro)\b/i,
    ],
    weight: 0.8,
  },
  {
    category: SignalCategory.MEDO,
    patterns: [
      /\b(medo|receio|preocupa|risco|perigo)\b/i,
      /\b(d[oó]i|dor|an[ae]stesia|agulha)\b/i,
      /\b(golpe|fake|verdade|confi[aá]vel|seguro)\b/i,
      /\b(dar errado|complicação|efeito colateral)\b/i,
      /\b(impot[eê]ncia|sensibilidade|permanente)\b/i,
    ],
    weight: 1.0,
  },
  {
    category: SignalCategory.ENGAJAMENTO,
    patterns: [
      /\b(pode me ligar|liga pra mim|whatsapp|telefone)\b/i,
      /\b(agenda|agendar|marcar|horário|disponível)\b/i,
      /\b(quero saber mais|me explica|como funciona)\b/i,
      /\b(sim|claro|com certeza|pode ser|bora|vamos)\b/i,
    ],
    weight: 1.0,
  },
  {
    category: SignalCategory.DECISAO_SILENCIOSA,
    patterns: [
      /\b(j[aá] pesquisei|vi no instagram|conhe[cç]o|sei como [eé])\b/i,
      /\b(quero fazer|vou fazer|decidi fazer)\b/i,
    ],
    weight: 1.2,
  },
  {
    category: SignalCategory.MENTIRA_EDUCADA,
    patterns: [
      /\b(vou pensar|vou ver|depois|talvez|quem sabe)\b/i,
      /\b(falar com|consultar|ver com minha? esposa?|marido)\b/i,
      /\b(te aviso|te retorno|entro em contato)\b/i,
    ],
    weight: 0.8,
  },
  {
    category: SignalCategory.SPAM,
    patterns: [
      /\b(golpe|picaretagem|mentira|enganação)\b/i,
      /\b(denunciar|processar|procon|advogado)\b/i,
      /https?:\/\/[^\s]+/i,
      /\b(grátis|promoção|desconto \d{2,}%)\b/i,
    ],
    weight: 2.0,
  },
];
