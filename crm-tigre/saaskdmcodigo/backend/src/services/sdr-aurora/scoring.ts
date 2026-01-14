import { LeadContext, LeadScores, TAEREWeights, SignalCategory } from "./types.js";

const DEFAULT_WEIGHTS: TAEREWeights = {
  timing: 18,
  affective: 25,
  economic: 15,
  risk: 20,
  engagement: 22,
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function countCats(signalCats: SignalCategory[], cat: SignalCategory): number {
  return signalCats.filter((s) => s === cat).length;
}

function hasEconomicPositive(text: string) {
  return /\b(parcel|parcelar|em\s+\d+\s*x|duas?\s+cart[oõ]es|entrada)\b/i.test(text);
}

function hasEconomicNegative(text: string) {
  return /\b(caro|n[aã]o\s+tenho|sem\s+condi[cç][aã]o|t[aá]\s+salgado|apertado)\b/i.test(text);
}

function hasStrongFear(text: string) {
  return /\b(golpe|impot[eê]ncia|perder\s+sensibilidade|complica[cç][aã]o|infe[cç][aã]o|dar\s+errado)\b/i.test(text);
}

export function scoreTiming(ctx: LeadContext, signalCats?: SignalCategory[]): number {
  const cats = signalCats ?? [];
  const urgCount = countCats(cats, SignalCategory.URGENCIA);
  let pts = 0;
  pts += urgCount * 0.55 * DEFAULT_WEIGHTS.timing;
  if (urgCount > 0 && (ctx.messageLength ?? 0) < 80) pts += 2;
  return clamp(pts, 0, DEFAULT_WEIGHTS.timing);
}

export function scoreAffective(signalCats: SignalCategory[]): number {
  const count = countCats(signalCats, SignalCategory.DOR);
  let pts = count * 0.55 * DEFAULT_WEIGHTS.affective;
  return clamp(pts, 0, DEFAULT_WEIGHTS.affective);
}

export function scoreEconomic(signalCats: SignalCategory[], ctx?: LeadContext): number {
  const count = countCats(signalCats, SignalCategory.ECONOMICO);
  let pts = count * 0.35 * DEFAULT_WEIGHTS.economic;
  const text = (ctx?.text ?? "").toLowerCase();
  if (hasEconomicPositive(text)) pts += 4;
  if (hasEconomicNegative(text)) pts -= 6;
  const hasDor = countCats(signalCats, SignalCategory.DOR) > 0;
  const hasEng = countCats(signalCats, SignalCategory.ENGAJAMENTO) > 0;
  const hasUrg = countCats(signalCats, SignalCategory.URGENCIA) > 0;
  if (count > 0 && !hasDor && !hasEng && !hasUrg) pts -= 3;
  return clamp(pts, 0, DEFAULT_WEIGHTS.economic);
}

export function scoreRiskResistance(signalCats: SignalCategory[], ctx?: LeadContext): number {
  const medoCount = countCats(signalCats, SignalCategory.MEDO);
  const spamCount = countCats(signalCats, SignalCategory.SPAM);
  let pts = DEFAULT_WEIGHTS.risk;
  pts -= medoCount * 0.35 * DEFAULT_WEIGHTS.risk;
  const text = (ctx?.text ?? "").toLowerCase();
  if (hasStrongFear(text)) pts -= 6;
  if (spamCount > 0) pts = 0;
  return clamp(pts, 0, DEFAULT_WEIGHTS.risk);
}

export function scoreEngagement(ctx: LeadContext, signalCats: SignalCategory[]): number {
  const engCount = countCats(signalCats, SignalCategory.ENGAJAMENTO);
  const decisaoSilenciosa = countCats(signalCats, SignalCategory.DECISAO_SILENCIOSA);
  const mentiraEducada = countCats(signalCats, SignalCategory.MENTIRA_EDUCADA);
  let pts = 0;
  pts += engCount * 0.5 * DEFAULT_WEIGHTS.engagement;
  pts += decisaoSilenciosa > 0 ? 4 : 0;
  const rt = ctx.responseTime ?? undefined;
  if (rt !== undefined) {
    if (rt < 60) pts += 6;
    else if (rt < 300) pts += 4;
    else if (rt < 1200) pts += 2;
    else pts += 0.5;
  }
  if (ctx.audio) pts += 6;
  const ml = ctx.messageLength ?? (ctx.text?.length ?? 0);
  if (ml >= 120) pts += 2;
  if (ml >= 250) pts += 1;
  if (mentiraEducada > 0) pts -= 6;
  return clamp(pts, 0, DEFAULT_WEIGHTS.engagement);
}

export function scoreTAERE(ctx: LeadContext, signalCats: SignalCategory[]): LeadScores {
  const scores: LeadScores = {
    timing: scoreTiming(ctx, signalCats),
    affective: scoreAffective(signalCats),
    economic: scoreEconomic(signalCats, ctx),
    risk: scoreRiskResistance(signalCats, ctx),
    engagement: scoreEngagement(ctx, signalCats),
    total: 0,
  };
  scores.total = scores.timing + scores.affective + scores.economic + scores.risk + scores.engagement;
  scores.total = clamp(scores.total, 0, 100);
  return scores;
}
