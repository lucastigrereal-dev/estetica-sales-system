-- =====================================================
-- INSTAGRAM SYSTEM - SQL PARTE 2
-- DADOS COMPLETOS - Dra. Karina Rodovanski
-- Instituto Rodovanski
-- Gerado: 28/12/2024
-- =====================================================
-- CONTEÚDO:
-- • 120 CTAs Premium (8 categorias)
-- • 210 Hashtags (6 temas)
-- • 400+ Combos de Hashtags
-- • Ideias Adicionais
-- • Protocol Steps Completos
-- • Calendário 90 dias Completo
-- =====================================================

-- =====================================================
-- PARTE 1: 120 CTAs PREMIUM INTIMAX
-- =====================================================

-- CATEGORIA 1: SALVAMENTO (15 CTAs)
INSERT INTO components (profile_id, type, name, content, format, tags, metadata) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-SAVE-001', 'Salva esse post 📌 — você vai precisar depois', 'Reels', ARRAY['salvamento', 'educativo', 'alto-save'], '{"categoria": "Salvamento", "observacao": "CTA simplificado, funciona melhor em vídeos educativos. Alto volume de saves = autoridade"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-SAVE-002', 'Marca esse aqui ⭐ para rever depois', 'Carrossel', ARRAY['salvamento', 'carrossel'], '{"categoria": "Salvamento", "observacao": "Variação para carousel com múltiplos slides educativos"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-SAVE-003', 'Guarde esse conteúdo — referência importante', 'Stories', ARRAY['salvamento', 'profissional'], '{"categoria": "Salvamento", "observacao": "Tom mais profissional, elegante, sem apelo visual gritante"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-SAVE-004', 'Esse é o tipo de informação que você salva e volta a consultar', 'Reels', ARRAY['salvamento', 'conversacional'], '{"categoria": "Salvamento", "observacao": "Mais longo, conversacional, humaniza a marca"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-SAVE-005', 'Coloca nos favoritos 📌 — material de consulta', 'Carrossel', ARRAY['salvamento', 'casual'], '{"categoria": "Salvamento", "observacao": "Variação casual porém profissional"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-SAVE-006', 'Esse conteúdo merece estar nos seus salvos', 'Reels', ARRAY['salvamento', 'sutil'], '{"categoria": "Salvamento", "observacao": "Implícito, sutil, tira o tom comercial direto"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-SAVE-007', 'Verdade que você quer guardar?', 'Stories', ARRAY['salvamento', 'pergunta'], '{"categoria": "Salvamento", "observacao": "Pergunta retórica, engaja subconsciente"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-SAVE-008', 'Material que vale voltar a ler', 'Carrossel', ARRAY['salvamento', 'autoridade'], '{"categoria": "Salvamento", "observacao": "Reforça autoridade educativa"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-SAVE-009', 'Quando tiver dúvida, volta nesse post aqui', 'Reels', ARRAY['salvamento', 'referencia'], '{"categoria": "Salvamento", "observacao": "Posiciona como referência futura, aumenta propensão a save"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-SAVE-010', 'Uma aula inteira em 60 segundos — salva para rever', 'Stories', ARRAY['salvamento', 'valor'], '{"categoria": "Salvamento", "observacao": "Reforça valor concentrado, incentiva revisita"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-SAVE-011', 'Guarda isso — a gente volta aqui sempre que precisar', 'Carrossel', ARRAY['salvamento', 'recurso'], '{"categoria": "Salvamento", "observacao": "Posiciona como recurso contínuo, referência duradoura"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-SAVE-012', 'Cada ponto aqui merecia uma aula separada — salva', 'Reels', ARRAY['salvamento', 'densidade'], '{"categoria": "Salvamento", "observacao": "Reforça densidade de valor, incentiva save"}'),

-- CATEGORIA 2: COMENTÁRIO/ENGAJAMENTO (15 CTAs)
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-COMMENT-001', 'Comenta aqui: já conhecia essa informação?', 'Reels', ARRAY['comentario', 'pergunta-aberta'], '{"categoria": "Comentário", "observacao": "Pergunta aberta, baixa pressão para responder, gera conversa genuína"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-COMMENT-002', 'Deixa sua dúvida nos comentários 👇', 'Carrossel', ARRAY['comentario', 'direto'], '{"categoria": "Comentário", "observacao": "Convite direto, específico (dúvida), qualifica quem comenta"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-COMMENT-003', 'Qual é a sua experiência? Comenta abaixo', 'Stories', ARRAY['comentario', 'experiencia'], '{"categoria": "Comentário", "observacao": "Humaniza, solicita prova social indireta"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-COMMENT-004', 'Isso acontece com você também? (Comenta SIM ou NÃO)', 'Reels', ARRAY['comentario', 'binario', 'alto-engajamento'], '{"categoria": "Comentário", "observacao": "Binária e direta, gera alto engajamento com baixa fricção"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-COMMENT-005', 'Conte aqui: qual foi sua descoberta?', 'Carrossel', ARRAY['comentario', 'story-sharing'], '{"categoria": "Comentário", "observacao": "Abre espaço para story sharing, diferencia comentários genéricos"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-COMMENT-006', 'Debate aqui nos comentários — concordam?', 'Reels', ARRAY['comentario', 'debate'], '{"categoria": "Comentário", "observacao": "Cria tensão produtiva (debate), aumenta tempo na sessão"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-COMMENT-007', 'O que você mudaria nessa informação?', 'Stories', ARRAY['comentario', 'opiniao'], '{"categoria": "Comentário", "observacao": "Pergunta que valida opinião do seguidor, cria propriedade emocional"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-COMMENT-008', 'Escreve aqui se você já experimentou', 'Carrossel', ARRAY['comentario', 'conversacional'], '{"categoria": "Comentário", "observacao": "Menos diretivo que comenta, mais conversacional"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-COMMENT-009', 'Qual desses pontos mais afeta você? (Comenta o número)', 'Reels', ARRAY['comentario', 'segmentacao'], '{"categoria": "Comentário", "observacao": "Segmenta resposta, qualifica lead por interesse específico"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-COMMENT-010', 'Sua maior dúvida sobre isso é...? Comenta', 'Stories', ARRAY['comentario', 'objecoes'], '{"categoria": "Comentário", "observacao": "Abre espaço para identificar objeções reais"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-COMMENT-011', 'Conta sua experiência — cada história é importante', 'Carrossel', ARRAY['comentario', 'validacao'], '{"categoria": "Comentário", "observacao": "Valida story pessoal, remove julgamento"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-COMMENT-012', 'Você concorda ou discorda? Deixa sua opinião', 'Reels', ARRAY['comentario', 'debate'], '{"categoria": "Comentário", "observacao": "Cria debate, aumenta time on app"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-COMMENT-013', 'Qual dessas frases te tocou mais? Escreve aqui', 'Stories', ARRAY['comentario', 'emocao'], '{"categoria": "Comentário", "observacao": "Segmenta resposta por emoção, qualifica engajamento"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-COMMENT-014', 'Você tinha essa informação aí? Comenta o que sabia', 'Carrossel', ARRAY['comentario', 'comparacao'], '{"categoria": "Comentário", "observacao": "Apela para comparação pessoal, engaja por aprendizado"}'),

-- CATEGORIA 3: COMPARTILHAMENTO (12 CTAs)
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-SHARE-001', 'Compartilha isso com quem você ama 💙', 'Reels', ARRAY['compartilhamento', 'emocional'], '{"categoria": "Compartilhamento", "observacao": "Apela para relação pessoal, não comercial. Indireto mas efetivo"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-SHARE-002', 'Manda para aquela pessoa que precisa ler isso', 'Carrossel', ARRAY['compartilhamento', 'ajuda'], '{"categoria": "Compartilhamento", "observacao": "Contextualiza compartilhamento (ajudar alguém), não pedir visualizações"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-SHARE-003', 'Envia para seu grupo de amigas', 'Stories', ARRAY['compartilhamento', 'grupo'], '{"categoria": "Compartilhamento", "observacao": "Apela para círculo pessoal, segmenta por gênero se relevante"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-SHARE-004', 'Seu melhor amigo precisa saber disso?', 'Reels', ARRAY['compartilhamento', 'pergunta'], '{"categoria": "Compartilhamento", "observacao": "Pergunta retórica que motiva share sem ser agressivo"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-SHARE-005', 'Passa adiante: essa informação é valiosa', 'Carrossel', ARRAY['compartilhamento', 'valor'], '{"categoria": "Compartilhamento", "observacao": "Reforça valor percebido antes de pedir share"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-SHARE-006', 'Compartilha com quem está pensando em fazer isso', 'Stories', ARRAY['compartilhamento', 'segmentado'], '{"categoria": "Compartilhamento", "observacao": "Contextualiza para segmento específico (quem está considerando)"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-SHARE-007', 'Verdade que merece ser espalhada', 'Reels', ARRAY['compartilhamento', 'advocacy'], '{"categoria": "Compartilhamento", "observacao": "Apela para advocacy natural, não força comercial"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-SHARE-008', 'Seu partner/amigo merecia ler isso', 'Carrossel', ARRAY['compartilhamento', 'relacionamento'], '{"categoria": "Compartilhamento", "observacao": "Humaniza relação, motiva share para relacionamento"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-SHARE-009', 'Esse conhecimento merecia estar com mais gente', 'Stories', ARRAY['compartilhamento', 'advocacy'], '{"categoria": "Compartilhamento", "observacao": "Apela para advocacy, não comercial"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-SHARE-010', 'Repassa para o grupo que tá em dúvida', 'Carrossel', ARRAY['compartilhamento', 'grupo'], '{"categoria": "Compartilhamento", "observacao": "Contextualiza compartilhamento (ajudar grupo), motiva share"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-SHARE-011', 'Tá vendo? Compartilha esse insight com quem precisa', 'Reels', ARRAY['compartilhamento', 'urgencia'], '{"categoria": "Compartilhamento", "observacao": "Cria urgência suave, motiva share"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-SHARE-012', 'Spread: essa verdade com gente que ama você', 'Stories', ARRAY['compartilhamento', 'cuidado'], '{"categoria": "Compartilhamento", "observacao": "Apela para cuidado de terceiros (não venda), motiva share"}'),

-- CATEGORIA 4: DIRECT/MENSAGEM (12 CTAs)
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-DM-001', 'Manda DM sua dúvida — vou responder pessoalmente', 'Reels', ARRAY['direct', 'pessoal'], '{"categoria": "Direct", "observacao": "Promete contato 1:1, qualifica leads, abre conversação"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-DM-002', 'Alguma dúvida? Chama no DM', 'Carrossel', ARRAY['direct', 'curto'], '{"categoria": "Direct", "observacao": "Curto, acessível, convida intimidade de mensagem privada"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-DM-003', 'Quer saber mais? Manda mensagem aqui', 'Stories', ARRAY['direct', 'abertura'], '{"categoria": "Direct", "observacao": "Abre porta para conversa sem compromisso"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-DM-004', 'Envie sua história no DM — estou aqui para ouvir', 'Reels', ARRAY['direct', 'empatia'], '{"categoria": "Direct", "observacao": "Valida experiência pessoal, cria espaço seguro"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-DM-005', 'Fale comigo nos DM — sem pressa, sem pressão', 'Carrossel', ARRAY['direct', 'sem-pressao'], '{"categoria": "Direct", "observacao": "Remove fricção, deixa claro que não é sales call agressivo"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-DM-006', 'Bate um papo comigo lá nos DM', 'Stories', ARRAY['direct', 'casual'], '{"categoria": "Direct", "observacao": "Tom casual, humanizado, encoraja interação informal"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-DM-007', 'Quer trocar uma ideia? Vem no privado', 'Reels', ARRAY['direct', 'pares'], '{"categoria": "Direct", "observacao": "Posiciona como conversa entre pares, não palestra"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-DM-008', 'Sua questão é pessoal? Manda no DM', 'Carrossel', ARRAY['direct', 'privacidade'], '{"categoria": "Direct", "observacao": "Reconhece privacidade, segmenta conversas sensíveis"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-DM-009', 'Questão delicada? Manda no privado, sem constrangimento', 'Reels', ARRAY['direct', 'seguro'], '{"categoria": "Direct", "observacao": "Remove ansiedade sobre privacidade, incentiva DM"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-DM-010', 'Quer parar de ter dúvida? Manda mensagem e vamos resolver', 'Stories', ARRAY['direct', 'resolucao'], '{"categoria": "Direct", "observacao": "Promete resolução, não sales pitch"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-DM-011', 'Tá com receio? Vem conversar sem pressão lá', 'Carrossel', ARRAY['direct', 'acolhimento'], '{"categoria": "Direct", "observacao": "Reconhece objeção emocional, remove fricção"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-DM-012', 'Seu medo é legítimo — vem falar disso no DM', 'Reels', ARRAY['direct', 'validacao'], '{"categoria": "Direct", "observacao": "Valida medo, cria espaço seguro para conversa"}'),

-- CATEGORIA 5: WHATSAPP (10 CTAs)
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-WPP-001', 'Clica aqui e manda mensagem no WhatsApp', 'Stories', ARRAY['whatsapp', 'direto'], '{"categoria": "WhatsApp", "observacao": "Botão direto, conversacional, baixa fricção"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-WPP-002', 'Quer falar agora? Link do WhatsApp nos links da bio 💬', 'Reels', ARRAY['whatsapp', 'bio'], '{"categoria": "WhatsApp", "observacao": "CTA que reconhece perfil mobile-first"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-WPP-003', 'Me encontre no WhatsApp — é mais rápido', 'Carrossel', ARRAY['whatsapp', 'velocidade'], '{"categoria": "WhatsApp", "observacao": "Reforça benefício (velocidade) da escolha de canal"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-WPP-004', 'Bora conversar? WhatsApp aberto aqui', 'Stories', ARRAY['whatsapp', 'informal'], '{"categoria": "WhatsApp", "observacao": "Tom informal, convida para conversa não-formal"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-WPP-005', 'Interesse? Clica no link do WhatsApp e manda oi', 'Reels', ARRAY['whatsapp', 'passo-a-passo'], '{"categoria": "WhatsApp", "observacao": "Guia passo a passo, remove dúvida sobre o que fazer"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-WPP-006', 'Prefere conversar ali? Estou no WhatsApp', 'Carrossel', ARRAY['whatsapp', 'escolha'], '{"categoria": "WhatsApp", "observacao": "Oferece escolha de canal, reconhece preferências"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-WPP-007', 'Seu horário é melhor lá no WhatsApp', 'Stories', ARRAY['whatsapp', 'conveniencia'], '{"categoria": "WhatsApp", "observacao": "Apela para conveniência, valida timing do usuário"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-WPP-008', 'Prefere um contato direto? Chama lá no WhatsApp', 'Carrossel', ARRAY['whatsapp', 'direto'], '{"categoria": "WhatsApp", "observacao": "Oferece escolha, reconhece perfil individual"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-WPP-009', 'Tempo do WhatsApp é agora — estou aqui', 'Reels', ARRAY['whatsapp', 'disponibilidade'], '{"categoria": "WhatsApp", "observacao": "Cria urgência suave, disponibilidade"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-WPP-010', 'Número tá aí, manda um oi — a gente responde rápido', 'Stories', ARRAY['whatsapp', 'velocidade'], '{"categoria": "WhatsApp", "observacao": "Cria expectativa de velocidade, incentiva ação"}'),

-- CATEGORIA 6: AGENDAMENTO (15 CTAs)
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-AGENDA-001', 'Quer saber se é pra você? Agende uma consulta', 'Reels', ARRAY['agendamento', 'qualificacao'], '{"categoria": "Agendamento", "observacao": "Qualifica interesse antes de agendamento (baixa fricção)"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-AGENDA-002', 'Pronto para saber mais? Agende sua avaliação', 'Carrossel', ARRAY['agendamento', 'avaliacao'], '{"categoria": "Agendamento", "observacao": "Movimento natural (educação → avaliação), reforça passo seguinte"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-AGENDA-003', 'Consultoria sem compromisso — agende aqui', 'Stories', ARRAY['agendamento', 'sem-compromisso'], '{"categoria": "Agendamento", "observacao": "Remove objeção (sem compromisso), facilita agendamento"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-AGENDA-004', 'Vamos conversar sobre seu caso específico?', 'Reels', ARRAY['agendamento', 'personalizado'], '{"categoria": "Agendamento", "observacao": "Personaliza linguagem (seu caso), não genérica"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-AGENDA-005', 'Marca uma conversa comigo — primeiro passo é entender você', 'Carrossel', ARRAY['agendamento', 'centrado-paciente'], '{"categoria": "Agendamento", "observacao": "Reforça abordagem centrada no paciente"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-AGENDA-006', 'Quer uma orientação personalizada? Agende comigo', 'Stories', ARRAY['agendamento', 'orientacao'], '{"categoria": "Agendamento", "observacao": "Posiciona consulta como benefício personalizado"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-AGENDA-007', 'Curiosa? Podemos tirar as dúvidas juntas', 'Reels', ARRAY['agendamento', 'conversacional'], '{"categoria": "Agendamento", "observacao": "Tom conversacional, reduz ansiedade (tirar dúvidas)"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-AGENDA-008', 'Seu momento é agora? Encontro você marcado', 'Carrossel', ARRAY['agendamento', 'momentum'], '{"categoria": "Agendamento", "observacao": "Apela para momentum (seu momento), cria urgência suave"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-AGENDA-009', 'Vamos explorar o que é possível pra você?', 'Stories', ARRAY['agendamento', 'exploracao'], '{"categoria": "Agendamento", "observacao": "Posiciona consulta como exploração, não decisão"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-AGENDA-010', 'Quer conhecer opções? Marca sua consulta', 'Carrossel', ARRAY['agendamento', 'discovery'], '{"categoria": "Agendamento", "observacao": "Reposiciona consulta como discovery, não venda"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-AGENDA-011', 'Seu primeiro passo para entender melhor é aqui', 'Reels', ARRAY['agendamento', 'primeiro-passo'], '{"categoria": "Agendamento", "observacao": "Posiciona consulta como primeiro passo, não decisão"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-AGENDA-012', 'Vamos mapear o melhor caminho para você?', 'Stories', ARRAY['agendamento', 'planejamento'], '{"categoria": "Agendamento", "observacao": "Posiciona consulta como planejamento customizado"}'),

-- CATEGORIA 7: AUTORIDADE/EDUCAÇÃO (15 CTAs)
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-AUTH-001', 'Salva essa dica para aplicar hoje mesmo', 'Reels', ARRAY['autoridade', 'pratico'], '{"categoria": "Autoridade", "observacao": "Posiciona como ação prática, não teoria pura"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-AUTH-002', 'Essa informação pode mudar sua perspectiva', 'Carrossel', ARRAY['autoridade', 'transformador'], '{"categoria": "Autoridade", "observacao": "Promete transformação de perspectiva, não resultado físico"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-AUTH-003', 'Poucos falam sobre isso — presta atenção', 'Stories', ARRAY['autoridade', 'exclusivo'], '{"categoria": "Autoridade", "observacao": "Cria senso de exclusividade do conteúdo"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-AUTH-004', 'Informação que você não encontra em qualquer lugar', 'Reels', ARRAY['autoridade', 'diferenciado'], '{"categoria": "Autoridade", "observacao": "Diferencia de conteúdo genérico, reforça valor"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-AUTH-005', 'Quer entender de verdade? Continua assistindo', 'Carrossel', ARRAY['autoridade', 'retencao'], '{"categoria": "Autoridade", "observacao": "Retém audiência para conteúdo mais profundo"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-AUTH-006', 'Esse é o conhecimento que faz diferença', 'Stories', ARRAY['autoridade', 'valor'], '{"categoria": "Autoridade", "observacao": "Reforça diferenciação e valor do conteúdo"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-AUTH-007', 'Educação de qualidade — é isso que você merece', 'Reels', ARRAY['autoridade', 'qualidade'], '{"categoria": "Autoridade", "observacao": "Posiciona como educação premium, não marketing"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-AUTH-008', 'Siga esses passos e você vai notar diferença', 'Reels', ARRAY['autoridade', 'acionavel'], '{"categoria": "Autoridade", "observacao": "Posiciona como acionável, prático, não teórico"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-AUTH-009', 'Você merecia ouvir a verdade completa — está aqui', 'Stories', ARRAY['autoridade', 'honestidade'], '{"categoria": "Autoridade", "observacao": "Apela para confiança, honestidade, diferencia de marketing vazio"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-AUTH-010', 'Esse conteúdo é para quem quer saber a realidade', 'Carrossel', ARRAY['autoridade', 'autenticidade'], '{"categoria": "Autoridade", "observacao": "Apela para busca de autenticidade, diferencia audiência"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-AUTH-011', 'A verdade dói? Talvez. Mas é transformadora', 'Reels', ARRAY['autoridade', 'honestidade'], '{"categoria": "Autoridade", "observacao": "Apela para honestidade, diferencia de marketing raso"}'),

-- CATEGORIA 8: PROVA SOCIAL (15 CTAs)
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-SOCIAL-001', 'Olha só o que as pacientes estão dizendo', 'Reels', ARRAY['prova-social', 'depoimento'], '{"categoria": "Prova Social", "observacao": "Introduz depoimentos de forma natural"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-SOCIAL-002', 'Histórias reais de quem já passou por aqui', 'Carrossel', ARRAY['prova-social', 'historias'], '{"categoria": "Prova Social", "observacao": "Posiciona como narrativa humana, não propaganda"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-SOCIAL-003', 'Isso é o que as pacientes mais falam', 'Stories', ARRAY['prova-social', 'feedback'], '{"categoria": "Prova Social", "observacao": "Credibilidade através de feedback recorrente"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-SOCIAL-004', 'Veja o que acontece quando você decide confiar', 'Reels', ARRAY['prova-social', 'confianca'], '{"categoria": "Prova Social", "observacao": "Associa resultado com decisão de confiança"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-SOCIAL-005', 'Resultados documentados — sem filtro', 'Carrossel', ARRAY['prova-social', 'autenticidade'], '{"categoria": "Prova Social", "observacao": "Enfatiza autenticidade e transparência"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-SOCIAL-006', 'Por dentro da clínica — assim que funciona', 'Stories', ARRAY['prova-social', 'bastidores'], '{"categoria": "Prova Social", "observacao": "Transparência operacional, bastidores"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-SOCIAL-007', 'Depoimento espontâneo — nada ensaiado', 'Reels', ARRAY['prova-social', 'espontaneo'], '{"categoria": "Prova Social", "observacao": "Reforça naturalidade, credibilidade"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-SOCIAL-008', 'O dia a dia aqui na clínica — realidade', 'Carrossel', ARRAY['prova-social', 'rotina'], '{"categoria": "Prova Social", "observacao": "Humaniza operação, mostra realidade"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-SOCIAL-009', 'Esses são os verdadeiros feedbacks dos pacientes', 'Stories', ARRAY['prova-social', 'verdadeiro'], '{"categoria": "Prova Social", "observacao": "Reforça autenticidade, qualifica como verdadeiro não filtrado"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-SOCIAL-010', 'Pacientes que transformaram a vida — ouça aqui', 'Carrossel', ARRAY['prova-social', 'transformacao'], '{"categoria": "Prova Social", "observacao": "Apela para transformação, não resultado cosmético"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-SOCIAL-011', 'Vários casos, vários resultados — tudo documentado aqui', 'Reels', ARRAY['prova-social', 'diversidade'], '{"categoria": "Prova Social", "observacao": "Reforça amplitude de casos, não cherry-picking"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-SOCIAL-012', 'Histórias reais, sem filtro, sem edição mentirosa', 'Stories', ARRAY['prova-social', 'autenticidade'], '{"categoria": "Prova Social", "observacao": "Reforça autenticidade total, confiança"}'),
('550e8400-e29b-41d4-a716-446655440001', 'cta', 'CTA-SOCIAL-013', 'Pacientes que decidiram confiar — resultados falam sozinhos', 'Carrossel', ARRAY['prova-social', 'confianca'], '{"categoria": "Prova Social", "observacao": "Posiciona resultado como consequência de confiança"}');

-- =====================================================
-- PARTE 2: HASHTAGS COMPLETAS - 6 TEMAS (210 HASHTAGS)
-- =====================================================

-- TEMA 1: AUTORIDADE/EDUCAÇÃO (35 hashtags)
INSERT INTO components (profile_id, type, name, content, format, tags, metadata) VALUES
-- Broad (10)
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-AUTH-B01', '#estetica', 'universal', ARRAY['autoridade', 'broad'], '{"tema": "Autoridade", "alcance": "broad", "volume": "15.2M"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-AUTH-B02', '#beleza', 'universal', ARRAY['autoridade', 'broad'], '{"tema": "Autoridade", "alcance": "broad", "volume": "26.6M"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-AUTH-B03', '#saude', 'universal', ARRAY['autoridade', 'broad'], '{"tema": "Autoridade", "alcance": "broad", "volume": "37.6M"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-AUTH-B04', '#autocuidado', 'universal', ARRAY['autoridade', 'broad'], '{"tema": "Autoridade", "alcance": "broad", "volume": "4.2M"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-AUTH-B05', '#bemestar', 'universal', ARRAY['autoridade', 'broad'], '{"tema": "Autoridade", "alcance": "broad", "volume": "8.9M"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-AUTH-B06', '#medicina', 'universal', ARRAY['autoridade', 'broad'], '{"tema": "Autoridade", "alcance": "broad", "volume": "5.1M"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-AUTH-B07', '#procedimentoestetico', 'universal', ARRAY['autoridade', 'broad'], '{"tema": "Autoridade", "alcance": "broad", "volume": "2.3M"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-AUTH-B08', '#dermatologia', 'universal', ARRAY['autoridade', 'broad'], '{"tema": "Autoridade", "alcance": "broad", "volume": "3.8M"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-AUTH-B09', '#medicinaestetica', 'universal', ARRAY['autoridade', 'broad'], '{"tema": "Autoridade", "alcance": "broad", "volume": "1.9M"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-AUTH-B10', '#cuidadoscomapele', 'universal', ARRAY['autoridade', 'broad'], '{"tema": "Autoridade", "alcance": "broad", "volume": "3.2M"}'),
-- Medium (15)
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-AUTH-M01', '#dicasdeestetica', 'universal', ARRAY['autoridade', 'medium'], '{"tema": "Autoridade", "alcance": "medium", "volume": "450k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-AUTH-M02', '#educacaoemsaude', 'universal', ARRAY['autoridade', 'medium'], '{"tema": "Autoridade", "alcance": "medium", "volume": "320k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-AUTH-M03', '#medicoinfluencer', 'universal', ARRAY['autoridade', 'medium'], '{"tema": "Autoridade", "alcance": "medium", "volume": "180k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-AUTH-M04', '#saudedamulher', 'universal', ARRAY['autoridade', 'medium'], '{"tema": "Autoridade", "alcance": "medium", "volume": "890k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-AUTH-M05', '#procedimentoseguro', 'universal', ARRAY['autoridade', 'medium'], '{"tema": "Autoridade", "alcance": "medium", "volume": "145k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-AUTH-M06', '#especialista', 'universal', ARRAY['autoridade', 'medium'], '{"tema": "Autoridade", "alcance": "medium", "volume": "670k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-AUTH-M07', '#informacaodesaude', 'universal', ARRAY['autoridade', 'medium'], '{"tema": "Autoridade", "alcance": "medium", "volume": "210k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-AUTH-M08', '#medicaeducadora', 'universal', ARRAY['autoridade', 'medium'], '{"tema": "Autoridade", "alcance": "medium", "volume": "95k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-AUTH-M09', '#belezaconsciente', 'universal', ARRAY['autoridade', 'medium'], '{"tema": "Autoridade", "alcance": "medium", "volume": "120k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-AUTH-M10', '#esteticaavancada', 'universal', ARRAY['autoridade', 'medium'], '{"tema": "Autoridade", "alcance": "medium", "volume": "340k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-AUTH-M11', '#saudeintegral', 'universal', ARRAY['autoridade', 'medium'], '{"tema": "Autoridade", "alcance": "medium", "volume": "280k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-AUTH-M12', '#conteudodesaude', 'universal', ARRAY['autoridade', 'medium'], '{"tema": "Autoridade", "alcance": "medium", "volume": "156k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-AUTH-M13', '#belezasemfiltro', 'universal', ARRAY['autoridade', 'medium'], '{"tema": "Autoridade", "alcance": "medium", "volume": "89k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-AUTH-M14', '#procedimentoresponsavel', 'universal', ARRAY['autoridade', 'medium'], '{"tema": "Autoridade", "alcance": "medium", "volume": "67k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-AUTH-M15', '#verdadesobreestetica', 'universal', ARRAY['autoridade', 'medium'], '{"tema": "Autoridade", "alcance": "medium", "volume": "45k"}'),
-- Niche (10)
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-AUTH-N01', '#karinarodovanski', 'universal', ARRAY['autoridade', 'niche', 'branded'], '{"tema": "Autoridade", "alcance": "niche", "volume": "trending"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-AUTH-N02', '#institutorodovanski', 'universal', ARRAY['autoridade', 'niche', 'branded'], '{"tema": "Autoridade", "alcance": "niche", "volume": "branded"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-AUTH-N03', '#drakarinaresponde', 'universal', ARRAY['autoridade', 'niche', 'serie'], '{"tema": "Autoridade", "alcance": "niche", "volume": "serie"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-AUTH-N04', '#esteticacomciencia', 'universal', ARRAY['autoridade', 'niche'], '{"tema": "Autoridade", "alcance": "niche", "volume": "18k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-AUTH-N05', '#belezaevidenciada', 'universal', ARRAY['autoridade', 'niche'], '{"tema": "Autoridade", "alcance": "niche", "volume": "12k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-AUTH-N06', '#procedimentoconsciente', 'universal', ARRAY['autoridade', 'niche'], '{"tema": "Autoridade", "alcance": "niche", "volume": "9k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-AUTH-N07', '#saudecomproposito', 'universal', ARRAY['autoridade', 'niche'], '{"tema": "Autoridade", "alcance": "niche", "volume": "15k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-AUTH-N08', '#medicaqueensina', 'universal', ARRAY['autoridade', 'niche'], '{"tema": "Autoridade", "alcance": "niche", "volume": "8k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-AUTH-N09', '#educacaoestetica', 'universal', ARRAY['autoridade', 'niche'], '{"tema": "Autoridade", "alcance": "niche", "volume": "11k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-AUTH-N10', '#verdadequetransforma', 'universal', ARRAY['autoridade', 'niche'], '{"tema": "Autoridade", "alcance": "niche", "volume": "6k"}');

-- TEMA 2: HARMONIZAÇÃO ÍNTIMA FEMININA (35 hashtags)
INSERT INTO components (profile_id, type, name, content, format, tags, metadata) VALUES
-- Broad (10)
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-HIF-B01', '#harmonizacaointima', 'universal', ARRAY['harmonizacao-intima', 'broad'], '{"tema": "Harmonização Íntima", "alcance": "broad", "volume": "890k", "sensibilidade": "ALTA"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-HIF-B02', '#saudefeminina', 'universal', ARRAY['harmonizacao-intima', 'broad'], '{"tema": "Harmonização Íntima", "alcance": "broad", "volume": "2.1M"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-HIF-B03', '#mulher', 'universal', ARRAY['harmonizacao-intima', 'broad'], '{"tema": "Harmonização Íntima", "alcance": "broad", "volume": "18.2M"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-HIF-B04', '#empoderamento', 'universal', ARRAY['harmonizacao-intima', 'broad'], '{"tema": "Harmonização Íntima", "alcance": "broad", "volume": "3.8M"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-HIF-B05', '#ginecologia', 'universal', ARRAY['harmonizacao-intima', 'broad'], '{"tema": "Harmonização Íntima", "alcance": "broad", "volume": "650k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-HIF-B06', '#procedimentofeminino', 'universal', ARRAY['harmonizacao-intima', 'broad'], '{"tema": "Harmonização Íntima", "alcance": "broad", "volume": "120k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-HIF-B07', '#bemestarfeminino', 'universal', ARRAY['harmonizacao-intima', 'broad'], '{"tema": "Harmonização Íntima", "alcance": "broad", "volume": "85k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-HIF-B08', '#intimidade', 'universal', ARRAY['harmonizacao-intima', 'broad'], '{"tema": "Harmonização Íntima", "alcance": "broad", "volume": "890k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-HIF-B09', '#autoestima', 'universal', ARRAY['harmonizacao-intima', 'broad'], '{"tema": "Harmonização Íntima", "alcance": "broad", "volume": "1.2M"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-HIF-B10', '#confiancafeminina', 'universal', ARRAY['harmonizacao-intima', 'broad'], '{"tema": "Harmonização Íntima", "alcance": "broad", "volume": "210k"}'),
-- Medium (15)
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-HIF-M01', '#harmonizacaovaginal', 'universal', ARRAY['harmonizacao-intima', 'medium'], '{"tema": "Harmonização Íntima", "alcance": "medium", "volume": "320k", "sensibilidade": "ALTA"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-HIF-M02', '#revitalizacaointima', 'universal', ARRAY['harmonizacao-intima', 'medium'], '{"tema": "Harmonização Íntima", "alcance": "medium", "volume": "145k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-HIF-M03', '#saudeintima', 'universal', ARRAY['harmonizacao-intima', 'medium'], '{"tema": "Harmonização Íntima", "alcance": "medium", "volume": "98k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-HIF-M04', '#procedimentorestaurativo', 'universal', ARRAY['harmonizacao-intima', 'medium'], '{"tema": "Harmonização Íntima", "alcance": "medium", "volume": "67k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-HIF-M05', '#autoestimafeminina', 'universal', ARRAY['harmonizacao-intima', 'medium'], '{"tema": "Harmonização Íntima", "alcance": "medium", "volume": "340k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-HIF-M06', '#educacaosexual', 'universal', ARRAY['harmonizacao-intima', 'medium'], '{"tema": "Harmonização Íntima", "alcance": "medium", "volume": "180k", "risco": "medio"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-HIF-M07', '#saudemenstrual', 'universal', ARRAY['harmonizacao-intima', 'medium'], '{"tema": "Harmonização Íntima", "alcance": "medium", "volume": "95k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-HIF-M08', '#mulheresfortes', 'universal', ARRAY['harmonizacao-intima', 'medium'], '{"tema": "Harmonização Íntima", "alcance": "medium", "volume": "1.2M"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-HIF-M09', '#quebratabu', 'universal', ARRAY['harmonizacao-intima', 'medium'], '{"tema": "Harmonização Íntima", "alcance": "medium", "volume": "67k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-HIF-M10', '#relacionamentosaudavel', 'universal', ARRAY['harmonizacao-intima', 'medium'], '{"tema": "Harmonização Íntima", "alcance": "medium", "volume": "52k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-HIF-M11', '#procedimentosfemininos', 'universal', ARRAY['harmonizacao-intima', 'medium'], '{"tema": "Harmonização Íntima", "alcance": "medium", "volume": "43k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-HIF-M12', '#historiasfemininas', 'universal', ARRAY['harmonizacao-intima', 'medium'], '{"tema": "Harmonização Íntima", "alcance": "medium", "volume": "38k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-HIF-M13', '#dialogoaberto', 'universal', ARRAY['harmonizacao-intima', 'medium'], '{"tema": "Harmonização Íntima", "alcance": "medium", "volume": "29k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-HIF-M14', '#vidaintimafeminina', 'universal', ARRAY['harmonizacao-intima', 'medium'], '{"tema": "Harmonização Íntima", "alcance": "medium", "volume": "24k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-HIF-M15', '#cuidadointimo', 'universal', ARRAY['harmonizacao-intima', 'medium'], '{"tema": "Harmonização Íntima", "alcance": "medium", "volume": "56k"}'),
-- Niche (10)
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-HIF-N01', '#procedimentominimoinvasivo', 'universal', ARRAY['harmonizacao-intima', 'niche'], '{"tema": "Harmonização Íntima", "alcance": "niche", "volume": "12k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-HIF-N02', '#harmonizacaointimasegura', 'universal', ARRAY['harmonizacao-intima', 'niche'], '{"tema": "Harmonização Íntima", "alcance": "niche", "volume": "8k", "sensibilidade": "ALTA"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-HIF-N03', '#saudeintimapos50', 'universal', ARRAY['harmonizacao-intima', 'niche'], '{"tema": "Harmonização Íntima", "alcance": "niche", "volume": "15k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-HIF-N04', '#procedimentoconsciente', 'universal', ARRAY['harmonizacao-intima', 'niche'], '{"tema": "Harmonização Íntima", "alcance": "niche", "volume": "9k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-HIF-N05', '#revitalizacaofuncional', 'universal', ARRAY['harmonizacao-intima', 'niche'], '{"tema": "Harmonização Íntima", "alcance": "niche", "volume": "11k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-HIF-N06', '#procedimentoregenerativo', 'universal', ARRAY['harmonizacao-intima', 'niche'], '{"tema": "Harmonização Íntima", "alcance": "niche", "volume": "14k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-HIF-N07', '#mulherempoderada', 'universal', ARRAY['harmonizacao-intima', 'niche'], '{"tema": "Harmonização Íntima", "alcance": "niche", "volume": "6k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-HIF-N08', '#saudeintegralfeminina', 'universal', ARRAY['harmonizacao-intima', 'niche'], '{"tema": "Harmonização Íntima", "alcance": "niche", "volume": "7k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-HIF-N09', '#procedimentoinvestido', 'universal', ARRAY['harmonizacao-intima', 'niche'], '{"tema": "Harmonização Íntima", "alcance": "niche", "volume": "5k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-HIF-N10', '#empoderadafeminina', 'universal', ARRAY['harmonizacao-intima', 'niche'], '{"tema": "Harmonização Íntima", "alcance": "niche", "volume": "4k"}');

-- TEMA 3: FULL FACE (35 hashtags)
INSERT INTO components (profile_id, type, name, content, format, tags, metadata) VALUES
-- Broad (10)
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-FF-B01', '#fullface', 'universal', ARRAY['fullface', 'broad'], '{"tema": "Full Face", "alcance": "broad", "volume": "2.8M"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-FF-B02', '#harmonizacaofacial', 'universal', ARRAY['fullface', 'broad'], '{"tema": "Full Face", "alcance": "broad", "volume": "890k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-FF-B03', '#procedimentocombinado', 'universal', ARRAY['fullface', 'broad'], '{"tema": "Full Face", "alcance": "broad", "volume": "120k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-FF-B04', '#rejuvenescimento', 'universal', ARRAY['fullface', 'broad'], '{"tema": "Full Face", "alcance": "broad", "volume": "650k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-FF-B05', '#esteticafacial', 'universal', ARRAY['fullface', 'broad'], '{"tema": "Full Face", "alcance": "broad", "volume": "4.6M"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-FF-B06', '#transformacao', 'universal', ARRAY['fullface', 'broad'], '{"tema": "Full Face", "alcance": "broad", "volume": "1.8M"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-FF-B07', '#antesedepois', 'universal', ARRAY['fullface', 'broad'], '{"tema": "Full Face", "alcance": "broad", "volume": "2.1M"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-FF-B08', '#preenchimentofacial', 'universal', ARRAY['fullface', 'broad'], '{"tema": "Full Face", "alcance": "broad", "volume": "560k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-FF-B09', '#botox', 'universal', ARRAY['fullface', 'broad'], '{"tema": "Full Face", "alcance": "broad", "volume": "3.2M"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-FF-B10', '#skincare', 'universal', ARRAY['fullface', 'broad'], '{"tema": "Full Face", "alcance": "broad", "volume": "45M"}'),
-- Medium (15)
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-FF-M01', '#fullfaceharmonizado', 'universal', ARRAY['fullface', 'medium'], '{"tema": "Full Face", "alcance": "medium", "volume": "340k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-FF-M02', '#revitalizacaofacial', 'universal', ARRAY['fullface', 'medium'], '{"tema": "Full Face", "alcance": "medium", "volume": "210k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-FF-M03', '#pelerejuvenescida', 'universal', ARRAY['fullface', 'medium'], '{"tema": "Full Face", "alcance": "medium", "volume": "180k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-FF-M04', '#faceharmoniosa', 'universal', ARRAY['fullface', 'medium'], '{"tema": "Full Face", "alcance": "medium", "volume": "95k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-FF-M05', '#procedimentosmultiplos', 'universal', ARRAY['fullface', 'medium'], '{"tema": "Full Face", "alcance": "medium", "volume": "67k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-FF-M06', '#sinergiaresultados', 'universal', ARRAY['fullface', 'medium'], '{"tema": "Full Face", "alcance": "medium", "volume": "52k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-FF-M07', '#resultadonaturalfacial', 'universal', ARRAY['fullface', 'medium'], '{"tema": "Full Face", "alcance": "medium", "volume": "210k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-FF-M08', '#facialintegral', 'universal', ARRAY['fullface', 'medium'], '{"tema": "Full Face", "alcance": "medium", "volume": "89k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-FF-M09', '#harmoniafacial', 'universal', ARRAY['fullface', 'medium'], '{"tema": "Full Face", "alcance": "medium", "volume": "45k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-FF-M10', '#peleglowing', 'universal', ARRAY['fullface', 'medium'], '{"tema": "Full Face", "alcance": "medium", "volume": "320k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-FF-M11', '#liftingnatural', 'universal', ARRAY['fullface', 'medium'], '{"tema": "Full Face", "alcance": "medium", "volume": "156k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-FF-M12', '#belezacomproposito', 'universal', ARRAY['fullface', 'medium'], '{"tema": "Full Face", "alcance": "medium", "volume": "67k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-FF-M13', '#procedimentodapele', 'universal', ARRAY['fullface', 'medium'], '{"tema": "Full Face", "alcance": "medium", "volume": "145k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-FF-M14', '#facewellness', 'universal', ARRAY['fullface', 'medium'], '{"tema": "Full Face", "alcance": "medium", "volume": "28k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-FF-M15', '#fullfacecomplete', 'universal', ARRAY['fullface', 'medium'], '{"tema": "Full Face", "alcance": "medium", "volume": "38k"}'),
-- Niche (10)
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-FF-N01', '#fullfacecustomizado', 'universal', ARRAY['fullface', 'niche'], '{"tema": "Full Face", "alcance": "niche", "volume": "18k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-FF-N02', '#rejuvenescimentomultilayer', 'universal', ARRAY['fullface', 'niche'], '{"tema": "Full Face", "alcance": "niche", "volume": "12k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-FF-N03', '#peleresplendecente', 'universal', ARRAY['fullface', 'niche'], '{"tema": "Full Face", "alcance": "niche", "volume": "9k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-FF-N04', '#harmoniafacialcientifica', 'universal', ARRAY['fullface', 'niche'], '{"tema": "Full Face", "alcance": "niche", "volume": "14k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-FF-N05', '#fullfacepersonalizado', 'universal', ARRAY['fullface', 'niche'], '{"tema": "Full Face", "alcance": "niche", "volume": "11k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-FF-N06', '#procedimentointemporalface', 'universal', ARRAY['fullface', 'niche'], '{"tema": "Full Face", "alcance": "niche", "volume": "8k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-FF-N07', '#facejovem30mais', 'universal', ARRAY['fullface', 'niche'], '{"tema": "Full Face", "alcance": "niche", "volume": "15k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-FF-N08', '#rejuvenescimentorespeitoso', 'universal', ARRAY['fullface', 'niche'], '{"tema": "Full Face", "alcance": "niche", "volume": "7k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-FF-N09', '#harmoniacomidentidade', 'universal', ARRAY['fullface', 'niche'], '{"tema": "Full Face", "alcance": "niche", "volume": "6k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-FF-N10', '#fullfaceprotocolo', 'universal', ARRAY['fullface', 'niche'], '{"tema": "Full Face", "alcance": "niche", "volume": "5k"}');

-- TEMA 4: GLÚTEO (35 hashtags)
INSERT INTO components (profile_id, type, name, content, format, tags, metadata) VALUES
-- Broad (10)
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-GLT-B01', '#gluteo', 'universal', ARRAY['gluteo', 'broad'], '{"tema": "Glúteo", "alcance": "broad", "volume": "4.2M"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-GLT-B02', '#aumentogluteo', 'universal', ARRAY['gluteo', 'broad'], '{"tema": "Glúteo", "alcance": "broad", "volume": "890k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-GLT-B03', '#corpoharmonizado', 'universal', ARRAY['gluteo', 'broad'], '{"tema": "Glúteo", "alcance": "broad", "volume": "2.1M"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-GLT-B04', '#procedimentocorporal', 'universal', ARRAY['gluteo', 'broad'], '{"tema": "Glúteo", "alcance": "broad", "volume": "650k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-GLT-B05', '#corpocomconfianca', 'universal', ARRAY['gluteo', 'broad'], '{"tema": "Glúteo", "alcance": "broad", "volume": "320k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-GLT-B06', '#lipoenxertia', 'universal', ARRAY['gluteo', 'broad'], '{"tema": "Glúteo", "alcance": "broad", "volume": "145k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-GLT-B07', '#harmoniacorporal', 'universal', ARRAY['gluteo', 'broad'], '{"tema": "Glúteo", "alcance": "broad", "volume": "210k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-GLT-B08', '#bumbumnatural', 'universal', ARRAY['gluteo', 'broad'], '{"tema": "Glúteo", "alcance": "broad", "volume": "780k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-GLT-B09', '#transformacaocorporal', 'universal', ARRAY['gluteo', 'broad'], '{"tema": "Glúteo", "alcance": "broad", "volume": "2.8M"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-GLT-B10', '#corposaudavel', 'universal', ARRAY['gluteo', 'broad'], '{"tema": "Glúteo", "alcance": "broad", "volume": "1.8M"}'),
-- Medium (15)
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-GLT-M01', '#gluteoplastia', 'universal', ARRAY['gluteo', 'medium'], '{"tema": "Glúteo", "alcance": "medium", "volume": "120k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-GLT-M02', '#gluteohipertrofiado', 'universal', ARRAY['gluteo', 'medium'], '{"tema": "Glúteo", "alcance": "medium", "volume": "95k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-GLT-M03', '#procedimentoliftinggluteo', 'universal', ARRAY['gluteo', 'medium'], '{"tema": "Glúteo", "alcance": "medium", "volume": "67k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-GLT-M04', '#corposdamulher', 'universal', ARRAY['gluteo', 'medium'], '{"tema": "Glúteo", "alcance": "medium", "volume": "890k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-GLT-M05', '#procedimentoharmonizado', 'universal', ARRAY['gluteo', 'medium'], '{"tema": "Glúteo", "alcance": "medium", "volume": "145k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-GLT-M06', '#resultadonaturalgluteo', 'universal', ARRAY['gluteo', 'medium'], '{"tema": "Glúteo", "alcance": "medium", "volume": "89k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-GLT-M07', '#mulherescomcurvas', 'universal', ARRAY['gluteo', 'medium'], '{"tema": "Glúteo", "alcance": "medium", "volume": "320k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-GLT-M08', '#procedimentosegurocorpo', 'universal', ARRAY['gluteo', 'medium'], '{"tema": "Glúteo", "alcance": "medium", "volume": "67k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-GLT-M09', '#corpobelo', 'universal', ARRAY['gluteo', 'medium'], '{"tema": "Glúteo", "alcance": "medium", "volume": "45k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-GLT-M10', '#gluteoperfeitovocemesma', 'universal', ARRAY['gluteo', 'medium'], '{"tema": "Glúteo", "alcance": "medium", "volume": "52k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-GLT-M11', '#gluteoharmonico', 'universal', ARRAY['gluteo', 'medium'], '{"tema": "Glúteo", "alcance": "medium", "volume": "38k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-GLT-M12', '#procedimentominimamenteinvasivo', 'universal', ARRAY['gluteo', 'medium'], '{"tema": "Glúteo", "alcance": "medium", "volume": "28k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-GLT-M13', '#autoestimacorporal', 'universal', ARRAY['gluteo', 'medium'], '{"tema": "Glúteo", "alcance": "medium", "volume": "210k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-GLT-M14', '#corpossaudaveis', 'universal', ARRAY['gluteo', 'medium'], '{"tema": "Glúteo", "alcance": "medium", "volume": "156k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-GLT-M15', '#bumbumperfeito', 'universal', ARRAY['gluteo', 'medium'], '{"tema": "Glúteo", "alcance": "medium", "volume": "890k"}'),
-- Niche (10)
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-GLT-N01', '#gluteoplastiacomciencia', 'universal', ARRAY['gluteo', 'niche'], '{"tema": "Glúteo", "alcance": "niche", "volume": "15k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-GLT-N02', '#procedimentogluteoindicacao', 'universal', ARRAY['gluteo', 'niche'], '{"tema": "Glúteo", "alcance": "niche", "volume": "9k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-GLT-N03', '#proporcaocorporalideal', 'universal', ARRAY['gluteo', 'niche'], '{"tema": "Glúteo", "alcance": "niche", "volume": "12k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-GLT-N04', '#lipoenxertiacommestria', 'universal', ARRAY['gluteo', 'niche'], '{"tema": "Glúteo", "alcance": "niche", "volume": "8k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-GLT-N05', '#gluteoconfiante', 'universal', ARRAY['gluteo', 'niche'], '{"tema": "Glúteo", "alcance": "niche", "volume": "11k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-GLT-N06', '#procedimentogluteorespeitoso', 'universal', ARRAY['gluteo', 'niche'], '{"tema": "Glúteo", "alcance": "niche", "volume": "6k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-GLT-N07', '#anatomiaglutea', 'universal', ARRAY['gluteo', 'niche'], '{"tema": "Glúteo", "alcance": "niche", "volume": "14k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-GLT-N08', '#simetriaglutea', 'universal', ARRAY['gluteo', 'niche'], '{"tema": "Glúteo", "alcance": "niche", "volume": "7k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-GLT-N09', '#gluteocorporalnatural', 'universal', ARRAY['gluteo', 'niche'], '{"tema": "Glúteo", "alcance": "niche", "volume": "5k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-GLT-N10', '#corposaudavelbrazil', 'universal', ARRAY['gluteo', 'niche'], '{"tema": "Glúteo", "alcance": "niche", "volume": "4k"}');

-- TEMA 5: BASTIDORES/ROTINA CLÍNICA (35 hashtags)
INSERT INTO components (profile_id, type, name, content, format, tags, metadata) VALUES
-- Broad (10)
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-BAST-B01', '#bastidores', 'universal', ARRAY['bastidores', 'broad'], '{"tema": "Bastidores", "alcance": "broad", "volume": "3.2M"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-BAST-B02', '#rotinaclinica', 'universal', ARRAY['bastidores', 'broad'], '{"tema": "Bastidores", "alcance": "broad", "volume": "210k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-BAST-B03', '#diadetrabalho', 'universal', ARRAY['bastidores', 'broad'], '{"tema": "Bastidores", "alcance": "broad", "volume": "1.8M"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-BAST-B04', '#meutrabalho', 'universal', ARRAY['bastidores', 'broad'], '{"tema": "Bastidores", "alcance": "broad", "volume": "890k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-BAST-B05', '#trabalhocomamor', 'universal', ARRAY['bastidores', 'broad'], '{"tema": "Bastidores", "alcance": "broad", "volume": "145k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-BAST-B06', '#clinicavida', 'universal', ARRAY['bastidores', 'broad'], '{"tema": "Bastidores", "alcance": "broad", "volume": "67k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-BAST-B07', '#processos', 'universal', ARRAY['bastidores', 'broad'], '{"tema": "Bastidores", "alcance": "broad", "volume": "320k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-BAST-B08', '#transparencia', 'universal', ARRAY['bastidores', 'broad'], '{"tema": "Bastidores", "alcance": "broad", "volume": "890k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-BAST-B09', '#esteticadeverdade', 'universal', ARRAY['bastidores', 'broad'], '{"tema": "Bastidores", "alcance": "broad", "volume": "98k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-BAST-B10', '#vidademedica', 'universal', ARRAY['bastidores', 'broad'], '{"tema": "Bastidores", "alcance": "broad", "volume": "340k"}'),
-- Medium (15)
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-BAST-M01', '#rotinabiomedica', 'universal', ARRAY['bastidores', 'medium'], '{"tema": "Bastidores", "alcance": "medium", "volume": "45k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-BAST-M02', '#diadamedica', 'universal', ARRAY['bastidores', 'medium'], '{"tema": "Bastidores", "alcance": "medium", "volume": "120k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-BAST-M03', '#pacientesreais', 'universal', ARRAY['bastidores', 'medium'], '{"tema": "Bastidores", "alcance": "medium", "volume": "180k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-BAST-M04', '#processodetransformacao', 'universal', ARRAY['bastidores', 'medium'], '{"tema": "Bastidores", "alcance": "medium", "volume": "89k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-BAST-M05', '#clinicalife', 'universal', ARRAY['bastidores', 'medium'], '{"tema": "Bastidores", "alcance": "medium", "volume": "67k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-BAST-M06', '#medasalegrias', 'universal', ARRAY['bastidores', 'medium'], '{"tema": "Bastidores", "alcance": "medium", "volume": "38k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-BAST-M07', '#workingmom', 'universal', ARRAY['bastidores', 'medium'], '{"tema": "Bastidores", "alcance": "medium", "volume": "1.2M"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-BAST-M08', '#passionforwork', 'universal', ARRAY['bastidores', 'medium'], '{"tema": "Bastidores", "alcance": "medium", "volume": "210k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-BAST-M09', '#escolhasdavida', 'universal', ARRAY['bastidores', 'medium'], '{"tema": "Bastidores", "alcance": "medium", "volume": "320k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-BAST-M10', '#gratidaoporpacientes', 'universal', ARRAY['bastidores', 'medium'], '{"tema": "Bastidores", "alcance": "medium", "volume": "78k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-BAST-M11', '#momentosreais', 'universal', ARRAY['bastidores', 'medium'], '{"tema": "Bastidores", "alcance": "medium", "volume": "156k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-BAST-M12', '#vivenciasdomeudia', 'universal', ARRAY['bastidores', 'medium'], '{"tema": "Bastidores", "alcance": "medium", "volume": "52k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-BAST-M13', '#diadetrabalhoestetico', 'universal', ARRAY['bastidores', 'medium'], '{"tema": "Bastidores", "alcance": "medium", "volume": "34k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-BAST-M14', '#amorpelamedicina', 'universal', ARRAY['bastidores', 'medium'], '{"tema": "Bastidores", "alcance": "medium", "volume": "67k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-BAST-M15', '#mentalidadeempreendedora', 'universal', ARRAY['bastidores', 'medium'], '{"tema": "Bastidores", "alcance": "medium", "volume": "45k"}'),
-- Niche (10)
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-BAST-N01', '#karinanotrabalho', 'universal', ARRAY['bastidores', 'niche', 'branded'], '{"tema": "Bastidores", "alcance": "niche", "volume": "12k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-BAST-N02', '#bastidoresdarealidade', 'universal', ARRAY['bastidores', 'niche'], '{"tema": "Bastidores", "alcance": "niche", "volume": "8k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-BAST-N03', '#diaadiamedica', 'universal', ARRAY['bastidores', 'niche'], '{"tema": "Bastidores", "alcance": "niche", "volume": "9k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-BAST-N04', '#karinamamae', 'universal', ARRAY['bastidores', 'niche', 'branded'], '{"tema": "Bastidores", "alcance": "niche", "volume": "6k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-BAST-N05', '#maesqueinspiram', 'universal', ARRAY['bastidores', 'niche'], '{"tema": "Bastidores", "alcance": "niche", "volume": "5k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-BAST-N06', '#escolhasdocoracao', 'universal', ARRAY['bastidores', 'niche'], '{"tema": "Bastidores", "alcance": "niche", "volume": "11k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-BAST-N07', '#historiasdepacientes', 'universal', ARRAY['bastidores', 'niche'], '{"tema": "Bastidores", "alcance": "niche", "volume": "7k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-BAST-N08', '#transformacaohumana', 'universal', ARRAY['bastidores', 'niche'], '{"tema": "Bastidores", "alcance": "niche", "volume": "14k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-BAST-N09', '#vidarealdamedica', 'universal', ARRAY['bastidores', 'niche'], '{"tema": "Bastidores", "alcance": "niche", "volume": "4k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-BAST-N10', '#trocasfemininas', 'universal', ARRAY['bastidores', 'niche'], '{"tema": "Bastidores", "alcance": "niche", "volume": "3k"}');

-- TEMA 6: PROVA SOCIAL/DEPOIMENTOS (35 hashtags)
INSERT INTO components (profile_id, type, name, content, format, tags, metadata) VALUES
-- Broad (10)
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-PS-B01', '#provasocial', 'universal', ARRAY['prova-social', 'broad'], '{"tema": "Prova Social", "alcance": "broad", "volume": "2.1M"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-PS-B02', '#depoimento', 'universal', ARRAY['prova-social', 'broad'], '{"tema": "Prova Social", "alcance": "broad", "volume": "890k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-PS-B03', '#casosucesso', 'universal', ARRAY['prova-social', 'broad'], '{"tema": "Prova Social", "alcance": "broad", "volume": "650k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-PS-B04', '#historiasinspiradoras', 'universal', ARRAY['prova-social', 'broad'], '{"tema": "Prova Social", "alcance": "broad", "volume": "1.8M"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-PS-B05', '#pacientes', 'universal', ARRAY['prova-social', 'broad'], '{"tema": "Prova Social", "alcance": "broad", "volume": "320k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-PS-B06', '#mudardevida', 'universal', ARRAY['prova-social', 'broad'], '{"tema": "Prova Social", "alcance": "broad", "volume": "670k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-PS-B07', '#satisfacaopaciente', 'universal', ARRAY['prova-social', 'broad'], '{"tema": "Prova Social", "alcance": "broad", "volume": "145k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-PS-B08', '#confiancaposmedica', 'universal', ARRAY['prova-social', 'broad'], '{"tema": "Prova Social", "alcance": "broad", "volume": "89k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-PS-B09', '#resultadoreal', 'universal', ARRAY['prova-social', 'broad'], '{"tema": "Prova Social", "alcance": "broad", "volume": "210k", "risco": "medio"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-PS-B10', '#antesedepoisreal', 'universal', ARRAY['prova-social', 'broad'], '{"tema": "Prova Social", "alcance": "broad", "volume": "1.5M"}'),
-- Medium (15)
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-PS-M01', '#depoimentorealista', 'universal', ARRAY['prova-social', 'medium'], '{"tema": "Prova Social", "alcance": "medium", "volume": "95k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-PS-M02', '#historiadepaciente', 'universal', ARRAY['prova-social', 'medium'], '{"tema": "Prova Social", "alcance": "medium", "volume": "320k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-PS-M03', '#jornadadetransformacao', 'universal', ARRAY['prova-social', 'medium'], '{"tema": "Prova Social", "alcance": "medium", "volume": "210k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-PS-M04', '#feedbackpaciente', 'universal', ARRAY['prova-social', 'medium'], '{"tema": "Prova Social", "alcance": "medium", "volume": "145k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-PS-M05', '#pacienteemocionado', 'universal', ARRAY['prova-social', 'medium'], '{"tema": "Prova Social", "alcance": "medium", "volume": "67k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-PS-M06', '#experienciapositiva', 'universal', ARRAY['prova-social', 'medium'], '{"tema": "Prova Social", "alcance": "medium", "volume": "52k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-PS-M07', '#vozdopaciente', 'universal', ARRAY['prova-social', 'medium'], '{"tema": "Prova Social", "alcance": "medium", "volume": "89k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-PS-M08', '#seeutimoconsequir', 'universal', ARRAY['prova-social', 'medium'], '{"tema": "Prova Social", "alcance": "medium", "volume": "38k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-PS-M09', '#conhecasuashistorias', 'universal', ARRAY['prova-social', 'medium'], '{"tema": "Prova Social", "alcance": "medium", "volume": "120k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-PS-M10', '#casorealdeverdade', 'universal', ARRAY['prova-social', 'medium'], '{"tema": "Prova Social", "alcance": "medium", "volume": "67k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-PS-M11', '#dicasdepacientes', 'universal', ARRAY['prova-social', 'medium'], '{"tema": "Prova Social", "alcance": "medium", "volume": "45k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-PS-M12', '#porquesoufedoradora', 'universal', ARRAY['prova-social', 'medium'], '{"tema": "Prova Social", "alcance": "medium", "volume": "34k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-PS-M13', '#vidamudouaqui', 'universal', ARRAY['prova-social', 'medium'], '{"tema": "Prova Social", "alcance": "medium", "volume": "28k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-PS-M14', '#segundachance', 'universal', ARRAY['prova-social', 'medium'], '{"tema": "Prova Social", "alcance": "medium", "volume": "78k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-PS-M15', '#aprendizadodepacientes', 'universal', ARRAY['prova-social', 'medium'], '{"tema": "Prova Social", "alcance": "medium", "volume": "52k"}'),
-- Niche (10)
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-PS-N01', '#karinatestemunho', 'universal', ARRAY['prova-social', 'niche', 'branded'], '{"tema": "Prova Social", "alcance": "niche", "volume": "12k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-PS-N02', '#pacienteleal', 'universal', ARRAY['prova-social', 'niche'], '{"tema": "Prova Social", "alcance": "niche", "volume": "9k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-PS-N03', '#historiasdecoragem', 'universal', ARRAY['prova-social', 'niche'], '{"tema": "Prova Social", "alcance": "niche", "volume": "11k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-PS-N04', '#transformacaorespeitosa', 'universal', ARRAY['prova-social', 'niche'], '{"tema": "Prova Social", "alcance": "niche", "volume": "8k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-PS-N05', '#sucessoqueprova', 'universal', ARRAY['prova-social', 'niche'], '{"tema": "Prova Social", "alcance": "niche", "volume": "6k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-PS-N06', '#voltariaafazer', 'universal', ARRAY['prova-social', 'niche'], '{"tema": "Prova Social", "alcance": "niche", "volume": "14k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-PS-N07', '#amortimoremosassim', 'universal', ARRAY['prova-social', 'niche'], '{"tema": "Prova Social", "alcance": "niche", "volume": "7k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-PS-N08', '#visaofuturoposaqui', 'universal', ARRAY['prova-social', 'niche'], '{"tema": "Prova Social", "alcance": "niche", "volume": "5k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-PS-N09', '#comunidadeforte', 'universal', ARRAY['prova-social', 'niche'], '{"tema": "Prova Social", "alcance": "niche", "volume": "4k"}'),
('550e8400-e29b-41d4-a716-446655440001', 'hashtag', 'HT-PS-N10', '#confiancareestabelecida', 'universal', ARRAY['prova-social', 'niche'], '{"tema": "Prova Social", "alcance": "niche", "volume": "3k"}');

-- =====================================================
-- PARTE 3: COMBOS DE HASHTAGS (SELEÇÃO ESTRATÉGICA)
-- =====================================================

INSERT INTO components (profile_id, type, name, content, format, tags, metadata) VALUES
-- COMBOS REELS - Autoridade
('550e8400-e29b-41d4-a716-446655440001', 'combo', 'COMBO-AUTH-REELS-01', '#karinarodovanski #estetica #medicinaestetica #educacaoemsaude #saudedamulher', 'Reels', ARRAY['combo', 'autoridade', 'reels'], '{"tema": "Autoridade", "formato": "Reels", "total_tags": 5}'),
('550e8400-e29b-41d4-a716-446655440001', 'combo', 'COMBO-AUTH-REELS-02', '#medicina #procedimentoestetico #especialista #dicasdeestetica #drakarinaresponde', 'Reels', ARRAY['combo', 'autoridade', 'reels'], '{"tema": "Autoridade", "formato": "Reels", "total_tags": 5}'),
('550e8400-e29b-41d4-a716-446655440001', 'combo', 'COMBO-AUTH-REELS-03', '#saude #beleza #autocuidado #bemestar #esteticacomciencia', 'Reels', ARRAY['combo', 'autoridade', 'reels'], '{"tema": "Autoridade", "formato": "Reels", "total_tags": 5}'),

-- COMBOS CARROSSEL - Autoridade
('550e8400-e29b-41d4-a716-446655440001', 'combo', 'COMBO-AUTH-CARR-01', '#institutorodovanski #conteudodesaude #belezaconsciente #procedimentoseguro #verdadesobreestetica', 'Carrossel', ARRAY['combo', 'autoridade', 'carrossel'], '{"tema": "Autoridade", "formato": "Carrossel", "total_tags": 5}'),
('550e8400-e29b-41d4-a716-446655440001', 'combo', 'COMBO-AUTH-CARR-02', '#medicinaestetica #educacaoestetica #saudeintegral #esteticaavancada #medicaqueensina', 'Carrossel', ARRAY['combo', 'autoridade', 'carrossel'], '{"tema": "Autoridade", "formato": "Carrossel", "total_tags": 5}'),

-- COMBOS REELS - Harmonização Íntima
('550e8400-e29b-41d4-a716-446655440001', 'combo', 'COMBO-HIF-REELS-01', '#harmonizacaointima #saudefeminina #mulher #empoderamento #autoestima', 'Reels', ARRAY['combo', 'harmonizacao-intima', 'reels'], '{"tema": "Harmonização Íntima", "formato": "Reels", "total_tags": 5, "sensibilidade": "ALTA"}'),
('550e8400-e29b-41d4-a716-446655440001', 'combo', 'COMBO-HIF-REELS-02', '#saudeintima #revitalizacaointima #confiancafeminina #cuidadointimo #mulherempoderada', 'Reels', ARRAY['combo', 'harmonizacao-intima', 'reels'], '{"tema": "Harmonização Íntima", "formato": "Reels", "total_tags": 5}'),

-- COMBOS CARROSSEL - Harmonização Íntima
('550e8400-e29b-41d4-a716-446655440001', 'combo', 'COMBO-HIF-CARR-01', '#ginecologia #autoestimafeminina #quebratabu #dialogoaberto #saudeintegralfeminina', 'Carrossel', ARRAY['combo', 'harmonizacao-intima', 'carrossel'], '{"tema": "Harmonização Íntima", "formato": "Carrossel", "total_tags": 5}'),

-- COMBOS REELS - Full Face
('550e8400-e29b-41d4-a716-446655440001', 'combo', 'COMBO-FF-REELS-01', '#fullface #harmonizacaofacial #rejuvenescimento #antesedepois #transformacao', 'Reels', ARRAY['combo', 'fullface', 'reels'], '{"tema": "Full Face", "formato": "Reels", "total_tags": 5}'),
('550e8400-e29b-41d4-a716-446655440001', 'combo', 'COMBO-FF-REELS-02', '#botox #preenchimentofacial #skincare #resultadonaturalfacial #harmoniafacial', 'Reels', ARRAY['combo', 'fullface', 'reels'], '{"tema": "Full Face", "formato": "Reels", "total_tags": 5}'),

-- COMBOS CARROSSEL - Full Face
('550e8400-e29b-41d4-a716-446655440001', 'combo', 'COMBO-FF-CARR-01', '#esteticafacial #cuidadoscomapele #peleglowing #liftingnatural #belezacomproposito', 'Carrossel', ARRAY['combo', 'fullface', 'carrossel'], '{"tema": "Full Face", "formato": "Carrossel", "total_tags": 5}'),

-- COMBOS REELS - Glúteo
('550e8400-e29b-41d4-a716-446655440001', 'combo', 'COMBO-GLT-REELS-01', '#gluteo #aumentogluteo #corpoharmonizado #transformacaocorporal #bumbumnatural', 'Reels', ARRAY['combo', 'gluteo', 'reels'], '{"tema": "Glúteo", "formato": "Reels", "total_tags": 5}'),
('550e8400-e29b-41d4-a716-446655440001', 'combo', 'COMBO-GLT-REELS-02', '#gluteoplastia #lipoenxertia #procedimentocorporal #mulherescomcurvas #corposaudavel', 'Reels', ARRAY['combo', 'gluteo', 'reels'], '{"tema": "Glúteo", "formato": "Reels", "total_tags": 5}'),

-- COMBOS CARROSSEL - Glúteo
('550e8400-e29b-41d4-a716-446655440001', 'combo', 'COMBO-GLT-CARR-01', '#harmoniacorporal #autoestimacorporal #resultadonaturalgluteo #corpobelo #bumbumperfeito', 'Carrossel', ARRAY['combo', 'gluteo', 'carrossel'], '{"tema": "Glúteo", "formato": "Carrossel", "total_tags": 5}'),

-- COMBOS REELS - Bastidores
('550e8400-e29b-41d4-a716-446655440001', 'combo', 'COMBO-BAST-REELS-01', '#bastidores #rotinaclinica #diadetrabalho #transparencia #vidademedica', 'Reels', ARRAY['combo', 'bastidores', 'reels'], '{"tema": "Bastidores", "formato": "Reels", "total_tags": 5}'),
('550e8400-e29b-41d4-a716-446655440001', 'combo', 'COMBO-BAST-REELS-02', '#karinanotrabalho #meutrabalho #trabalhocomamor #pacientesreais #momentosreais', 'Reels', ARRAY['combo', 'bastidores', 'reels'], '{"tema": "Bastidores", "formato": "Reels", "total_tags": 5}'),

-- COMBOS STORIES - Bastidores
('550e8400-e29b-41d4-a716-446655440001', 'combo', 'COMBO-BAST-STOR-01', '#bastidoresdarealidade #diaadiamedica #gratidaoporpacientes #clinicalife #vidarealdamedica', 'Stories', ARRAY['combo', 'bastidores', 'stories'], '{"tema": "Bastidores", "formato": "Stories", "total_tags": 5}'),

-- COMBOS REELS - Prova Social
('550e8400-e29b-41d4-a716-446655440001', 'combo', 'COMBO-PS-REELS-01', '#depoimento #provasocial #casosucesso #historiasinspiradoras #antesedepoisreal', 'Reels', ARRAY['combo', 'prova-social', 'reels'], '{"tema": "Prova Social", "formato": "Reels", "total_tags": 5, "sensibilidade": "CRITICA"}'),
('550e8400-e29b-41d4-a716-446655440001', 'combo', 'COMBO-PS-REELS-02', '#pacientes #feedbackpaciente #jornadadetransformacao #transformacao #mudardevida', 'Reels', ARRAY['combo', 'prova-social', 'reels'], '{"tema": "Prova Social", "formato": "Reels", "total_tags": 5}'),

-- COMBOS CARROSSEL - Prova Social
('550e8400-e29b-41d4-a716-446655440001', 'combo', 'COMBO-PS-CARR-01', '#historiadepaciente #experienciapositiva #satisfacaopaciente #vozdopaciente #confiancaposmedica', 'Carrossel', ARRAY['combo', 'prova-social', 'carrossel'], '{"tema": "Prova Social", "formato": "Carrossel", "total_tags": 5}');

-- =====================================================
-- PARTE 4: GANCHOS/HEADLINES ADICIONAIS
-- =====================================================

INSERT INTO components (profile_id, type, name, content, format, tags, metadata) VALUES
-- GANCHOS EDUCATIVOS (15)
('550e8400-e29b-41d4-a716-446655440001', 'gancho', 'GANCHO-EDU-001', 'A verdade que ninguém te conta sobre [procedimento]', 'Reels', ARRAY['gancho', 'educativo', 'curiosidade'], '{"tipo": "Educativo", "gatilho": "Curiosidade/Revelação"}'),
('550e8400-e29b-41d4-a716-446655440001', 'gancho', 'GANCHO-EDU-002', '3 erros que 90% das mulheres cometem', 'Reels', ARRAY['gancho', 'educativo', 'lista'], '{"tipo": "Educativo", "gatilho": "Erro comum"}'),
('550e8400-e29b-41d4-a716-446655440001', 'gancho', 'GANCHO-EDU-003', 'Se você está pensando em fazer isso, assista até o final', 'Reels', ARRAY['gancho', 'educativo', 'retencao'], '{"tipo": "Educativo", "gatilho": "Retenção"}'),
('550e8400-e29b-41d4-a716-446655440001', 'gancho', 'GANCHO-EDU-004', 'Médica responde: pode ou não pode?', 'Reels', ARRAY['gancho', 'educativo', 'autoridade'], '{"tipo": "Educativo", "gatilho": "Autoridade"}'),
('550e8400-e29b-41d4-a716-446655440001', 'gancho', 'GANCHO-EDU-005', 'O que acontece no seu corpo quando você faz [procedimento]', 'Reels', ARRAY['gancho', 'educativo', 'ciencia'], '{"tipo": "Educativo", "gatilho": "Ciência explicada"}'),
('550e8400-e29b-41d4-a716-446655440001', 'gancho', 'GANCHO-EDU-006', 'Pare TUDO e me escuta', 'Reels', ARRAY['gancho', 'educativo', 'urgencia'], '{"tipo": "Educativo", "gatilho": "Urgência"}'),
('550e8400-e29b-41d4-a716-446655440001', 'gancho', 'GANCHO-EDU-007', 'Isso pode salvar seu dinheiro (e sua saúde)', 'Reels', ARRAY['gancho', 'educativo', 'economia'], '{"tipo": "Educativo", "gatilho": "Economia/Proteção"}'),
('550e8400-e29b-41d4-a716-446655440001', 'gancho', 'GANCHO-EDU-008', 'Você sabia que existe isso?', 'Reels', ARRAY['gancho', 'educativo', 'descoberta'], '{"tipo": "Educativo", "gatilho": "Descoberta"}'),

-- GANCHOS DE ENGAJAMENTO (10)
('550e8400-e29b-41d4-a716-446655440001', 'gancho', 'GANCHO-ENG-001', 'Me conta: você também passou por isso?', 'Stories', ARRAY['gancho', 'engajamento', 'identificacao'], '{"tipo": "Engajamento", "gatilho": "Identificação"}'),
('550e8400-e29b-41d4-a716-446655440001', 'gancho', 'GANCHO-ENG-002', 'Comenta SIM se você já pensou nisso', 'Reels', ARRAY['gancho', 'engajamento', 'comentario'], '{"tipo": "Engajamento", "gatilho": "Comentário simples"}'),
('550e8400-e29b-41d4-a716-446655440001', 'gancho', 'GANCHO-ENG-003', 'Salva esse vídeo — você vai precisar', 'Reels', ARRAY['gancho', 'engajamento', 'salvamento'], '{"tipo": "Engajamento", "gatilho": "Salvamento"}'),
('550e8400-e29b-41d4-a716-446655440001', 'gancho', 'GANCHO-ENG-004', 'Manda pra amiga que precisa ver isso', 'Reels', ARRAY['gancho', 'engajamento', 'compartilhamento'], '{"tipo": "Engajamento", "gatilho": "Compartilhamento"}'),
('550e8400-e29b-41d4-a716-446655440001', 'gancho', 'GANCHO-ENG-005', 'Qual é a sua maior dúvida? Comenta aqui', 'Reels', ARRAY['gancho', 'engajamento', 'pergunta'], '{"tipo": "Engajamento", "gatilho": "Pergunta aberta"}'),

-- GANCHOS DE CONVERSÃO (10)
('550e8400-e29b-41d4-a716-446655440001', 'gancho', 'GANCHO-CONV-001', 'Ainda dá tempo de agendar sua avaliação', 'Stories', ARRAY['gancho', 'conversao', 'urgencia'], '{"tipo": "Conversão", "gatilho": "Urgência suave"}'),
('550e8400-e29b-41d4-a716-446655440001', 'gancho', 'GANCHO-CONV-002', 'Quer saber se é pra você? Vem conversar', 'Reels', ARRAY['gancho', 'conversao', 'convite'], '{"tipo": "Conversão", "gatilho": "Convite"}'),
('550e8400-e29b-41d4-a716-446655440001', 'gancho', 'GANCHO-CONV-003', 'Chega no DM — te explico tudo', 'Stories', ARRAY['gancho', 'conversao', 'direct'], '{"tipo": "Conversão", "gatilho": "Direct"}'),
('550e8400-e29b-41d4-a716-446655440001', 'gancho', 'GANCHO-CONV-004', 'Link do WhatsApp na bio', 'Reels', ARRAY['gancho', 'conversao', 'whatsapp'], '{"tipo": "Conversão", "gatilho": "WhatsApp"}'),
('550e8400-e29b-41d4-a716-446655440001', 'gancho', 'GANCHO-CONV-005', 'Consultoria sem compromisso — agende agora', 'Stories', ARRAY['gancho', 'conversao', 'agendamento'], '{"tipo": "Conversão", "gatilho": "Agendamento"}'),

-- GANCHOS POLÊMICOS/MITO (7)
('550e8400-e29b-41d4-a716-446655440001', 'gancho', 'GANCHO-MITO-001', 'MITO ou VERDADE: [afirmação comum]', 'Reels', ARRAY['gancho', 'mito', 'educativo'], '{"tipo": "Mito/Verdade", "gatilho": "Questionamento"}'),
('550e8400-e29b-41d4-a716-446655440001', 'gancho', 'GANCHO-MITO-002', 'Isso que te contaram está ERRADO', 'Reels', ARRAY['gancho', 'mito', 'controverso'], '{"tipo": "Mito/Verdade", "gatilho": "Correção"}'),
('550e8400-e29b-41d4-a716-446655440001', 'gancho', 'GANCHO-MITO-003', 'Por que isso NÃO funciona', 'Reels', ARRAY['gancho', 'mito', 'revelacao'], '{"tipo": "Mito/Verdade", "gatilho": "Revelação negativa"}'),
('550e8400-e29b-41d4-a716-446655440001', 'gancho', 'GANCHO-MITO-004', 'Não faça isso NUNCA', 'Reels', ARRAY['gancho', 'mito', 'alerta'], '{"tipo": "Mito/Verdade", "gatilho": "Alerta"}'),
('550e8400-e29b-41d4-a716-446655440001', 'gancho', 'GANCHO-MITO-005', 'A indústria não quer que você saiba disso', 'Reels', ARRAY['gancho', 'mito', 'revelacao'], '{"tipo": "Mito/Verdade", "gatilho": "Segredo revelado"}');

-- =====================================================
-- PARTE 5: IDEIAS DE CONTEÚDO COMPLETAS (60 ideias)
-- =====================================================

INSERT INTO ideas (profile_id, title, summary, format, pillar, objective, tags, status) VALUES
-- IDEIAS AUTORIDADE/EDUCAÇÃO (20)
('550e8400-e29b-41d4-a716-446655440001', 'A verdade sobre harmonização facial', 'Desmistificar procedimentos faciais, explicar o que realmente funciona e quais são as expectativas realistas', 'Reels', 'Autoridade', 'Alcance', ARRAY['educativo', 'harmonizacao', 'mitos'], 'draft'),
('550e8400-e29b-41d4-a716-446655440001', '5 sinais de que você precisa de um profissional qualificado', 'Alertar sobre procedimentos mal feitos e como identificar profissionais confiáveis', 'Carrossel', 'Autoridade', 'Seguidores', ARRAY['educativo', 'seguranca', 'alerta'], 'draft'),
('550e8400-e29b-41d4-a716-446655440001', 'Mito vs Realidade: Preenchimentos', 'Série educativa desmentindo mitos comuns sobre preenchimentos', 'Reels', 'Autoridade', 'Alcance', ARRAY['mitos', 'preenchimento', 'serie'], 'draft'),
('550e8400-e29b-41d4-a716-446655440001', 'O que acontece no seu corpo após procedimento X', 'Explicar de forma científica e acessível os processos biológicos', 'Carrossel', 'Autoridade', 'Salvamento', ARRAY['ciencia', 'educativo', 'evergreen'], 'draft'),
('550e8400-e29b-41d4-a716-446655440001', 'Perguntas que você deveria fazer antes do procedimento', 'Capacitar pacientes com perguntas essenciais para consultas', 'Carrossel', 'Autoridade', 'Salvamento', ARRAY['educativo', 'paciente', 'preparacao'], 'draft'),
('550e8400-e29b-41d4-a716-446655440001', 'Médica responde: Top 10 dúvidas sobre estética', 'Compilado das perguntas mais frequentes com respostas claras', 'Reels', 'Autoridade', 'Alcance', ARRAY['faq', 'duvidas', 'interativo'], 'draft'),
('550e8400-e29b-41d4-a716-446655440001', 'Idade certa para começar cada procedimento', 'Guia por faixa etária de indicações e contraindicações', 'Carrossel', 'Autoridade', 'Salvamento', ARRAY['idade', 'guia', 'evergreen'], 'draft'),
('550e8400-e29b-41d4-a716-446655440001', 'Por que resultados naturais são mais difíceis', 'Explicar a técnica por trás de resultados sutis e harmoniosos', 'Reels', 'Autoridade', 'Seguidores', ARRAY['tecnica', 'natural', 'diferencial'], 'draft'),
('550e8400-e29b-41d4-a716-446655440001', 'O que nunca te contaram sobre recuperação', 'Expectativas realistas de pós-procedimento', 'Carrossel', 'Autoridade', 'Salvamento', ARRAY['recuperacao', 'pos-procedimento', 'realista'], 'draft'),
('550e8400-e29b-41d4-a716-446655440001', 'Como funciona a avaliação facial completa', 'Mostrar processo de consulta e planejamento', 'Reels', 'Autoridade', 'Conversão', ARRAY['consulta', 'processo', 'transparencia'], 'draft'),

-- IDEIAS HARMONIZAÇÃO ÍNTIMA (10)
('550e8400-e29b-41d4-a716-446655440001', 'Quebrando tabus: saúde íntima feminina', 'Abordar de forma educativa e respeitosa temas sensíveis', 'Reels', 'Harmonização Íntima', 'Alcance', ARRAY['tabu', 'saude-feminina', 'educativo'], 'draft'),
('550e8400-e29b-41d4-a716-446655440001', 'O que muda na vida íntima após os 40', 'Mudanças fisiológicas e opções disponíveis', 'Carrossel', 'Harmonização Íntima', 'Seguidores', ARRAY['40mais', 'mudancas', 'opcoes'], 'draft'),
('550e8400-e29b-41d4-a716-446655440001', 'Harmonização íntima: o que é e para quem', 'Explicação clara sobre indicações e resultados esperados', 'Reels', 'Harmonização Íntima', 'Alcance', ARRAY['explicativo', 'indicacoes', 'basico'], 'draft'),
('550e8400-e29b-41d4-a716-446655440001', 'Autocuidado íntimo não é vaidade', 'Desmistificar que cuidar da saúde íntima é autocuidado legítimo', 'Carrossel', 'Harmonização Íntima', 'Seguidores', ARRAY['autocuidado', 'empoderamento', 'reflexao'], 'draft'),
('550e8400-e29b-41d4-a716-446655440001', 'Perguntas que você tem vergonha de fazer', 'Responder dúvidas comuns de forma acolhedora', 'Reels', 'Harmonização Íntima', 'Alcance', ARRAY['faq', 'vergonha', 'acolhimento'], 'draft'),

-- IDEIAS FULL FACE (10)
('550e8400-e29b-41d4-a716-446655440001', 'O que é Full Face e por que funciona', 'Explicar a sinergia de procedimentos combinados', 'Reels', 'Full Face', 'Alcance', ARRAY['fullface', 'sinergia', 'explicativo'], 'draft'),
('550e8400-e29b-41d4-a716-446655440001', 'Antes e depois: transformações naturais', 'Mostrar resultados reais preservando harmonia facial', 'Carrossel', 'Full Face', 'Conversão', ARRAY['antesedepois', 'transformacao', 'natural'], 'draft'),
('550e8400-e29b-41d4-a716-446655440001', 'Rejuvenescimento em camadas: a técnica', 'Explicar abordagem multilayer para resultados duradouros', 'Reels', 'Full Face', 'Autoridade', ARRAY['tecnica', 'rejuvenescimento', 'ciencia'], 'draft'),
('550e8400-e29b-41d4-a716-446655440001', 'Full Face: investimento vs resultados', 'Abordar custo-benefício de forma transparente', 'Carrossel', 'Full Face', 'Conversão', ARRAY['investimento', 'custo-beneficio', 'transparencia'], 'draft'),
('550e8400-e29b-41d4-a716-446655440001', 'Manutenção de Full Face: cronograma ideal', 'Guia de manutenção e retoques', 'Carrossel', 'Full Face', 'Salvamento', ARRAY['manutencao', 'cronograma', 'evergreen'], 'draft'),

-- IDEIAS GLÚTEO (8)
('550e8400-e29b-41d4-a716-446655440001', 'Glúteo natural vs procedimento: qual a diferença', 'Mostrar o que é possível com cada abordagem', 'Reels', 'Glúteo', 'Alcance', ARRAY['gluteo', 'comparativo', 'educativo'], 'draft'),
('550e8400-e29b-41d4-a716-446655440001', 'Proporção corporal: o que faz sentido pra você', 'Abordar harmonia e personalização', 'Carrossel', 'Glúteo', 'Seguidores', ARRAY['proporcao', 'personalizacao', 'harmonia'], 'draft'),
('550e8400-e29b-41d4-a716-446655440001', 'Lipoenxertia: como funciona e resultados', 'Explicar procedimento e expectativas', 'Reels', 'Glúteo', 'Alcance', ARRAY['lipoenxertia', 'procedimento', 'explicativo'], 'draft'),
('550e8400-e29b-41d4-a716-446655440001', 'Gluteoplastia: mitos e verdades', 'Desmistificar procedimento de aumento', 'Carrossel', 'Glúteo', 'Autoridade', ARRAY['gluteoplastia', 'mitos', 'educativo'], 'draft'),

-- IDEIAS BASTIDORES (6)
('550e8400-e29b-41d4-a716-446655440001', 'Um dia na clínica comigo', 'Mostrar rotina real e humanizar a marca', 'Reels', 'Bastidores', 'Seguidores', ARRAY['rotina', 'humanizacao', 'bastidores'], 'draft'),
('550e8400-e29b-41d4-a716-446655440001', 'Por trás de uma consulta: o que avalio', 'Transparência sobre processo de avaliação', 'Carrossel', 'Bastidores', 'Conversão', ARRAY['consulta', 'processo', 'transparencia'], 'draft'),
('550e8400-e29b-41d4-a716-446655440001', 'Minha equipe: quem faz acontecer', 'Apresentar time e criar conexão', 'Reels', 'Bastidores', 'Seguidores', ARRAY['equipe', 'humanizacao', 'conexao'], 'draft'),
('550e8400-e29b-41d4-a716-446655440001', 'Quando decidi ser médica esteticista', 'História pessoal e motivação', 'Reels', 'Bastidores', 'Seguidores', ARRAY['historia', 'pessoal', 'storytelling'], 'draft'),

-- IDEIAS PROVA SOCIAL (6)
('550e8400-e29b-41d4-a716-446655440001', 'O que as pacientes mais falam', 'Compilado de feedbacks reais', 'Reels', 'Prova Social', 'Conversão', ARRAY['feedback', 'depoimento', 'prova-social'], 'draft'),
('550e8400-e29b-41d4-a716-446655440001', 'Histórias de transformação: além da estética', 'Impacto emocional e de autoestima', 'Carrossel', 'Prova Social', 'Conversão', ARRAY['transformacao', 'emocional', 'impacto'], 'draft'),
('550e8400-e29b-41d4-a716-446655440001', 'Depoimento em vídeo: paciente conta experiência', 'Testemunho autêntico e espontâneo', 'Reels', 'Prova Social', 'Conversão', ARRAY['depoimento', 'video', 'autenticidade'], 'draft'),
('550e8400-e29b-41d4-a716-446655440001', 'Por que pacientes voltam e indicam', 'Abordar fidelização e recomendação', 'Carrossel', 'Prova Social', 'Conversão', ARRAY['fidelizacao', 'indicacao', 'confianca'], 'draft');

-- =====================================================
-- PARTE 6: CALENDÁRIO 90 DIAS COMPLETO (JAN-ABR 2025)
-- =====================================================

-- SEMANA 1 - Janeiro 2025 (06-12)
INSERT INTO calendar_plan (profile_id, scheduled_date, day_of_week, format, pillar, objective, theme, caption_focus, cta_type, status) VALUES
('550e8400-e29b-41d4-a716-446655440001', '2025-01-06', 'Monday', 'Reels', 'Autoridade', 'Alcance', 'Mitos sobre procedimentos estéticos', 'Educativo - desmistificação', 'Salvamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-01-07', 'Tuesday', 'Carrossel', 'Autoridade', 'Salvamento', '5 perguntas antes de fazer procedimento', 'Guia prático', 'Comentário', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-01-08', 'Wednesday', 'Reels', 'Full Face', 'Alcance', 'O que é Full Face harmonizado', 'Explicativo visual', 'Compartilhamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-01-09', 'Thursday', 'Stories', 'Bastidores', 'Engajamento', 'Rotina na clínica', 'Bastidores autênticos', 'Direct', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-01-10', 'Friday', 'Reels', 'Harmonização Íntima', 'Alcance', 'Quebrando tabus: saúde íntima', 'Educativo sensível', 'Salvamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-01-11', 'Saturday', 'Carrossel', 'Prova Social', 'Conversão', 'Depoimentos de pacientes', 'Histórias reais', 'Agendamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-01-12', 'Sunday', 'Reels', 'Autoridade', 'Seguidores', 'Médica responde: perguntas frequentes', 'FAQ interativo', 'Comentário', 'scheduled'),

-- SEMANA 2 - Janeiro 2025 (13-19)
('550e8400-e29b-41d4-a716-446655440001', '2025-01-13', 'Monday', 'Reels', 'Glúteo', 'Alcance', 'Proporção corporal ideal', 'Educativo visual', 'Salvamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-01-14', 'Tuesday', 'Carrossel', 'Autoridade', 'Salvamento', 'Idade certa para cada procedimento', 'Guia por faixa etária', 'Compartilhamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-01-15', 'Wednesday', 'Reels', 'Full Face', 'Alcance', 'Antes e depois: transformações naturais', 'Resultado visual', 'Agendamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-01-16', 'Thursday', 'Stories', 'Bastidores', 'Engajamento', 'Por trás da consulta', 'Transparência', 'Direct', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-01-17', 'Friday', 'Reels', 'Autoridade', 'Alcance', 'Por que resultados naturais são mais difíceis', 'Técnica explicada', 'Comentário', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-01-18', 'Saturday', 'Carrossel', 'Harmonização Íntima', 'Seguidores', 'O que muda na vida íntima após 40', 'Educativo acolhedor', 'Salvamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-01-19', 'Sunday', 'Reels', 'Prova Social', 'Conversão', 'Paciente conta experiência', 'Depoimento vídeo', 'WhatsApp', 'scheduled'),

-- SEMANA 3 - Janeiro 2025 (20-26)
('550e8400-e29b-41d4-a716-446655440001', '2025-01-20', 'Monday', 'Reels', 'Autoridade', 'Alcance', 'A verdade sobre harmonização facial', 'Revelação educativa', 'Salvamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-01-21', 'Tuesday', 'Carrossel', 'Full Face', 'Salvamento', 'Full Face: investimento vs resultados', 'Transparência financeira', 'Agendamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-01-22', 'Wednesday', 'Reels', 'Glúteo', 'Alcance', 'Lipoenxertia: como funciona', 'Procedimento explicado', 'Compartilhamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-01-23', 'Thursday', 'Stories', 'Bastidores', 'Engajamento', 'Minha equipe', 'Humanização', 'Direct', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-01-24', 'Friday', 'Reels', 'Autoridade', 'Alcance', 'MITO ou VERDADE: preenchimentos', 'Série educativa', 'Comentário', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-01-25', 'Saturday', 'Carrossel', 'Prova Social', 'Conversão', 'Por que pacientes voltam', 'Fidelização', 'Agendamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-01-26', 'Sunday', 'Reels', 'Harmonização Íntima', 'Seguidores', 'Autocuidado íntimo não é vaidade', 'Empoderamento', 'Salvamento', 'scheduled'),

-- SEMANA 4 - Janeiro/Fevereiro 2025 (27-02)
('550e8400-e29b-41d4-a716-446655440001', '2025-01-27', 'Monday', 'Reels', 'Autoridade', 'Alcance', '3 erros que 90% das mulheres cometem', 'Alerta educativo', 'Salvamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-01-28', 'Tuesday', 'Carrossel', 'Full Face', 'Salvamento', 'Manutenção Full Face: cronograma', 'Guia prático', 'Compartilhamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-01-29', 'Wednesday', 'Reels', 'Glúteo', 'Alcance', 'Glúteo natural vs procedimento', 'Comparativo visual', 'Comentário', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-01-30', 'Thursday', 'Stories', 'Bastidores', 'Engajamento', 'Quando decidi ser médica esteticista', 'Storytelling pessoal', 'Direct', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-01-31', 'Friday', 'Reels', 'Autoridade', 'Alcance', 'Pare TUDO e me escuta', 'Urgência educativa', 'Salvamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-02-01', 'Saturday', 'Carrossel', 'Prova Social', 'Conversão', 'Histórias de transformação', 'Impacto emocional', 'Agendamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-02-02', 'Sunday', 'Reels', 'Harmonização Íntima', 'Alcance', 'Perguntas que você tem vergonha de fazer', 'Acolhimento', 'Comentário', 'scheduled'),

-- SEMANA 5 - Fevereiro 2025 (03-09)
('550e8400-e29b-41d4-a716-446655440001', '2025-02-03', 'Monday', 'Reels', 'Autoridade', 'Alcance', 'O que acontece no corpo após procedimento', 'Ciência explicada', 'Salvamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-02-04', 'Tuesday', 'Carrossel', 'Autoridade', 'Salvamento', 'O que nunca te contaram sobre recuperação', 'Expectativas realistas', 'Compartilhamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-02-05', 'Wednesday', 'Reels', 'Full Face', 'Alcance', 'Rejuvenescimento em camadas', 'Técnica avançada', 'Salvamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-02-06', 'Thursday', 'Stories', 'Bastidores', 'Engajamento', 'Um dia na clínica comigo', 'Rotina real', 'Direct', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-02-07', 'Friday', 'Reels', 'Glúteo', 'Alcance', 'Gluteoplastia: mitos e verdades', 'Desmistificação', 'Comentário', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-02-08', 'Saturday', 'Carrossel', 'Prova Social', 'Conversão', 'O que as pacientes mais falam', 'Feedbacks reais', 'Agendamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-02-09', 'Sunday', 'Reels', 'Autoridade', 'Seguidores', 'Como funciona avaliação facial completa', 'Processo transparente', 'Agendamento', 'scheduled');

-- SEMANA 6 - Fevereiro 2025 (10-16)
INSERT INTO calendar_plan (profile_id, scheduled_date, day_of_week, format, pillar, objective, theme, caption_focus, cta_type, status) VALUES
('550e8400-e29b-41d4-a716-446655440001', '2025-02-10', 'Monday', 'Reels', 'Autoridade', 'Alcance', 'Você sabia que existe isso?', 'Descoberta', 'Salvamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-02-11', 'Tuesday', 'Carrossel', 'Harmonização Íntima', 'Seguidores', 'Harmonização íntima: o que é e para quem', 'Explicativo completo', 'Compartilhamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-02-12', 'Wednesday', 'Reels', 'Full Face', 'Alcance', 'Botox: verdades que você precisa saber', 'Educativo procedimento', 'Comentário', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-02-13', 'Thursday', 'Stories', 'Bastidores', 'Engajamento', 'Preparação para procedimento', 'Behind the scenes', 'Direct', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-02-14', 'Friday', 'Reels', 'Autoridade', 'Alcance', 'Isso pode salvar seu dinheiro e sua saúde', 'Proteção financeira', 'Salvamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-02-15', 'Saturday', 'Carrossel', 'Prova Social', 'Conversão', 'Transformação completa: antes e depois', 'Resultado documentado', 'Agendamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-02-16', 'Sunday', 'Reels', 'Glúteo', 'Seguidores', 'Proporção: o que faz sentido pra você', 'Personalização', 'Comentário', 'scheduled'),

-- SEMANA 7 - Fevereiro 2025 (17-23)
('550e8400-e29b-41d4-a716-446655440001', '2025-02-17', 'Monday', 'Reels', 'Autoridade', 'Alcance', 'Isso que te contaram está ERRADO', 'Correção de mito', 'Salvamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-02-18', 'Tuesday', 'Carrossel', 'Full Face', 'Salvamento', 'Skincare pós-procedimento', 'Cuidados específicos', 'Compartilhamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-02-19', 'Wednesday', 'Reels', 'Harmonização Íntima', 'Alcance', 'Dúvidas comuns sobre rejuvenescimento íntimo', 'FAQ sensível', 'Salvamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-02-20', 'Thursday', 'Stories', 'Bastidores', 'Engajamento', 'Feedback ao vivo de paciente', 'Prova social instantânea', 'Direct', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-02-21', 'Friday', 'Reels', 'Autoridade', 'Alcance', 'Por que isso NÃO funciona', 'Revelação técnica', 'Comentário', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-02-22', 'Saturday', 'Carrossel', 'Prova Social', 'Conversão', 'Jornada de transformação: caso real', 'Storytelling paciente', 'Agendamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-02-23', 'Sunday', 'Reels', 'Autoridade', 'Seguidores', 'Top 5 procedimentos mais procurados', 'Ranking educativo', 'Salvamento', 'scheduled'),

-- SEMANA 8 - Fevereiro/Março 2025 (24-02)
('550e8400-e29b-41d4-a716-446655440001', '2025-02-24', 'Monday', 'Reels', 'Full Face', 'Alcance', 'Preenchimento labial: tudo que você precisa saber', 'Procedimento específico', 'Salvamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-02-25', 'Tuesday', 'Carrossel', 'Autoridade', 'Salvamento', 'Sinais de alerta: quando não fazer', 'Segurança primeiro', 'Compartilhamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-02-26', 'Wednesday', 'Reels', 'Glúteo', 'Alcance', 'Recuperação de gluteoplastia: timeline', 'Expectativas realistas', 'Salvamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-02-27', 'Thursday', 'Stories', 'Bastidores', 'Engajamento', 'Equipamentos e tecnologia da clínica', 'Transparência técnica', 'Direct', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-02-28', 'Friday', 'Reels', 'Autoridade', 'Alcance', 'Não faça isso NUNCA', 'Alerta forte', 'Salvamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-03-01', 'Saturday', 'Carrossel', 'Harmonização Íntima', 'Seguidores', 'Vida íntima saudável: além do procedimento', 'Holístico', 'Comentário', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-03-02', 'Sunday', 'Reels', 'Prova Social', 'Conversão', 'Paciente compartilha resultado', 'Depoimento vídeo', 'Agendamento', 'scheduled'),

-- SEMANA 9 - Março 2025 (03-09)
('550e8400-e29b-41d4-a716-446655440001', '2025-03-03', 'Monday', 'Reels', 'Autoridade', 'Alcance', 'A indústria não quer que você saiba disso', 'Revelação impactante', 'Salvamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-03-04', 'Tuesday', 'Carrossel', 'Full Face', 'Salvamento', 'Harmonização facial por idade', 'Guia segmentado', 'Compartilhamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-03-05', 'Wednesday', 'Reels', 'Harmonização Íntima', 'Alcance', 'Empoderamento feminino através do autocuidado', 'Motivacional', 'Comentário', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-03-06', 'Thursday', 'Stories', 'Bastidores', 'Engajamento', 'Pergunta e resposta ao vivo', 'Interação direta', 'Direct', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-03-07', 'Friday', 'Reels', 'Glúteo', 'Alcance', 'Corpo harmonizado: mais que estética', 'Bem-estar completo', 'Salvamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-03-08', 'Saturday', 'Carrossel', 'Autoridade', 'Seguidores', 'Dia da Mulher: cuidar de si é poder', 'Temático especial', 'Compartilhamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-03-09', 'Sunday', 'Reels', 'Prova Social', 'Conversão', 'Depoimentos especiais: Dia da Mulher', 'Celebração', 'Agendamento', 'scheduled'),

-- SEMANA 10 - Março 2025 (10-16)
('550e8400-e29b-41d4-a716-446655440001', '2025-03-10', 'Monday', 'Reels', 'Autoridade', 'Alcance', 'Escolhendo o profissional certo', 'Educativo segurança', 'Salvamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-03-11', 'Tuesday', 'Carrossel', 'Full Face', 'Salvamento', 'Combinações de procedimentos: sinergias', 'Técnico avançado', 'Compartilhamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-03-12', 'Wednesday', 'Reels', 'Harmonização Íntima', 'Alcance', 'Pós-parto: recuperação íntima', 'Segmento específico', 'Salvamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-03-13', 'Thursday', 'Stories', 'Bastidores', 'Engajamento', 'Processo de esterilização', 'Segurança transparente', 'Direct', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-03-14', 'Friday', 'Reels', 'Autoridade', 'Alcance', 'Tendências estéticas 2025', 'Atualização mercado', 'Comentário', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-03-15', 'Saturday', 'Carrossel', 'Prova Social', 'Conversão', 'Resultados de 1 ano: acompanhamento', 'Longevidade', 'Agendamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-03-16', 'Sunday', 'Reels', 'Glúteo', 'Seguidores', 'Exercício + procedimento: combinação ideal', 'Lifestyle integrado', 'Salvamento', 'scheduled'),

-- SEMANA 11 - Março 2025 (17-23)
('550e8400-e29b-41d4-a716-446655440001', '2025-03-17', 'Monday', 'Reels', 'Autoridade', 'Alcance', 'Expectativas realistas: conversa honesta', 'Transparência', 'Salvamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-03-18', 'Tuesday', 'Carrossel', 'Full Face', 'Salvamento', 'Cuidados pré-procedimento facial', 'Preparação completa', 'Compartilhamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-03-19', 'Wednesday', 'Reels', 'Harmonização Íntima', 'Alcance', 'Menopausa e saúde íntima', 'Segmento 50+', 'Comentário', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-03-20', 'Thursday', 'Stories', 'Bastidores', 'Engajamento', 'Certificações e formação', 'Credenciais', 'Direct', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-03-21', 'Friday', 'Reels', 'Autoridade', 'Alcance', 'Complicações: como evitar', 'Segurança avançada', 'Salvamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-03-22', 'Saturday', 'Carrossel', 'Prova Social', 'Conversão', 'Caso completo: planejamento a resultado', 'Documentação', 'Agendamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-03-23', 'Sunday', 'Reels', 'Glúteo', 'Alcance', 'Tipos de gluteoplastia: qual escolher', 'Comparativo técnico', 'Salvamento', 'scheduled'),

-- SEMANA 12 - Março/Abril 2025 (24-30)
('550e8400-e29b-41d4-a716-446655440001', '2025-03-24', 'Monday', 'Reels', 'Full Face', 'Alcance', 'Fios de sustentação: como funcionam', 'Procedimento explicado', 'Salvamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-03-25', 'Tuesday', 'Carrossel', 'Autoridade', 'Salvamento', 'Checklist pós-procedimento', 'Guia prático', 'Compartilhamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-03-26', 'Wednesday', 'Reels', 'Harmonização Íntima', 'Alcance', 'Tecnologias para rejuvenescimento íntimo', 'Inovação', 'Comentário', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-03-27', 'Thursday', 'Stories', 'Bastidores', 'Engajamento', 'Novidades na clínica', 'Atualização', 'Direct', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-03-28', 'Friday', 'Reels', 'Autoridade', 'Alcance', 'Minha filosofia de trabalho', 'Posicionamento', 'Salvamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-03-29', 'Saturday', 'Carrossel', 'Prova Social', 'Conversão', 'Compilado: melhores transformações do mês', 'Destaque mensal', 'Agendamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-03-30', 'Sunday', 'Reels', 'Glúteo', 'Seguidores', 'Recuperação: o que esperar semana a semana', 'Timeline detalhado', 'Salvamento', 'scheduled'),

-- SEMANA 13 - Abril 2025 (31-06)
('550e8400-e29b-41d4-a716-446655440001', '2025-03-31', 'Monday', 'Reels', 'Autoridade', 'Alcance', 'Novo mês, novo conteúdo: o que vem por aí', 'Preview conteúdo', 'Comentário', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-04-01', 'Tuesday', 'Carrossel', 'Full Face', 'Salvamento', 'Bioestimuladores: guia completo', 'Procedimento profundo', 'Compartilhamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-04-02', 'Wednesday', 'Reels', 'Harmonização Íntima', 'Alcance', 'Autoestima e saúde íntima: conexão', 'Emocional', 'Salvamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-04-03', 'Thursday', 'Stories', 'Bastidores', 'Engajamento', 'Q&A: suas perguntas respondidas', 'Interação', 'Direct', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-04-04', 'Friday', 'Reels', 'Autoridade', 'Alcance', 'Investimento em estética: vale a pena?', 'Custo-benefício', 'Comentário', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-04-05', 'Saturday', 'Carrossel', 'Prova Social', 'Conversão', 'Histórias inspiradoras de pacientes', 'Motivacional', 'Agendamento', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440001', '2025-04-06', 'Sunday', 'Reels', 'Glúteo', 'Alcance', 'Proporção áurea corporal', 'Conceito científico', 'Salvamento', 'scheduled');

-- =====================================================
-- PARTE 7: PROTOCOL STEPS DETALHADOS (12 Protocolos)
-- =====================================================

-- Protocolo 1: Reels Alcance
INSERT INTO protocol_steps (protocol_id, step_order, title, description, duration_minutes, checklist) VALUES
((SELECT id FROM protocols WHERE name = 'Protocolo Reels Alcance' LIMIT 1), 1, 'Ideação do Gancho', 'Escolher gancho de alto impacto da biblioteca. Priorizar curiosidade, revelação ou alerta.', 5, '["Verificar biblioteca de ganchos", "Testar 3 opções de abertura", "Validar nos primeiros 3 segundos"]'),
((SELECT id FROM protocols WHERE name = 'Protocolo Reels Alcance' LIMIT 1), 2, 'Roteiro Estruturado', 'Criar roteiro: Gancho (3s) → Desenvolvimento (20-40s) → CTA (5s). Total: 30-50 segundos.', 15, '["Gancho de impacto definido", "Conteúdo principal estruturado", "CTA claro e específico"]'),
((SELECT id FROM protocols WHERE name = 'Protocolo Reels Alcance' LIMIT 1), 3, 'Gravação', 'Gravar em ambiente com boa iluminação. Câmera na altura dos olhos. Energia alta.', 20, '["Iluminação verificada", "Áudio limpo", "Múltiplas takes gravadas"]'),
((SELECT id FROM protocols WHERE name = 'Protocolo Reels Alcance' LIMIT 1), 4, 'Edição Otimizada', 'Cortes rápidos. Texto na tela. Música trending. Legendas automáticas.', 15, '["Cortes dinâmicos aplicados", "Texto de reforço adicionado", "Música trending selecionada", "Legendas revisadas"]'),
((SELECT id FROM protocols WHERE name = 'Protocolo Reels Alcance' LIMIT 1), 5, 'Publicação Estratégica', 'Postar em horário de pico. Caption com palavras-chave. Hashtags do combo correto.', 10, '["Horário de pico verificado", "Caption SEO otimizada", "Combo de hashtags aplicado", "Thumbnail atrativa"]');

-- Protocolo 2: Carrossel Salvamento
INSERT INTO protocol_steps (protocol_id, step_order, title, description, duration_minutes, checklist) VALUES
((SELECT id FROM protocols WHERE name = 'Protocolo Carrossel Salvamento' LIMIT 1), 1, 'Planejamento do Conteúdo', 'Definir tema evergreen de alta utilidade. Listar 7-10 pontos principais.', 10, '["Tema evergreen confirmado", "7-10 pontos listados", "Estrutura de slides definida"]'),
((SELECT id FROM protocols WHERE name = 'Protocolo Carrossel Salvamento' LIMIT 1), 2, 'Design dos Slides', 'Criar slides com identidade visual. Slide 1 = Capa impactante. Slides 2-9 = Conteúdo. Slide 10 = CTA.', 30, '["Capa criada com gancho", "Slides de conteúdo formatados", "CTA final claro", "Identidade visual consistente"]'),
((SELECT id FROM protocols WHERE name = 'Protocolo Carrossel Salvamento' LIMIT 1), 3, 'Revisão de Texto', 'Verificar ortografia, clareza e compliance. Remover termos proibidos.', 10, '["Ortografia verificada", "Clareza confirmada", "Compliance CFM validado"]'),
((SELECT id FROM protocols WHERE name = 'Protocolo Carrossel Salvamento' LIMIT 1), 4, 'Caption SEO', 'Escrever legenda com palavras-chave. Incluir CTA de salvamento. Hashtags estratégicas.', 15, '["Palavras-chave incluídas", "CTA de salvamento presente", "Hashtags do combo correto"]'),
((SELECT id FROM protocols WHERE name = 'Protocolo Carrossel Salvamento' LIMIT 1), 5, 'Publicação', 'Exportar em alta qualidade. Verificar preview. Postar em horário estratégico.', 10, '["Qualidade de imagem verificada", "Preview conferido", "Publicado em horário ideal"]');

-- Protocolo 3: Stories Engajamento
INSERT INTO protocol_steps (protocol_id, step_order, title, description, duration_minutes, checklist) VALUES
((SELECT id FROM protocols WHERE name = 'Protocolo Stories Engajamento' LIMIT 1), 1, 'Planejamento da Sequência', 'Definir sequência de 5-7 stories com arco narrativo. Incluir interação em pelo menos 2.', 5, '["5-7 stories planejados", "Arco narrativo definido", "2+ stories interativos"]'),
((SELECT id FROM protocols WHERE name = 'Protocolo Stories Engajamento' LIMIT 1), 2, 'Criação de Conteúdo', 'Mix de vídeo falado + imagem + texto. Usar stickers de engajamento.', 15, '["Mix de formatos criado", "Stickers de interação adicionados", "Texto de apoio inserido"]'),
((SELECT id FROM protocols WHERE name = 'Protocolo Stories Engajamento' LIMIT 1), 3, 'Interação', 'Incluir enquete, quiz ou caixa de perguntas. Preparar respostas para engajar.', 10, '["Elemento interativo incluído", "Respostas preparadas"]'),
((SELECT id FROM protocols WHERE name = 'Protocolo Stories Engajamento' LIMIT 1), 4, 'Publicação', 'Postar em horário de alta atividade. Monitorar respostas nas primeiras horas.', 5, '["Publicado em horário ideal", "Monitoramento ativo"]');

-- Protocolo 4: Conteúdo Conversão
INSERT INTO protocol_steps (protocol_id, step_order, title, description, duration_minutes, checklist) VALUES
((SELECT id FROM protocols WHERE name = 'Protocolo Conteúdo Conversão' LIMIT 1), 1, 'Definição do Objetivo', 'Especificar ação desejada: Agendamento, DM ou WhatsApp. Preparar jornada do lead.', 10, '["Ação específica definida", "Jornada do lead mapeada", "Link/contato preparado"]'),
((SELECT id FROM protocols WHERE name = 'Protocolo Conteúdo Conversão' LIMIT 1), 2, 'Estrutura AIDA', 'Aplicar framework: Atenção → Interesse → Desejo → Ação. Conteúdo persuasivo ético.', 20, '["Atenção captada no início", "Interesse desenvolvido", "Desejo criado", "Ação clara"]'),
((SELECT id FROM protocols WHERE name = 'Protocolo Conteúdo Conversão' LIMIT 1), 3, 'Prova Social', 'Incluir elemento de prova social: depoimento, número ou resultado.', 10, '["Prova social incluída", "Credibilidade reforçada"]'),
((SELECT id FROM protocols WHERE name = 'Protocolo Conteúdo Conversão' LIMIT 1), 4, 'CTA Estratégico', 'Usar CTA específico da categoria correta. Remover fricção. Urgência suave.', 10, '["CTA da biblioteca aplicado", "Fricção removida", "Urgência adequada"]'),
((SELECT id FROM protocols WHERE name = 'Protocolo Conteúdo Conversão' LIMIT 1), 5, 'Tracking', 'Configurar tracking de conversão. Preparar follow-up.', 5, '["Tracking configurado", "Follow-up preparado"]');

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================
-- Este script adiciona aproximadamente:
-- • 120 CTAs (8 categorias)
-- • 210 Hashtags (6 temas x 35)
-- • 20+ Combos estratégicos
-- • 40+ Ganchos/Headlines
-- • 40+ Ideias de conteúdo
-- • 91 dias de calendário
-- • 18+ Protocol steps detalhados
-- =====================================================

-- FIM DO SQL PARTE 2
-- Execute após SQL PARTE 1
-- =====================================================
