import { LeadContext, EvaluationResult, LeadState } from "./types";
import { extractSignals, getSignalCategories } from "./extractSignals";
import { scoreTAERE } from "./scoring";
import { classifyState, decideAction, buildReasons } from "./classifier";

export function evaluateLead(ctx: LeadContext): EvaluationResult {
  // 1. Extrair sinais da mensagem
  const signals = extractSignals(ctx);
  const signalCats = getSignalCategories(signals);

  // 2. Calcular scores TAERE
  const scores = scoreTAERE(ctx, signalCats);

  // 3. Classificar estado
  const state = classifyState(scores, signalCats);

  // 4. Decidir próxima ação
  const nextAction = decideAction(state);

  // 5. Construir motivos legíveis
  const reasons = buildReasons(scores, signalCats);

  // 6. Calcular confiança
  const confidence = Math.min(0.95, 0.5 + (signals.length * 0.1) + (scores.total / 200));

  return {
    state,
    scores,
    signals,
    reasons,
    nextAction,
    confidence,
  };
}

export { LeadState, LeadContext, EvaluationResult } from "./types";
