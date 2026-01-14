# 🐯 CRM TIGRE - PROMPTS PARA CLAUDE CODE

## Como Usar

1. Clone o repositório: `git clone https://github.com/lucastigrereal-dev/estetica-sales-system.git`
2. Entre na pasta: `cd estetica-sales-system/crm-tigre`
3. Abra o Claude Code no terminal
4. Cole o prompt desejado
5. Após conclusão: `git add . && git commit -m "mensagem" && git push`

---

## CC-TIGRE-01: SETUP INICIAL

```
Você é um desenvolvedor senior. Crie o setup inicial do projeto CRM Tigre na pasta atual.

ESTRUTURA:
crm-tigre/
├── frontend/          # Next.js 14
├── backend/           # Node.js + Express + tRPC
├── prisma/            # Schema PostgreSQL
└── docker-compose.yml

FRONTEND (frontend/):
1. Inicialize Next.js 14 com App Router e TypeScript
2. Instale: tailwindcss, @radix-ui/react-*, @tanstack/react-query, zustand, react-hook-form, zod, recharts, socket.io-client
3. Configure tailwind.config.ts com tema escuro
4. Crie layout base com sidebar e header

BACKEND (backend/):
1. Inicialize Node.js com TypeScript
2. Instale: express, @trpc/server, @trpc/client, prisma, @prisma/client, bull, socket.io, node-cron, jsonwebtoken, winston, zod
3. Crie estrutura: src/routers/, src/services/, src/integrations/, src/utils/
4. Configure tRPC com Express

DOCKER:
1. Crie docker-compose.yml com:
   - postgres:15
   - redis:7
   - frontend (porta 3000)
   - backend (porta 4000)

ENV:
1. Crie .env.example com todas as variáveis necessárias

Execute: npm install em frontend/ e backend/
```

---

## CC-TIGRE-02: PRISMA SCHEMA

```
Você é um desenvolvedor senior. Crie o schema Prisma completo para o CRM Tigre.

ARQUIVO: prisma/schema.prisma

MODELOS (criar todos):

1. User (id, email, senha, nome, telefone, role, ativo, createdAt, updatedAt)
2. Clinica (id, userId, nome, cnpj, endereco, telefone, logoUrl, createdAt)
3. Paciente (id, clinicaId, nome, email, telefone, whatsapp, cpf, dataNascimento, genero, endereco, numeroProcedimentos, procedimentoFavorito, status, classificacao, createdAt, ultimoContato)
4. Procedimento (id, clinicaId, nome, descricao, duracaoMinutos, precoPadrao, categoria, ativo, imagemUrl, createdAt)
5. Agendamento (id, clinicaId, pacienteId, procedimentoId, profissionalId, dataAgendamento, duracaoMinutos, status, preco, pagamentoStatus, notas, googleEventId, lembrete24hEnviado, lembrete2hEnviado, createdAt, updatedAt)
6. Pagamento (id, agendamentoId, pacienteId, clinicaId, valor, metodo, status, stripePaymentId, createdAt, dataProcessamento, descricao)
7. ChatConversa (id, clinicaId, pacienteWhatsapp, dataInicio, dataUltimaMensagem, status, conversaoAgendamentoId)
8. ChatMensagem (id, conversaId, sender, mensagem, tipo, dataEnvio, lido, dataLeitura, scoreSentimento)
9. PesquisaNps (id, agendamentoId, pacienteId, score, comentario, dataEnvio, dataResposta, respondido)
10. PontosPrograma (id, clinicaId, pacienteId, saldo, pontosTotaisAcumulados, nivel, createdAt, updatedAt)
11. DashboardMetricas (id, clinicaId, data, faturamentoDia, agendamentosDia, noShowsDia, conversoesDia, novosPacientesDia, atendimentosRealizados, ticketMedio)

RELAÇÕES:
- User 1:N Clinica
- Clinica 1:N Paciente
- Clinica 1:N Procedimento
- Clinica 1:N Agendamento
- Paciente 1:N Agendamento
- Procedimento 1:N Agendamento
- Agendamento 1:1 Pagamento
- Agendamento 1:1 PesquisaNps
- Clinica 1:N ChatConversa
- ChatConversa 1:N ChatMensagem
- Paciente 1:1 PontosPrograma

ENUMS:
- Role: ADMIN, STAFF, VIEW
- StatusPaciente: ATIVO, INATIVO, BLOQUEADO
- ClassificacaoPaciente: OURO, PRATA, BRONZE, NOVO
- CategoriaProcedimento: FACIAL, CORPORAL, CAPILAR, OUTRA
- StatusAgendamento: AGENDADO, CONFIRMADO, REALIZADO, CANCELADO, NO_SHOW
- StatusPagamento: PENDENTE, PROCESSANDO, APROVADO, RECUSADO, REEMBOLSADO
- MetodoPagamento: CARTAO, PIX, BOLETO, DINHEIRO
- StatusChat: ABERTA, CONVERTIDA, ABANDONADA, SPAM
- SenderChat: ANNA, PACIENTE
- TipoMensagem: TEXTO, IMAGEM, DOCUMENTO
- NivelFidelidade: BRONZE, PRATA, OURO, PLATINA

Após criar o schema, execute:
npx prisma generate
npx prisma db push
```

---

## CC-TIGRE-03: BACKEND tRPC

```
Você é um desenvolvedor senior. Crie o backend completo com tRPC para o CRM Tigre.

ESTRUTURA backend/src/:
├── index.ts           # Entry point
├── trpc.ts            # tRPC config
├── routers/
│   ├── index.ts       # App router
│   ├── auth.ts        # Login, registro, JWT
│   ├── pacientes.ts   # CRUD pacientes
│   ├── agendamentos.ts # CRUD agendamentos
│   ├── procedimentos.ts # CRUD procedimentos
│   ├── pagamentos.ts  # Stripe integration
│   ├── chat.ts        # Anna chatbot
│   ├── dashboard.ts   # Métricas e KPIs
│   └── lembretes.ts   # Automação lembretes
├── services/
│   ├── openai.ts      # GPT-4 integration
│   ├── whatsapp.ts    # WhatsApp Business API
│   ├── stripe.ts      # Pagamentos
│   ├── google-calendar.ts # Sincronização
│   └── sendgrid.ts    # Emails
├── jobs/
│   ├── lembrete24h.ts # Job lembrete 24h
│   ├── lembrete2h.ts  # Job lembrete 2h
│   └── nps.ts         # Job pesquisa NPS
└── utils/
    ├── jwt.ts         # Token helpers
    └── validators.ts  # Zod schemas

ROUTERS (implementar todos):

1. auth.ts:
   - login (email, senha) -> JWT
   - registro (dados) -> User
   - me () -> User atual
   - logout () -> void

2. pacientes.ts:
   - listar (filtros, paginação) -> Paciente[]
   - buscar (id) -> Paciente
   - criar (dados) -> Paciente
   - atualizar (id, dados) -> Paciente
   - deletar (id) -> void
   - historico (id) -> Agendamento[]

3. agendamentos.ts:
   - listar (data, status) -> Agendamento[]
   - buscar (id) -> Agendamento
   - criar (dados) -> Agendamento (+ sync Google Calendar)
   - atualizar (id, dados) -> Agendamento
   - cancelar (id, motivo) -> Agendamento
   - confirmar (id) -> Agendamento
   - slotsDisponiveis (data, procedimentoId) -> Slot[]

4. dashboard.ts:
   - resumoHoje () -> { agendamentos, faturamento, noShows }
   - metricas (periodo) -> DashboardMetricas[]
   - conversao (periodo) -> { leads, convertidos, taxa }
   - topProcedimentos (periodo) -> Procedimento[]

Implemente autenticação JWT em todas as rotas protegidas.
Use Prisma para todas as queries.
Adicione validação Zod em todos os inputs.
```

---

## CC-TIGRE-04: FRONTEND NEXT.JS

```
Você é um desenvolvedor senior. Crie o frontend completo com Next.js 14 para o CRM Tigre.

ESTRUTURA frontend/src/app/:
├── layout.tsx         # Layout principal
├── page.tsx           # Dashboard
├── login/page.tsx     # Login
├── pacientes/
│   ├── page.tsx       # Lista pacientes
│   ├── [id]/page.tsx  # Detalhes paciente
│   └── novo/page.tsx  # Novo paciente
├── agendamentos/
│   ├── page.tsx       # Calendário
│   └── novo/page.tsx  # Novo agendamento
├── procedimentos/
│   └── page.tsx       # Lista procedimentos
├── chat/
│   └── page.tsx       # Conversas Anna
├── financeiro/
│   └── page.tsx       # Pagamentos
└── configuracoes/
    └── page.tsx       # Settings

COMPONENTES frontend/src/components/:
├── layout/
│   ├── Sidebar.tsx    # Menu lateral
│   ├── Header.tsx     # Topo
│   └── Footer.tsx
├── ui/
│   ├── Button.tsx     # Radix Button
│   ├── Input.tsx      # Radix Input
│   ├── Select.tsx     # Radix Select
│   ├── Dialog.tsx     # Radix Dialog
│   ├── Table.tsx      # Tabela com paginação
│   ├── Calendar.tsx   # Calendário visual
│   └── Card.tsx       # Card KPI
├── forms/
│   ├── PacienteForm.tsx
│   ├── AgendamentoForm.tsx
│   └── ProcedimentoForm.tsx
└── charts/
    ├── FaturamentoChart.tsx
    ├── ConversaoChart.tsx
    └── AgendamentosChart.tsx

PÁGINAS (implementar todas):

1. Dashboard (page.tsx):
   - 4 cards KPI (agendamentos hoje, faturamento, no-shows, conversão)
   - Gráfico faturamento últimos 7 dias
   - Lista próximos agendamentos
   - Atividade recente

2. Pacientes (pacientes/page.tsx):
   - Tabela com busca e filtros
   - Botão novo paciente
   - Ações: ver, editar, deletar
   - Paginação

3. Calendário (agendamentos/page.tsx):
   - Vista dia/semana/mês
   - Drag and drop para reagendar
   - Cores por status
   - Modal detalhes ao clicar

4. Chat Anna (chat/page.tsx):
   - Lista conversas à esquerda
   - Chat à direita
   - Score qualificação
   - Botão converter para agendamento

Use TanStack Query para data fetching.
Use Zustand para estado global.
Use React Hook Form + Zod para formulários.
Tema escuro como padrão.
Responsivo (mobile-first).
```

---

## CC-TIGRE-05: ANNA CHATBOT

```
Você é um desenvolvedor senior. Implemente o chatbot Anna com IA para o CRM Tigre.

ARQUIVOS:

1. backend/src/services/openai.ts:
   - Configurar cliente OpenAI
   - Função gerarResposta(mensagem, contexto) -> string
   - Função analisarSentimento(mensagem) -> score
   - Função qualificarLead(conversa) -> { score, interessado, procedimento }
   - System prompt da Anna (personalidade, regras)

2. backend/src/services/whatsapp.ts:
   - Configurar Twilio/WhatsApp Business API
   - Função enviarMensagem(numero, texto) -> void
   - Função enviarTemplate(numero, template, params) -> void
   - Função receberWebhook(payload) -> Mensagem
   - Função enviarBotoes(numero, texto, botoes) -> void

3. backend/src/routers/chat.ts:
   - webhookWhatsApp (POST) - receber mensagens
   - listarConversas (clinicaId) -> Conversa[]
   - buscarConversa (id) -> Conversa com mensagens
   - enviarMensagem (conversaId, texto) -> Mensagem
   - converterParaAgendamento (conversaId) -> Agendamento

4. backend/src/jobs/anna.ts:
   - Processar mensagem recebida
   - Gerar resposta com OpenAI
   - Fazer 4 perguntas de qualificação:
     1. "Qual procedimento você tem interesse?"
     2. "Você já fez esse procedimento antes?"
     3. "Qual o melhor dia para você?"
     4. "Qual horário prefere: manhã, tarde ou noite?"
   - Calcular score de qualificação (0-100)
   - Se score > 70: sugerir agendamento
   - Salvar conversa no banco

SYSTEM PROMPT DA ANNA:
"Você é Anna, assistente virtual da [Clínica]. Você é simpática, profissional e objetiva.
Seu objetivo é qualificar leads e agendar procedimentos estéticos.
Faça 4 perguntas para entender o interesse do paciente.
Sempre sugira um horário disponível quando o lead estiver qualificado.
Nunca invente informações sobre preços ou procedimentos.
Se não souber algo, diga que vai verificar com a equipe."

FLUXO:
1. Paciente envia mensagem
2. Webhook recebe e salva
3. OpenAI gera resposta
4. Anna envia resposta
5. Após 4 perguntas, calcula score
6. Se qualificado, oferece agendamento
7. Paciente confirma via botão
8. Agendamento criado automaticamente
```

---

## CC-TIGRE-06: INTEGRAÇÕES

```
Você é um desenvolvedor senior. Implemente todas as integrações do CRM Tigre.

1. GOOGLE CALENDAR (backend/src/services/google-calendar.ts):
   - Autenticação OAuth2
   - criarEvento(agendamento) -> eventId
   - atualizarEvento(eventId, dados) -> void
   - deletarEvento(eventId) -> void
   - listarEventos(dataInicio, dataFim) -> Evento[]
   - verificarDisponibilidade(data, duracao) -> boolean

2. STRIPE (backend/src/services/stripe.ts):
   - Configurar Stripe SDK
   - criarPaymentIntent(valor, pacienteId) -> clientSecret
   - criarCheckoutSession(agendamentoId) -> url
   - processarWebhook(payload) -> void
   - criarReembolso(paymentId) -> void
   - listarPagamentos(pacienteId) -> Pagamento[]

3. SENDGRID (backend/src/services/sendgrid.ts):
   - Configurar SendGrid SDK
   - enviarEmail(para, assunto, html) -> void
   - enviarTemplate(para, templateId, dados) -> void
   - Templates:
     - Confirmação agendamento
     - Lembrete 24h
     - Pesquisa NPS
     - Relatório semanal

4. LEMBRETES (backend/src/jobs/):
   - lembrete24h.ts: Cron job às 10:00 para agendamentos do dia seguinte
   - lembrete2h.ts: Cron job a cada hora para agendamentos nas próximas 2h
   - nps.ts: Cron job às 20:00 para enviar pesquisa NPS de agendamentos realizados

5. WEBHOOKS (backend/src/routers/webhooks.ts):
   - POST /webhooks/whatsapp - Mensagens WhatsApp
   - POST /webhooks/stripe - Pagamentos Stripe
   - POST /webhooks/google - Eventos Calendar

Todas as integrações devem:
- Ter retry com exponential backoff
- Logar erros com Winston
- Ter fallback (ex: SMS se WhatsApp falhar)
```

---

## CC-TIGRE-07: DASHBOARD AVANÇADO

```
Você é um desenvolvedor senior. Implemente o dashboard avançado do CRM Tigre.

MÉTRICAS (backend/src/routers/dashboard.ts):

1. KPIs Principais:
   - Faturamento (hoje, semana, mês, ano)
   - Agendamentos (total, confirmados, realizados, cancelados, no-show)
   - Taxa de conversão (leads -> agendamentos)
   - Ticket médio
   - NPS médio
   - Taxa de retenção

2. Gráficos:
   - Faturamento por período (linha)
   - Agendamentos por dia (barras)
   - Conversão funil (funil)
   - Top procedimentos (pizza)
   - Horários mais agendados (heatmap)

3. Relatórios:
   - Relatório diário (email automático)
   - Relatório semanal (PDF)
   - Relatório mensal (Excel)
   - Exportar dados (CSV)

FRONTEND (frontend/src/app/page.tsx):

1. Grid de 4 cards KPI no topo
2. Gráfico de faturamento (últimos 30 dias)
3. Gráfico de agendamentos (últimos 7 dias)
4. Lista de próximos agendamentos (hoje)
5. Atividade recente (últimas 10 ações)
6. Filtros: período, procedimento, profissional

COMPONENTES:
- KpiCard.tsx (valor, variação, ícone, cor)
- FaturamentoChart.tsx (Recharts LineChart)
- AgendamentosChart.tsx (Recharts BarChart)
- ConversaoFunil.tsx (Recharts FunnelChart)
- AtividadeRecente.tsx (lista com ícones)
- FiltrosPeriodo.tsx (select com datas)

Use TanStack Query com refetch automático a cada 5 minutos.
Adicione skeleton loading enquanto carrega.
Responsivo para mobile.
```

---

## CC-TIGRE-08: DEPLOY

```
Você é um desenvolvedor senior. Configure o deploy do CRM Tigre.

1. DOCKER (docker-compose.yml):
   - postgres:15 (porta 5432)
   - redis:7 (porta 6379)
   - backend (porta 4000)
   - frontend (porta 3000)
   - Volumes para persistência
   - Networks para comunicação

2. VERCEL (frontend):
   - vercel.json com configurações
   - Environment variables
   - Build command: npm run build
   - Output: .next

3. RAILWAY/RENDER (backend):
   - Dockerfile para backend
   - Environment variables
   - Health check endpoint
   - Auto-scaling config

4. SUPABASE (database):
   - Conexão via DATABASE_URL
   - Connection pooling (PgBouncer)
   - Backups automáticos

5. GITHUB ACTIONS (.github/workflows/):
   - ci.yml: Lint + Test em PRs
   - deploy.yml: Deploy automático em push to main
   - Secrets configurados

6. MONITORAMENTO:
   - Sentry para erros
   - DataDog para métricas
   - Uptime monitoring

ARQUIVOS A CRIAR:
- docker-compose.yml
- docker-compose.prod.yml
- backend/Dockerfile
- frontend/vercel.json
- .github/workflows/ci.yml
- .github/workflows/deploy.yml
- .env.example (todas as variáveis)

Após criar, execute:
docker-compose up -d
```

---

## 📋 ORDEM DE EXECUÇÃO

| # | Prompt | Dependência | Tempo Estimado |
|---|--------|-------------|----------------|
| 1 | CC-TIGRE-01 | Nenhuma | 30 min |
| 2 | CC-TIGRE-02 | CC-TIGRE-01 | 20 min |
| 3 | CC-TIGRE-03 | CC-TIGRE-02 | 60 min |
| 4 | CC-TIGRE-04 | CC-TIGRE-03 | 90 min |
| 5 | CC-TIGRE-05 | CC-TIGRE-03 | 45 min |
| 6 | CC-TIGRE-06 | CC-TIGRE-03 | 60 min |
| 7 | CC-TIGRE-07 | CC-TIGRE-04 | 45 min |
| 8 | CC-TIGRE-08 | Todos | 30 min |

**Total estimado:** ~6-8 horas de execução

---

## ⚡ EXECUÇÃO PARALELA

Você pode rodar em paralelo:
- **Aba 1:** CC-TIGRE-01 → CC-TIGRE-02 → CC-TIGRE-03
- **Aba 2:** (após CC-TIGRE-03) CC-TIGRE-04
- **Aba 3:** (após CC-TIGRE-03) CC-TIGRE-05
- **Aba 4:** (após CC-TIGRE-03) CC-TIGRE-06

Depois de todos terminarem:
- **Aba 1:** CC-TIGRE-07
- **Aba 2:** CC-TIGRE-08

---

**Documento:** Prompts Claude Code CRM Tigre
**Versão:** 2.0
**Data:** 14 de janeiro de 2026
