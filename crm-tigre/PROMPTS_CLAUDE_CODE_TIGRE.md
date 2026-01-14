# 🐯 CRM TIGRE - PROMPTS PARA CLAUDE CODE

## ⚡ IMPORTANTE: USANDO WHATICKET COMO BASE

O sistema **Whaticket** já está disponível em `ferramentas/whaticket/` e contém:
- ✅ Backend Node.js + Express + Sequelize
- ✅ Frontend React + Material UI
- ✅ WhatsApp integrado (Baileys)
- ✅ Kanban de tickets
- ✅ Multi-atendentes
- ✅ Multi-tenant (SaaS)
- ✅ Filas de atendimento
- ✅ Chatbot básico

**Estratégia:** Em vez de construir do zero, vamos **ESTENDER o Whaticket** adicionando os módulos específicos para clínicas de estética.

---

## Como Usar

1. Clone o repositório: `git clone https://github.com/lucastigrereal-dev/estetica-sales-system.git`
2. Entre na pasta: `cd estetica-sales-system`
3. Copie o Whaticket como base: `cp -r ferramentas/whaticket/whaticket-saas crm-tigre/`
4. Abra o Claude Code no terminal
5. Cole o prompt desejado
6. Após conclusão: `git add . && git commit -m "mensagem" && git push`

---

## CC-TIGRE-01: SETUP E CONFIGURAÇÃO DO WHATICKET

```
Você é um desenvolvedor senior. Configure o Whaticket existente em crm-tigre/whaticket-saas/ para funcionar como CRM de estética.

TAREFAS:

1. BACKEND (backend/):
   - Renomeie o projeto para "CRM Tigre" nos arquivos de config
   - Atualize package.json com nome "crm-tigre-backend"
   - Verifique se todas as dependências estão instaladas
   - Configure .env.example com variáveis necessárias

2. FRONTEND (frontend/):
   - Renomeie para "CRM Tigre" no título e configs
   - Atualize package.json com nome "crm-tigre-frontend"
   - Mude o tema de cores para combinar com estética (tons de roxo/rosa)

3. DOCKER:
   - Atualize docker-compose.yml se necessário
   - Garanta que PostgreSQL e Redis estão configurados

4. TESTE:
   - Execute npm install em backend/ e frontend/
   - Verifique se o sistema sobe sem erros

O Whaticket já tem: auth, tickets, chat, kanban, filas, webhooks WhatsApp.
NÃO recrie o que já existe, apenas configure.
```

---

## CC-TIGRE-02: ADICIONAR MÓDULO DE PACIENTES

```
Você é um desenvolvedor senior. Adicione o módulo de Pacientes ao CRM Tigre (baseado no Whaticket).

BACKEND - Novos arquivos em backend/src/:

1. models/Paciente.ts:
   - id, visitorId (link com Contact do Whaticket), clinicaId
   - nome, email, telefone, whatsapp, cpf, dataNascimento, genero
   - endereco, cidade, estado, cep
   - numeroProcedimentos, procedimentoFavorito
   - status (ATIVO, INATIVO, BLOQUEADO)
   - classificacao (OURO, PRATA, BRONZE, NOVO)
   - observacoes, alergias, historicoMedico
   - createdAt, updatedAt, ultimoContato

2. controllers/PacienteController.ts:
   - index (listar com filtros e paginação)
   - show (buscar por id)
   - store (criar novo)
   - update (atualizar)
   - delete (remover)
   - convertFromContact (converter Contact do Whaticket em Paciente)

3. routes/pacienteRoutes.ts:
   - GET /pacientes
   - GET /pacientes/:id
   - POST /pacientes
   - PUT /pacientes/:id
   - DELETE /pacientes/:id
   - POST /pacientes/convert/:contactId

4. services/PacienteService.ts:
   - Lógica de negócio
   - Cálculo automático de classificação baseado em procedimentos

FRONTEND - Novos arquivos em frontend/src/:

1. pages/Pacientes/index.js:
   - Tabela com busca, filtros por status/classificação
   - Botões: novo, editar, ver histórico
   - Paginação

2. pages/Pacientes/PacienteForm.js:
   - Formulário completo com validação
   - Campos organizados em abas: Dados, Endereço, Histórico Médico

3. components/PacienteCard.js:
   - Card resumido para usar em outras telas

Integre com o menu lateral existente do Whaticket.
Use o mesmo padrão de código do Whaticket (Sequelize, Material UI).
```

---

## CC-TIGRE-03: ADICIONAR MÓDULO DE PROCEDIMENTOS E AGENDAMENTOS

```
Você é um desenvolvedor senior. Adicione os módulos de Procedimentos e Agendamentos ao CRM Tigre.

BACKEND - Procedimentos:

1. models/Procedimento.ts:
   - id, clinicaId, nome, descricao, categoria
   - duracaoMinutos, precoPadrao, precoPromocional
   - ativo, imagemUrl, createdAt

2. controllers/ProcedimentoController.ts:
   - CRUD completo

3. routes/procedimentoRoutes.ts

BACKEND - Agendamentos:

1. models/Agendamento.ts:
   - id, clinicaId, pacienteId, procedimentoId, profissionalId
   - dataAgendamento, horaInicio, horaFim, duracaoMinutos
   - status (AGENDADO, CONFIRMADO, REALIZADO, CANCELADO, NO_SHOW)
   - preco, desconto, precoFinal
   - pagamentoStatus, metodoPagamento
   - notas, googleEventId
   - lembrete24hEnviado, lembrete2hEnviado
   - createdAt, updatedAt

2. controllers/AgendamentoController.ts:
   - index, show, store, update, delete
   - confirmar (paciente confirma presença)
   - cancelar (com motivo)
   - marcarRealizado
   - marcarNoShow
   - slotsDisponiveis (horários livres)

3. routes/agendamentoRoutes.ts

FRONTEND:

1. pages/Procedimentos/index.js:
   - Lista de procedimentos com preços
   - CRUD completo

2. pages/Agendamentos/index.js:
   - Calendário visual (usar react-big-calendar ou similar)
   - Vistas: dia, semana, mês
   - Cores por status
   - Drag and drop para reagendar
   - Modal ao clicar em agendamento

3. pages/Agendamentos/NovoAgendamento.js:
   - Wizard: Selecionar paciente → Procedimento → Data/Hora → Confirmar
   - Mostrar apenas horários disponíveis

Integre com o sistema de tickets do Whaticket (quando um ticket é convertido, pode virar agendamento).
```

---

## CC-TIGRE-04: ADICIONAR MÓDULO FINANCEIRO

```
Você é um desenvolvedor senior. Adicione o módulo Financeiro ao CRM Tigre.

BACKEND:

1. models/Pagamento.ts:
   - id, agendamentoId, pacienteId, clinicaId
   - valor, desconto, valorFinal
   - metodo (CARTAO, PIX, BOLETO, DINHEIRO)
   - status (PENDENTE, APROVADO, RECUSADO, REEMBOLSADO)
   - stripePaymentId, pixCode, boletoUrl
   - createdAt, dataPagamento

2. controllers/PagamentoController.ts:
   - index (listar pagamentos)
   - show (detalhes)
   - store (registrar pagamento manual)
   - gerarLinkPagamento (Stripe checkout)
   - gerarPix (código PIX)
   - webhookStripe (receber confirmação)

3. services/StripeService.ts:
   - createCheckoutSession
   - createPaymentIntent
   - processWebhook
   - createRefund

4. services/PixService.ts:
   - gerarCodigoPix
   - verificarPagamento

FRONTEND:

1. pages/Financeiro/index.js:
   - Dashboard financeiro
   - Cards: Faturamento hoje/semana/mês, Pendentes, Recebidos
   - Gráfico de faturamento
   - Lista de pagamentos recentes

2. pages/Financeiro/Pagamentos.js:
   - Tabela de todos os pagamentos
   - Filtros: período, status, método
   - Exportar para Excel

3. components/PagamentoModal.js:
   - Modal para registrar pagamento
   - Opções: Link Stripe, PIX, Manual

Variáveis de ambiente necessárias:
- STRIPE_SECRET_KEY
- STRIPE_PUBLISHABLE_KEY
- STRIPE_WEBHOOK_SECRET
- PIX_CHAVE (sua chave PIX)
```

---

## CC-TIGRE-05: UPGRADE DO CHATBOT PARA ANNA (IA)

```
Você é um desenvolvedor senior. Faça upgrade do chatbot do Whaticket para a Anna (IA) no CRM Tigre.

O Whaticket já tem chatbot básico. Vamos adicionar IA com OpenAI.

BACKEND:

1. services/OpenAIService.ts:
   - Configurar cliente OpenAI
   - gerarResposta(mensagem, contexto, historico) -> string
   - analisarSentimento(mensagem) -> score (-1 a 1)
   - qualificarLead(conversa) -> { score, interessado, procedimentoSugerido }
   - gerarResumoConversa(mensagens) -> string

2. services/AnnaService.ts:
   - processarMensagem(ticketId, mensagem)
   - Fluxo de qualificação:
     1. Saudação + "Como posso ajudar?"
     2. "Qual procedimento você tem interesse?"
     3. "Você já fez esse procedimento antes?"
     4. "Qual o melhor dia para você?"
     5. "Qual horário prefere: manhã, tarde ou noite?"
   - Se score > 70: sugerir agendamento com botões
   - Salvar score no ticket

3. Atualizar controllers/MessageController.ts:
   - Quando mensagem chega e chatbot está ativo, chamar AnnaService
   - Salvar análise de sentimento

4. models/TicketAnalysis.ts (novo):
   - ticketId, scoreQualificacao, sentimentoMedio
   - procedimentoInteresse, melhorDia, melhorHorario
   - convertido, agendamentoId

FRONTEND:

1. Atualizar componente de Chat:
   - Mostrar score de qualificação do lead
   - Mostrar análise de sentimento (emoji)
   - Botão "Converter para Agendamento"

2. pages/Anna/Dashboard.js:
   - Métricas da Anna: conversas, qualificados, convertidos
   - Taxa de conversão
   - Procedimentos mais procurados

SYSTEM PROMPT DA ANNA (salvar em config):
"Você é Anna, assistente virtual da clínica de estética [NOME_CLINICA].
Você é simpática, profissional e objetiva.
Seu objetivo é qualificar leads e agendar procedimentos estéticos.
Procedimentos disponíveis: [LISTA_PROCEDIMENTOS]
Horário de funcionamento: [HORARIO]
Faça perguntas para entender o interesse do paciente.
Quando o paciente estiver qualificado, sugira um horário disponível.
Nunca invente informações sobre preços - diga que vai verificar.
Se o paciente pedir para falar com humano, transfira imediatamente."

Variáveis de ambiente:
- OPENAI_API_KEY
- OPENAI_MODEL=gpt-4-turbo-preview
```

---

## CC-TIGRE-06: LEMBRETES E AUTOMAÇÕES

```
Você é um desenvolvedor senior. Adicione sistema de lembretes automáticos ao CRM Tigre.

BACKEND:

1. jobs/LembreteJob.ts:
   - Cron job que roda a cada hora
   - Busca agendamentos das próximas 24h que não receberam lembrete
   - Envia mensagem WhatsApp via Whaticket
   - Marca lembrete24hEnviado = true

2. jobs/Lembrete2hJob.ts:
   - Cron job que roda a cada 30 min
   - Busca agendamentos das próximas 2h
   - Envia lembrete final com botão de confirmação
   - Marca lembrete2hEnviado = true

3. jobs/NpsJob.ts:
   - Cron job que roda às 20:00
   - Busca agendamentos REALIZADOS do dia
   - Envia pesquisa NPS via WhatsApp
   - Salva resposta

4. jobs/ReativacaoJob.ts:
   - Cron job semanal
   - Busca pacientes sem agendamento há 30/60/90 dias
   - Envia mensagem de reativação personalizada

5. services/AutomacaoService.ts:
   - enviarLembrete24h(agendamento)
   - enviarLembrete2h(agendamento)
   - enviarNps(agendamento)
   - enviarReativacao(paciente, diasSemContato)

6. models/Automacao.ts:
   - tipo, pacienteId, agendamentoId
   - dataEnvio, status, resposta
   - createdAt

TEMPLATES DE MENSAGEM (salvar em config):

LEMBRETE_24H:
"Olá {nome}! 👋
Lembrando que você tem um agendamento amanhã:
📅 {data} às {hora}
💆 {procedimento}
📍 {endereco}
Confirma sua presença? Responda SIM ou NÃO."

LEMBRETE_2H:
"Oi {nome}! Seu horário é daqui a 2 horas! ⏰
{procedimento} às {hora}
Estamos te esperando! 💜"

NPS:
"Olá {nome}! Como foi sua experiência hoje?
De 0 a 10, qual nota você dá para nosso atendimento?
(Responda apenas o número)"

REATIVACAO_30D:
"Oi {nome}, sentimos sua falta! 💜
Já faz um tempinho que você não vem nos ver.
Que tal agendar seu próximo {procedimentoFavorito}?
Temos horários disponíveis essa semana!"

FRONTEND:

1. pages/Configuracoes/Automacoes.js:
   - Ativar/desativar cada automação
   - Editar templates de mensagem
   - Ver histórico de envios
```

---

## CC-TIGRE-07: DASHBOARD E RELATÓRIOS

```
Você é um desenvolvedor senior. Crie o Dashboard executivo e Relatórios do CRM Tigre.

BACKEND:

1. controllers/DashboardController.ts:
   - resumoHoje(): agendamentos, faturamento, noShows, novosLeads
   - metricas(periodo): array de métricas diárias
   - conversao(periodo): leads, qualificados, agendados, realizados
   - topProcedimentos(periodo): ranking de procedimentos
   - topPacientes(periodo): pacientes que mais gastaram
   - comparativo(periodo): comparar com período anterior

2. controllers/RelatorioController.ts:
   - gerarRelatorioMensal(mes, ano): PDF com todas as métricas
   - exportarAgendamentos(filtros): Excel
   - exportarPacientes(filtros): Excel
   - exportarFinanceiro(filtros): Excel

3. services/RelatorioService.ts:
   - Usar pdfkit ou puppeteer para gerar PDFs
   - Usar exceljs para gerar Excel

FRONTEND:

1. pages/Dashboard/index.js (substituir home do Whaticket):
   - 4 cards KPI no topo (agendamentos, faturamento, no-show, conversão)
   - Gráfico de faturamento (últimos 30 dias)
   - Gráfico de agendamentos por dia
   - Funil de conversão
   - Lista de próximos agendamentos
   - Atividade recente

2. pages/Relatorios/index.js:
   - Seletor de período
   - Botões para gerar/baixar relatórios
   - Preview do relatório
   - Histórico de relatórios gerados

3. components/Charts/:
   - FaturamentoChart.js (LineChart)
   - AgendamentosChart.js (BarChart)
   - ConversaoFunil.js (FunnelChart)
   - TopProcedimentos.js (PieChart)

Usar recharts ou chart.js para gráficos.
Dashboard deve atualizar automaticamente a cada 5 minutos.
```

---

## CC-TIGRE-08: DEPLOY E FINALIZAÇÃO

```
Você é um desenvolvedor senior. Finalize o CRM Tigre para deploy em produção.

1. DOCKER (atualizar docker-compose.yml):
   - postgres:15 com volume persistente
   - redis:7 com volume
   - backend com healthcheck
   - frontend com nginx
   - Variáveis de ambiente via .env

2. NGINX (criar nginx.conf):
   - Proxy reverso para frontend e backend
   - SSL/HTTPS configurado
   - Gzip compression
   - Cache de assets

3. SCRIPTS:
   - scripts/deploy.sh: script de deploy automatizado
   - scripts/backup.sh: backup do banco de dados
   - scripts/restore.sh: restaurar backup

4. DOCUMENTAÇÃO:
   - README.md atualizado com instruções de instalação
   - INSTALL.md com passo a passo detalhado
   - API.md com documentação dos endpoints

5. SEGURANÇA:
   - Verificar todas as rotas protegidas
   - Rate limiting nas APIs
   - Sanitização de inputs
   - CORS configurado corretamente

6. TESTES:
   - Testar todos os fluxos principais
   - Verificar responsividade mobile
   - Testar integração WhatsApp
   - Testar pagamentos (modo teste)

7. VARIÁVEIS DE PRODUÇÃO (.env.production):
   - DATABASE_URL
   - REDIS_URL
   - JWT_SECRET (gerar novo)
   - OPENAI_API_KEY
   - STRIPE_SECRET_KEY
   - Todas as outras variáveis

Após finalizar, o sistema deve:
- Subir com: docker-compose up -d
- Estar acessível em: https://seudominio.com
- API em: https://api.seudominio.com
```

---

## 📋 ORDEM DE EXECUÇÃO

| # | Prompt | Dependência | Tempo | O que adiciona |
|---|--------|-------------|-------|----------------|
| 1 | CC-TIGRE-01 | Nenhuma | 15 min | Setup do Whaticket |
| 2 | CC-TIGRE-02 | 01 | 45 min | Módulo Pacientes |
| 3 | CC-TIGRE-03 | 02 | 60 min | Procedimentos + Agendamentos |
| 4 | CC-TIGRE-04 | 03 | 45 min | Financeiro + Stripe |
| 5 | CC-TIGRE-05 | 01 | 60 min | Anna IA (upgrade chatbot) |
| 6 | CC-TIGRE-06 | 03, 05 | 45 min | Lembretes automáticos |
| 7 | CC-TIGRE-07 | 03, 04 | 60 min | Dashboard + Relatórios |
| 8 | CC-TIGRE-08 | Todos | 30 min | Deploy |

**Total estimado:** ~6 horas

---

## ⚡ EXECUÇÃO PARALELA

**Aba 1:** CC-TIGRE-01 → CC-TIGRE-02 → CC-TIGRE-03 → CC-TIGRE-04
**Aba 2:** (após 01) CC-TIGRE-05
**Aba 3:** (após 03 e 05) CC-TIGRE-06
**Aba 4:** (após 03 e 04) CC-TIGRE-07

Depois de todos:
**Aba 1:** CC-TIGRE-08

---

## 🎯 VANTAGEM DE USAR WHATICKET COMO BASE

| Funcionalidade | Construir do Zero | Usar Whaticket |
|----------------|-------------------|----------------|
| Auth + Users | 8h | ✅ Pronto |
| WhatsApp | 16h | ✅ Pronto |
| Chat/Tickets | 12h | ✅ Pronto |
| Kanban | 8h | ✅ Pronto |
| Multi-tenant | 12h | ✅ Pronto |
| Filas | 4h | ✅ Pronto |
| **Total economizado** | **60h** | **0h** |

Você só precisa adicionar: Pacientes, Agendamentos, Financeiro, Anna IA, Dashboard.

---

**Documento:** Prompts Claude Code CRM Tigre (Baseado no Whaticket)
**Versão:** 3.0
**Data:** 14 de janeiro de 2026
