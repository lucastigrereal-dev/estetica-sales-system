import { evaluateLead, LeadContext } from "./engine";

console.log("🧠 TESTE DO MOTOR TAERE v1.3");
console.log("============================\n");

// Caso 1: HOT - Dor + Urgência + Engajamento
console.log("📍 CASO 1: Lead HOT");
console.log("Mensagem: \"Faz anos que isso me incomoda, quero resolver esse mês. Pode me ligar?\"\n");

const caso1: LeadContext = {
  text: "Faz anos que isso me incomoda, quero resolver esse mês. Pode me ligar?",
  responseTime: 45, // Respondeu em 45 segundos
  messageLength: 72,
  audio: false,
};

const resultado1 = evaluateLead(caso1);

console.log("Estado:", resultado1.state);
console.log("Score Total:", resultado1.scores.total);
console.log("\nScores Detalhados:");
console.log("  - Timing (urgência):", resultado1.scores.timing, "/ 18");
console.log("  - Affective (dor):", resultado1.scores.affective, "/ 25");
console.log("  - Economic:", resultado1.scores.economic, "/ 15");
console.log("  - Risk (resistência):", resultado1.scores.risk, "/ 20");
console.log("  - Engagement:", resultado1.scores.engagement, "/ 22");
console.log("\nSinais Detectados:", resultado1.signals.length);
resultado1.signals.forEach((s) => {
  console.log(`  - [${s.category}] "${s.matched}" (peso: ${s.weight})`);
});
console.log("\nMotivos:", resultado1.reasons.join(", "));
console.log("Próxima Ação:", resultado1.nextAction);
console.log("Confiança:", (resultado1.confidence * 100).toFixed(1) + "%");

console.log("\n" + "=".repeat(60) + "\n");

// Caso 2: CURIOSO - Só pergunta preço
console.log("📍 CASO 2: Lead CURIOSO");
console.log("Mensagem: \"Quanto custa?\"\n");

const caso2: LeadContext = {
  text: "Quanto custa?",
  responseTime: 120, // Respondeu em 2 minutos
  messageLength: 13,
  audio: false,
};

const resultado2 = evaluateLead(caso2);

console.log("Estado:", resultado2.state);
console.log("Score Total:", resultado2.scores.total);
console.log("\nScores Detalhados:");
console.log("  - Timing (urgência):", resultado2.scores.timing, "/ 18");
console.log("  - Affective (dor):", resultado2.scores.affective, "/ 25");
console.log("  - Economic:", resultado2.scores.economic, "/ 15");
console.log("  - Risk (resistência):", resultado2.scores.risk, "/ 20");
console.log("  - Engagement:", resultado2.scores.engagement, "/ 22");
console.log("\nSinais Detectados:", resultado2.signals.length);
resultado2.signals.forEach((s) => {
  console.log(`  - [${s.category}] "${s.matched}" (peso: ${s.weight})`);
});
console.log("\nMotivos:", resultado2.reasons.join(", "));
console.log("Próxima Ação:", resultado2.nextAction);
console.log("Confiança:", (resultado2.confidence * 100).toFixed(1) + "%");

console.log("\n" + "=".repeat(60) + "\n");

// Caso 3: SPAM
console.log("📍 CASO 3: Lead SPAM");
console.log("Mensagem: \"Isso é golpe né\"\n");

const caso3: LeadContext = {
  text: "Isso é golpe né",
  responseTime: 30,
  messageLength: 15,
  audio: false,
};

const resultado3 = evaluateLead(caso3);

console.log("Estado:", resultado3.state);
console.log("Score Total:", resultado3.scores.total);
console.log("\nScores Detalhados:");
console.log("  - Timing (urgência):", resultado3.scores.timing, "/ 18");
console.log("  - Affective (dor):", resultado3.scores.affective, "/ 25");
console.log("  - Economic:", resultado3.scores.economic, "/ 15");
console.log("  - Risk (resistência):", resultado3.scores.risk, "/ 20");
console.log("  - Engagement:", resultado3.scores.engagement, "/ 22");
console.log("\nSinais Detectados:", resultado3.signals.length);
resultado3.signals.forEach((s) => {
  console.log(`  - [${s.category}] "${s.matched}" (peso: ${s.weight})`);
});
console.log("\nMotivos:", resultado3.reasons.join(", "));
console.log("Próxima Ação:", resultado3.nextAction);
console.log("Confiança:", (resultado3.confidence * 100).toFixed(1) + "%");

console.log("\n" + "=".repeat(60));
console.log("\n✅ Teste concluído! Motor TAERE v1.3 funcionando.\n");
