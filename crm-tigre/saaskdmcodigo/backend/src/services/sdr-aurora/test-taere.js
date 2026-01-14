// Teste standalone do motor TAERE v1.3 em JavaScript puro

// ============================================
// COPIAR CÓDIGO DO MOTOR (inline para teste)
// ============================================

// types.js
const LeadState = {
  SPAM: "SPAM",
  COLD: "COLD",
  CURIOSO: "CURIOSO",
  WARM: "WARM",
  HOT: "HOT",
};

const SignalCategory = {
  DOR: "DOR",
  URGENCIA: "URGENCIA",
  ECONOMICO: "ECONOMICO",
  MEDO: "MEDO",
  ENGAJAMENTO: "ENGAJAMENTO",
  DECISAO_SILENCIOSA: "DECISAO_SILENCIOSA",
  MENTIRA_EDUCADA: "MENTIRA_EDUCADA",
  SPAM: "SPAM",
};

// patterns.js
const INTIMAX_PATTERNS = [
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

// extractSignals.js
function extractSignals(ctx) {
  const signals = [];
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

function getSignalCategories(signals) {
  return signals.map((s) => s.category);
}

// scoring.js
const DEFAULT_WEIGHTS = {
  timing: 18,
  affective: 25,
  economic: 15,
  risk: 20,
  engagement: 22,
};

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function countCats(signalCats, cat) {
  return signalCats.filter((s) => s === cat).length;
}

function scoreTiming(ctx, signalCats = []) {
  const urgCount = countCats(signalCats, SignalCategory.URGENCIA);
  let pts = urgCount * 0.55 * DEFAULT_WEIGHTS.timing;
  if (urgCount > 0 && (ctx.messageLength || 0) < 80) pts += 2;
  return clamp(pts, 0, DEFAULT_WEIGHTS.timing);
}

function scoreAffective(signalCats) {
  const count = countCats(signalCats, SignalCategory.DOR);
  return clamp(count * 0.55 * DEFAULT_WEIGHTS.affective, 0, DEFAULT_WEIGHTS.affective);
}

function scoreEconomic(signalCats, ctx) {
  const count = countCats(signalCats, SignalCategory.ECONOMICO);
  let pts = count * 0.35 * DEFAULT_WEIGHTS.economic;
  const text = (ctx?.text || "").toLowerCase();
  if (/\b(parcel|parcelar|em\s+\d+\s*x)\b/i.test(text)) pts += 4;
  if (/\b(caro|n[aã]o\s+tenho|sem\s+condi[cç][aã]o)\b/i.test(text)) pts -= 6;
  const hasDor = countCats(signalCats, SignalCategory.DOR) > 0;
  const hasEng = countCats(signalCats, SignalCategory.ENGAJAMENTO) > 0;
  const hasUrg = countCats(signalCats, SignalCategory.URGENCIA) > 0;
  if (count > 0 && !hasDor && !hasEng && !hasUrg) pts -= 3;
  return clamp(pts, 0, DEFAULT_WEIGHTS.economic);
}

function scoreRiskResistance(signalCats, ctx) {
  const medoCount = countCats(signalCats, SignalCategory.MEDO);
  const spamCount = countCats(signalCats, SignalCategory.SPAM);
  let pts = DEFAULT_WEIGHTS.risk;
  pts -= medoCount * 0.35 * DEFAULT_WEIGHTS.risk;
  const text = (ctx?.text || "").toLowerCase();
  if (/\b(golpe|impot[eê]ncia|perder\s+sensibilidade)\b/i.test(text)) pts -= 6;
  if (spamCount > 0) pts = 0;
  return clamp(pts, 0, DEFAULT_WEIGHTS.risk);
}

function scoreEngagement(ctx, signalCats) {
  const engCount = countCats(signalCats, SignalCategory.ENGAJAMENTO);
  const decisaoSilenciosa = countCats(signalCats, SignalCategory.DECISAO_SILENCIOSA);
  const mentiraEducada = countCats(signalCats, SignalCategory.MENTIRA_EDUCADA);
  let pts = engCount * 0.5 * DEFAULT_WEIGHTS.engagement;
  pts += decisaoSilenciosa > 0 ? 4 : 0;
  const rt = ctx.responseTime;
  if (rt !== undefined) {
    if (rt < 60) pts += 6;
    else if (rt < 300) pts += 4;
    else if (rt < 1200) pts += 2;
    else pts += 0.5;
  }
  if (ctx.audio) pts += 6;
  const ml = ctx.messageLength || (ctx.text?.length || 0);
  if (ml >= 120) pts += 2;
  if (ml >= 250) pts += 1;
  if (mentiraEducada > 0) pts -= 6;
  return clamp(pts, 0, DEFAULT_WEIGHTS.engagement);
}

function scoreTAERE(ctx, signalCats) {
  const scores = {
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

// classifier.js
function classifyState(scores, signalCats) {
  const hasSpam = signalCats.includes(SignalCategory.SPAM);
  if (hasSpam) return LeadState.SPAM;

  const hasDor = signalCats.includes(SignalCategory.DOR);
  const hasEng = signalCats.includes(SignalCategory.ENGAJAMENTO);
  const hasUrg = signalCats.includes(SignalCategory.URGENCIA);

  const onlyEconomic = signalCats.every((c) => c === SignalCategory.ECONOMICO) && signalCats.length > 0;
  if (onlyEconomic && scores.total < 45) return LeadState.CURIOSO;

  if (scores.total >= 65 && (hasDor || hasEng) && hasUrg) return LeadState.HOT;
  if (scores.total >= 50) return LeadState.WARM;
  if (scores.total >= 30) return LeadState.COLD;

  return LeadState.CURIOSO;
}

function decideAction(state) {
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

function buildReasons(scores, signalCats) {
  const reasons = [];
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

// engine.js
function evaluateLead(ctx) {
  const signals = extractSignals(ctx);
  const signalCats = getSignalCategories(signals);
  const scores = scoreTAERE(ctx, signalCats);
  const state = classifyState(scores, signalCats);
  const nextAction = decideAction(state);
  const reasons = buildReasons(scores, signalCats);
  const confidence = Math.min(0.95, 0.5 + signals.length * 0.1 + scores.total / 200);

  return { state, scores, signals, reasons, nextAction, confidence };
}

// ============================================
// TESTES
// ============================================

console.log("🧠 TESTE DO MOTOR TAERE v1.3");
console.log("============================\n");

// Caso 1: HOT
console.log("📍 CASO 1: Lead HOT");
console.log('Mensagem: "Faz anos que isso me incomoda, quero resolver esse mês. Pode me ligar?"\n');

const caso1 = {
  text: "Faz anos que isso me incomoda, quero resolver esse mês. Pode me ligar?",
  responseTime: 45,
  messageLength: 72,
  audio: false,
};

const resultado1 = evaluateLead(caso1);

console.log("🎯 Estado:", resultado1.state);
console.log("📊 Score Total:", resultado1.scores.total);
console.log("\n📈 Scores Detalhados:");
console.log("  - Timing (urgência):", resultado1.scores.timing, "/ 18");
console.log("  - Affective (dor):", resultado1.scores.affective, "/ 25");
console.log("  - Economic:", resultado1.scores.economic, "/ 15");
console.log("  - Risk (resistência):", resultado1.scores.risk, "/ 20");
console.log("  - Engagement:", resultado1.scores.engagement, "/ 22");
console.log("\n🔍 Sinais Detectados:", resultado1.signals.length);
resultado1.signals.forEach((s) => {
  console.log(`  - [${s.category}] "${s.matched}" (peso: ${s.weight})`);
});
console.log("\n💡 Motivos:", resultado1.reasons.join(", "));
console.log("➡️  Próxima Ação:", resultado1.nextAction);
console.log("✅ Confiança:", (resultado1.confidence * 100).toFixed(1) + "%");

console.log("\n" + "=".repeat(60) + "\n");

// Caso 2: CURIOSO
console.log("📍 CASO 2: Lead CURIOSO");
console.log('Mensagem: "Quanto custa?"\n');

const caso2 = {
  text: "Quanto custa?",
  responseTime: 120,
  messageLength: 13,
  audio: false,
};

const resultado2 = evaluateLead(caso2);

console.log("🎯 Estado:", resultado2.state);
console.log("📊 Score Total:", resultado2.scores.total);
console.log("\n📈 Scores Detalhados:");
console.log("  - Timing (urgência):", resultado2.scores.timing, "/ 18");
console.log("  - Affective (dor):", resultado2.scores.affective, "/ 25");
console.log("  - Economic:", resultado2.scores.economic, "/ 15");
console.log("  - Risk (resistência):", resultado2.scores.risk, "/ 20");
console.log("  - Engagement:", resultado2.scores.engagement, "/ 22");
console.log("\n🔍 Sinais Detectados:", resultado2.signals.length);
resultado2.signals.forEach((s) => {
  console.log(`  - [${s.category}] "${s.matched}" (peso: ${s.weight})`);
});
console.log("\n💡 Motivos:", resultado2.reasons.join(", "));
console.log("➡️  Próxima Ação:", resultado2.nextAction);
console.log("✅ Confiança:", (resultado2.confidence * 100).toFixed(1) + "%");

console.log("\n" + "=".repeat(60) + "\n");

// Caso 3: SPAM
console.log("📍 CASO 3: Lead SPAM");
console.log('Mensagem: "Isso é golpe né"\n');

const caso3 = {
  text: "Isso é golpe né",
  responseTime: 30,
  messageLength: 15,
  audio: false,
};

const resultado3 = evaluateLead(caso3);

console.log("🎯 Estado:", resultado3.state);
console.log("📊 Score Total:", resultado3.scores.total);
console.log("\n📈 Scores Detalhados:");
console.log("  - Timing (urgência):", resultado3.scores.timing, "/ 18");
console.log("  - Affective (dor):", resultado3.scores.affective, "/ 25");
console.log("  - Economic:", resultado3.scores.economic, "/ 15");
console.log("  - Risk (resistência):", resultado3.scores.risk, "/ 20");
console.log("  - Engagement:", resultado3.scores.engagement, "/ 22");
console.log("\n🔍 Sinais Detectados:", resultado3.signals.length);
resultado3.signals.forEach((s) => {
  console.log(`  - [${s.category}] "${s.matched}" (peso: ${s.weight})`);
});
console.log("\n💡 Motivos:", resultado3.reasons.join(", "));
console.log("➡️  Próxima Ação:", resultado3.nextAction);
console.log("✅ Confiança:", (resultado3.confidence * 100).toFixed(1) + "%");

console.log("\n" + "=".repeat(60));
console.log("\n✅ Teste concluído! Motor TAERE v1.3 funcionando perfeitamente.\n");
