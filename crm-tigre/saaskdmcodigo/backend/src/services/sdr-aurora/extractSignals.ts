import { LeadContext, LeadSignal, SignalCategory } from "./types";
import { INTIMAX_PATTERNS } from "./patterns";

export function extractSignals(ctx: LeadContext): LeadSignal[] {
  const signals: LeadSignal[] = [];
  const text = ctx.text || "";

  for (const patternDef of INTIMAX_PATTERNS) {
    for (const regex of patternDef.patterns) {
      const match = text.match(regex);
      if (match) {
        signals.push({
          category: patternDef.category,
          matched: match[0],
          weight: patternDef.weight,
        });
      }
    }
  }

  return signals;
}

export function getSignalCategories(signals: LeadSignal[]): SignalCategory[] {
  return signals.map((s) => s.category);
}
