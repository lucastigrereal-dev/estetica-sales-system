/**
 * MESSAGE TEMPLATES - INSTITUTO RODOVANSKY
 * Mensagens premium com tom sofisticado e acolhedor
 */

export const MESSAGE_TEMPLATES = {
  // ========================================
  // SAUDAÇÕES INICIAIS
  // ========================================
  greetings: {
    morning: `Bom dia! ☀️

Seja muito bem-vinda ao Instituto Rodovansky.

Sou a Aurora, assistente virtual da Dra. Karina, e estou aqui para proporcionar um atendimento exclusivo para você.

Como posso ajudá-la hoje?`,

    afternoon: `Boa tarde! 🌸

Seja muito bem-vinda ao Instituto Rodovansky.

Sou a Aurora, assistente virtual da Dra. Karina, e terei o prazer de auxiliá-la em sua jornada de cuidados estéticos.

Em que posso ser útil?`,

    evening: `Boa noite! ✨

Seja muito bem-vinda ao Instituto Rodovansky.

Sou a Aurora, assistente virtual da Dra. Karina. Mesmo fora do horário comercial, estou à disposição para esclarecer suas dúvidas.

Como posso ajudá-la?`,

    outOfHours: `Obrigada pelo contato! 💛

Nosso horário de atendimento é de segunda a sexta, das 8h às 20h, e aos sábados das 8h às 14h.

Retornaremos assim que possível. Fique à vontade para deixar sua mensagem! 🌸`,
  },

  // ========================================
  // QUALIFICAÇÃO DE LEADS
  // ========================================
  qualification: {
    procedureInterest: `Que maravilha que você se interessou pelo {PROCEDIMENTO}! 💫

Este é um dos nossos tratamentos mais procurados e os resultados são realmente transformadores.

Para que eu possa direcioná-la da melhor forma:

Você já realizou algum procedimento estético anteriormente?`,

    priceInquiry: `Entendo perfeitamente sua curiosidade sobre valores. 💎

O {PROCEDIMENTO} é um investimento em você mesma, e os valores variam de acordo com a avaliação personalizada da Dra. Karina.

Para que eu possa passar informações mais precisas:

Você prefere uma consulta presencial ou podemos iniciar com uma avaliação por vídeo?`,

    urgency: `Percebo que você gostaria de resolver isso o quanto antes, e fico feliz em ajudar! 🌟

A Dra. Karina sempre reserva alguns horários para casos prioritários.

Qual período seria mais conveniente para você?
□ Manhã (8h às 12h)
□ Tarde (14h às 18h)
□ Noite (18h às 20h)`,

    firstTime: `Que legal que esta será sua primeira vez com a gente! 💛

Para preparar a melhor experiência, gostaria de saber:

1. Qual é seu principal interesse?
2. Tem alguma preocupação específica?
3. Prefere agendar uma consulta presencial ou conhecer melhor por aqui primeiro?

Estamos aqui para você! ✨`,
  },

  // ========================================
  // TRANSFERÊNCIA PARA HUMANO
  // ========================================
  humanTransfer: {
    hotLead: `{NOME}, que alegria! 🎉

Pelo que conversamos, percebi que você está no momento ideal para dar esse passo.

Vou conectá-la agora com nossa consultora especializada, {VENDEDOR}, que vai cuidar pessoalmente de todos os detalhes para você.

Ela entrará em contato em instantes. Enquanto isso, fique à vontade para enviar qualquer dúvida adicional.

Até breve! 💛`,

    warmLead: `{NOME}, fico feliz em ajudar! 🌸

Vou transferir você para uma de nossas consultoras especializadas que poderá responder todas suas dúvidas com mais detalhes.

Um momentinho, por favor! 💫`,

    consultancyRequest: `{NOME}, perfeito! 🌟

Preparei tudo para você conversar com nossa especialista {VENDEDOR}.

Ela é incrível e vai adorar conhecê-la melhor. Já estou a conectando!

Um instante... 💛`,
  },

  // ========================================
  // AGENDAMENTO
  // ========================================
  scheduling: {
    confirmed: `Perfeito, {NOME}! ✨

Sua consulta está confirmada:

📅 Data: {DATA}
🕐 Horário: {HORA}
📍 Local: Instituto Rodovansky
   Rua João de Barros, 1000 - Boa Viagem, Recife - PE

Você receberá um lembrete 24h antes.

Estamos ansiosas para recebê-la! 🌸`,

    pendingConfirmation: `{NOME}, encontrei uma ótima opção para você! 💛

📅 {DATA}
🕐 {HORA}

Confirma este horário?
(Responda com "SIM" ou "NÃO")`,

    rescheduling: `Sem problema, {NOME}! 💫

Vou cancelar o agendamento anterior e agendar você para:

📅 {DATA}
🕐 {HORA}

Tudo pronto! Nos vemos em breve! 🌸`,
  },

  // ========================================
  // LEMBRETES
  // ========================================
  reminders: {
    reminder24h: `Olá, {NOME}! 🌸

Lembrando que amanhã, {DATA}, às {HORA}, você tem sua consulta no Instituto Rodovansky.

📍 Endereço: Rua João de Barros, 1000 - Boa Viagem, Recife

Precisa reagendar? É só me avisar aqui.

Te esperamos! ✨`,

    reminder2h: `{NOME}, falta pouco! 💫

Sua consulta é daqui a 2 horas, às {HORA}.

Dica: Chegue 10 minutinhos antes para um check-in tranquilo e preparar a pele para o procedimento.

Até já! 🌟`,

    confirmPresence: `Ótimo! Confirmado que você virá! 💛

Te vemos em {HORA}! 🌸

Qualquer dúvida, só me chamar! 💬`,

    canceledNotification: `Entendemos perfeitamente, {NOME}. 💙

Seu agendamento foi cancelado. Quando quiser voltar, é só nos chamar!

Estamos aqui para você sempre! 🌸`,
  },

  // ========================================
  // PÓS-ATENDIMENTO
  // ========================================
  postService: {
    immediate: `{NOME}, foi um prazer recebê-la hoje! 💛

Esperamos que tenha tido uma experiência especial com a gente.

Se precisar de algo, estamos sempre por aqui.

Com carinho,
Equipe Instituto Rodovansky 🌸`,

    npsInvitation: `{NOME}, sua opinião é muito importante! 💫

Em uma escala de 0 a 10, o quanto você recomendaria o Instituto Rodovansky para uma amiga?

(Responda apenas com o número) 💛`,

    npsFollowUp: {
      promoter: `Muito obrigada, {NOME}! 💛

Ficamos imensamente felizes com sua avaliação.

Indicações de pacientes como você são nosso maior reconhecimento.

Se quiser indicar alguém, é só compartilhar nosso contato! 🌸`,

      passive: `Obrigada pelo feedback, {NOME}!

Gostaríamos de entender melhor como podemos melhorar sua experiência.

Há algo específico que poderíamos ter feito diferente? 💬`,

      detractor: `{NOME}, sentimos muito que sua experiência não tenha sido como esperávamos. 😔

Sua opinião é muito valiosa para nós.

Poderia nos contar o que aconteceu? Queremos muito fazer diferente. 💛`,
    },

    reactivation: `Oi, {NOME}! 🌸

Faz tempo que não nos vemos!

Estamos com uma promoção especial para você que é uma cliente tão especial:

✨ {PROMOCAO}

Quer voltar? Já separei um horário para você!

Beijo, 💛`,
  },

  // ========================================
  // OUTROS
  // ========================================
  other: {
    faq_price: `Entendo! Podemos conversar sobre valores sim. 💎

Nossos preços variam conforme:
• Complexidade do procedimento
• Produtos utilizados
• Duração da sessão

O melhor é agendar uma consulta com a Dra. Karina para uma avaliação personalizada.

Quer que eu agende? 📅`,

    faq_duration: `Ótima pergunta! ⏰

A duração depende do procedimento:
• Limpeza: 60-90 min
• Botox: 30-45 min
• Preenchimento: 45-60 min
• Laser: 30-50 min

Qual procedimento você tem interesse? 💫`,

    faq_pain: `Que preocupação normal! 💙

A maioria dos nossos procedimentos é praticamente indolor. Utilizamos anestésicos tópicos e técnicas modernas.

A Dra. Karina sempre foca no conforto e bem-estar da paciente.

Qual procedimento você está considerando? 🌸`,

    faq_results: `Excelente pergunta! ✨

Os resultados variam conforme o procedimento:
• Visíveis: desde a primeira sessão
• Ótimos: após 7-14 dias
• Máximos: após 30 dias

Você pensa em qual procedimento? 💫`,
  },
};

/**
 * Helper function para substituir variáveis nos templates
 */
export const formatTemplate = (
  template: string,
  variables: Record<string, string>
): string => {
  let result = template;
  Object.entries(variables).forEach(([key, value]) => {
    result = result.replace(`{${key}}`, value);
  });
  return result;
};

/**
 * Selecionar saudação baseada na hora do dia
 */
export const getGreetingByTime = (): string => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return MESSAGE_TEMPLATES.greetings.morning;
  } else if (hour >= 12 && hour < 18) {
    return MESSAGE_TEMPLATES.greetings.afternoon;
  } else if (hour >= 18 && hour < 23) {
    return MESSAGE_TEMPLATES.greetings.evening;
  } else {
    return MESSAGE_TEMPLATES.greetings.outOfHours;
  }
};

/**
 * Selecion template de NPS baseado no score
 */
export const getNpsTemplate = (score: number): string => {
  if (score >= 9) {
    return MESSAGE_TEMPLATES.postService.npsFollowUp.promoter;
  } else if (score >= 7) {
    return MESSAGE_TEMPLATES.postService.npsFollowUp.passive;
  } else {
    return MESSAGE_TEMPLATES.postService.npsFollowUp.detractor;
  }
};

export default MESSAGE_TEMPLATES;
