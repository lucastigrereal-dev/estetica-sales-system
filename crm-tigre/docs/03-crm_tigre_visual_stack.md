# 🐯 CRM TIGRE - VISUAL STACK & ARQUITETURA

## Diagrama de Arquitetura (7 Camadas)

```
┌─────────────────────────────────────────────────────────────┐
│ CAMADA 1: CLIENTE (Frontend)                                │
├─────────────────────────────────────────────────────────────┤
│ Next.js 14 (React 18) + TypeScript + TailwindCSS             │
│ ├─ Dashboard                                                 │
│ ├─ Pacientes (CRUD)                                          │
│ ├─ Agendamentos (Calendar)                                   │
│ ├─ Chat Anna (WebSocket)                                     │
│ ├─ Financeiro                                                │
│ └─ Relatórios                                                │
│ Deploy: Vercel (auto-scale, CDN global)                      │
└─────────────────────────────────────────────────────────────┘
                            ↓ API (tRPC + REST)
┌─────────────────────────────────────────────────────────────┐
│ CAMADA 2: API Gateway                                        │
├─────────────────────────────────────────────────────────────┤
│ tRPC (type-safe RPC)                                         │
│ ├─ Router: users, pacientes, agendamentos, chats            │
│ ├─ Auth middleware (JWT)                                     │
│ ├─ Rate limit (100 req/min)                                  │
│ └─ Error handling (global)                                   │
│ Deploy: Vercel Serverless                                    │
└─────────────────────────────────────────────────────────────┘
                            ↓ WebSocket + HTTP
┌─────────────────────────────────────────────────────────────┐
│ CAMADA 3: Backend (Node.js)                                  │
├─────────────────────────────────────────────────────────────┤
│ Express.js + TypeScript                                      │
│ ├─ Routes: CRUD, Auth, Upload                                │
│ ├─ Middleware: JWT, Cors, Logging                            │
│ ├─ Queue: Bull (para jobs async)                             │
│ ├─ WebSocket: Socket.io (real-time)                          │
│ └─ Scheduler: node-cron (tarefas agendadas)                  │
│ Deploy: Railway/Render (auto-scale)                          │
└─────────────────────────────────────────────────────────────┘
                            ↓ SQL + Cache
┌─────────────────────────────────────────────────────────────┐
│ CAMADA 4: Data Layer                                         │
├─────────────────────────────────────────────────────────────┤
│ Prisma ORM (type-safe queries)                               │
│ ├─ PostgreSQL (dados primários)                              │
│ │  ├─ Tabelas: Users, Pacientes, Agendamentos, Chats       │
│ │  ├─ Índices: Otimizados para query                        │
│ │  └─ Backups: 7 dias retenção                               │
│ │                                                            │
│ └─ Redis (cache + sessions)                                  │
│    ├─ Cache queries (1h)                                     │
│    ├─ Sessions usuário (24h)                                 │
│    └─ Rate limiting                                          │
│                                                              │
│ Deploy: Supabase (PostgreSQL managed)                        │
└─────────────────────────────────────────────────────────────┘
                            ↓ APIs Externas
┌─────────────────────────────────────────────────────────────┐
│ CAMADA 5: Integrações Externas                               │
├─────────────────────────────────────────────────────────────┤
│ ├─ OpenAI (Anna Chatbot + análise sentimento)               │
│ ├─ WhatsApp Business API (mensagens)                         │
│ ├─ Google Calendar API (sincronização)                       │
│ ├─ Stripe (pagamentos)                                       │
│ ├─ SendGrid (email)                                          │
│ ├─ AWS S3 (armazenamento fotos)                              │
│ └─ DocuSign (assinatura digital)                             │
│                                                              │
│ Middleware: Webhooks + Retry logic                           │
└─────────────────────────────────────────────────────────────┘
                            ↓ Monitoramento
┌─────────────────────────────────────────────────────────────┐
│ CAMADA 6: Observabilidade & Logs                             │
├─────────────────────────────────────────────────────────────┤
│ ├─ Sentry (error tracking)                                   │
│ ├─ DataDog (APM + performance)                               │
│ ├─ Winston (logging estruturado)                             │
│ ├─ Custom dashboards                                         │
│ └─ Alertas (Slack + SMS)                                     │
│                                                              │
│ Uptime: >99.9% | Latência: <200ms | Errors: <1%            │
└─────────────────────────────────────────────────────────────┘
                            ↓ DevOps
┌─────────────────────────────────────────────────────────────┐
│ CAMADA 7: CI/CD & Deployment                                │
├─────────────────────────────────────────────────────────────┤
│ GitHub Actions                                               │
│ ├─ Push → Tests (Jest + Playwright)                          │
│ ├─ Testes passam → Deploy staging                            │
│ ├─ Code review → Deploy produção                             │
│ ├─ Rollback automático se erro                               │
│ └─ Versioning semântico                                      │
│                                                              │
│ Ambientes: Dev → Staging → Produção                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Fluxo de Dados: Novo Agendamento

```
USER (Paciente)
    ↓
WhatsApp Input: "Quero agendar!"
    ↓
ANNA CHATBOT (OpenAI)
├─ Pergunta 1: "Qual procedimento?"
├─ Pergunta 2: "Qual data?"
├─ Pergunta 3: "Qual horário?"
└─ Pergunta 4: "Confirma?"
    ↓
API (tRPC - agendamentos.create)
    ↓
Backend Node.js
├─ Validação (horário livre?)
├─ Prisma ORM → PostgreSQL
│  └─ INSERT INTO agendamentos (paciente_id, horario, etc)
├─ Redis cache → invalida
├─ Bull Queue → enviar lembrete 24h depois
├─ Google Calendar API → sincroniza
└─ Stripe API → cobrar (se confirmou pagamento)
    ↓
Database (Supabase PostgreSQL)
├─ Nova linha criada
├─ Trigger: envia WhatsApp confirmação
└─ Log: audit trail
    ↓
Webhooks (assincrono)
├─ Slack: notifica você
├─ SendGrid: email confirmação
└─ Anna: "Pronto! Agendado para 15/01 14:30"
    ↓
USER recebe: WhatsApp ✅ confirmado
```

---

## Estrutura de Pastas

```
crm-tigre/
├─ app/
│  ├─ (auth)/
│  │  ├─ login/
│  │  ├─ signup/
│  │  └─ reset-password/
│  │
│  ├─ (dashboard)/
│  │  ├─ page.tsx (main dashboard)
│  │  ├─ pacientes/
│  │  │  ├─ page.tsx (lista)
│  │  │  ├─ [id]/
│  │  │  │  └─ page.tsx (detalhe)
│  │  │  ├─ novo/
│  │  │  │  └─ page.tsx (form novo)
│  │  │  └─ components/
│  │  ├─ agendamentos/
│  │  │  ├─ calendar/
│  │  │  ├─ novo/
│  │  │  └─ components/
│  │  ├─ financeiro/
│  │  ├─ relatorios/
│  │  ├─ automacoes/
│  │  └─ layout.tsx
│  │
│  ├─ api/
│  │  ├─ trpc/
│  │  │  ├─ [trpc].ts
│  │  │  └─ routers/
│  │  │     ├─ pacientes.ts
│  │  │     ├─ agendamentos.ts
│  │  │     ├─ chats.ts
│  │  │     ├─ financeiro.ts
│  │  │     └─ relatorios.ts
│  │  ├─ webhooks/
│  │  │  ├─ stripe.ts
│  │  │  ├─ whatsapp.ts
│  │  │  └─ google-calendar.ts
│  │  └─ auth/
│  │     ├─ [...nextauth].ts
│  │     └─ callback.ts
│  │
│  └─ layout.tsx
│
├─ src/
│  ├─ components/
│  ├─ lib/
│  ├─ styles/
│  ├─ types/
│  └─ context/
│
├─ server/
│  ├─ db/
│  ├─ services/
│  ├─ jobs/
│  ├─ middleware/
│  └─ utils/
│
├─ public/
├─ .env.example
├─ prisma.schema
├─ package.json
└─ README.md
```

---

## Comandos Essenciais

```bash
$ npm run dev          # Dev local
$ npm run type-check   # TypeScript
$ npm run lint         # ESLint
$ npm run test         # Jest
$ npm run db:push      # Sync schema
$ npm run build        # Build produção
```

---

## Benchmarks de Performance

```
Page Load: <3s
├─ Frontend: <1s
├─ API: <500ms
└─ Database: <200ms

API Response: <200ms (p95)
Uptime: >99.9%
Conversion: 62-65%
```

---

**Documento:** Visual Stack  
**Versão:** 1.0
