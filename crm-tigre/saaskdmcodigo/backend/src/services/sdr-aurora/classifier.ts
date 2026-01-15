import { LeadState, LeadScores, SignalCategory } from "./types";

export function classifyState(scores: LeadScores, signalCats: SignalCategory[]): LeadState {
  const hasSpam = signalCats.includes(SignalCategory.SPAM);
  if (hasSpam) return LeadState.SPAM;

  const hasDor = signalCats.includes(SignalCategory.DOR);
  const hasEng = signalCats.includes(SignalCategory.ENGAJAMENTO);
  const hasUrg = signalCats.includes(SignalCategory.URGENCIA);

  const onlyEconomic = signalCats.every(c => c === SignalCategory.ECONOMICO) && signalCats.length > 0;
  if (onlyEconomic && scores.total < 45) return LeadState.CURIOSO;

  if (scores.total >= 65 && (hasDor || hasEng) && hasUrg) return LeadState.HOT;
  if (scores.total >= 50) return LeadState.WARM;
  if (scores.total >= 30) return LeadState.COLD;

  return LeadState.CURIOSO;
}

export function decideAction(state: LeadState): "ROUTE_TO_HUMAN" | "ASK_QUALIFYING" | "NURTURE" | "REACTIVATE" | "BLOCK" {
  switch (state) {
    case LeadState.HOT:
      return "ROUTE_TO_HUMAN";
    case LeadState.WARM:
      return "ASK_QUALIFYING";
    case LeadState.COLD:
      return "NURTURE";
    case LeadState.CURIOSO:
      return "ASK_QUALIFYING";
    case LeadState.SPAM:
      return "BLOCK";
    default:
      return "NURTURE";
  }
}

export function buildReasons(scores: LeadScores, signalCats: SignalCategory[]): string[] {
  const reasons: string[] = [];

  if (scores.affective >= 15) reasons.push("Dor emocional alta");
  if (scores.timing >= 12) reasons.push("Urgência detectada");
  if (scores.engagement >= 15) reasons.push("Alto engajamento");
  if (scores.risk <= 8) reasons.push("Medo/resistência elevada");
  if (signalCats.includes(SignalCategory.SPAM)) reasons.push("Sinais de spam");
  if (signalCats.includes(SignalCategory.MENTIRA_EDUCADA)) reasons.push("Possível evasiva");
  if (signalCats.includes(SignalCategory.DECISAO_SILENCIOSA)) reasons.push("Decisão já tomada");

  if (reasons.length === 0) reasons.push("Análise padrão");

  return reasons;
}
