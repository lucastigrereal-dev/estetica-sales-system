# 🐯 CRM TIGRE - ARQUITETURA TÉCNICA COMPLETA

## STACK TECHNOLOGIES (9 Tecnologias)

### 1. Frontend (Next.js 14)
```
Next.js 14 + React 18 + TypeScript
├─ Framework: Next.js App Router
├─ Styling: TailwindCSS 3.4
├─ UI Components: Radix UI
├─ State Management: TanStack Query + Zustand
├─ Forms: React Hook Form + Zod
├─ Charts: Recharts
├─ Real-time: Socket.io client
├─ Testing: Jest + Playwright
└─ Build: Vercel Deploy
```

### 2. Backend (Node.js + tRPC)
```
Node.js 20 + Express + TypeScript
├─ API: tRPC (type-safe RPC)
├─ REST: Express.js
├─ Queue: Bull (job processing)
├─ Real-time: Socket.io
├─ Scheduling: node-cron
├─ Auth: NextAuth.js + JWT
├─ Validation: Zod
├─ Logging: Winston
└─ Deploy: Railway/Render
```

### 3. Database (PostgreSQL)
```
PostgreSQL + Prisma ORM
├─ Primary: PostgreSQL (Supabase)
├─ Cache: Redis
├─ ORM: Prisma
├─ Migrations: Prisma Migrate
├─ Backups: 7-day retention
├─ Replication: Automatic
├─ Connection Pool: PgBouncer
└─ Monitoring: DataDog
```

### 4. AI/ML (OpenAI)
```
OpenAI API (GPT-4)
├─ Chat: gpt-4-turbo-preview
├─ Embeddings: text-embedding-3-large
├─ Functions: OpenAI Functions
├─ Rate Limit: 20 req/min
├─ Cost: ~R$200/mês
├─ Fallback: Claude API (backup)
└─ Caching: Redis embeddings
```

### 5. Messaging (WhatsApp)
```
WhatsApp Business API
├─ Provider: Twilio (recomendado)
├─ 2-way messaging
├─ Template messages
├─ Quick replies
├─ Media upload
├─ Webhooks
└─ Cost: R$0.05-0.10/msg
```

### 6. Payments (Stripe)
```
Stripe API
├─ Payment Processing
├─ Credit cards + Pix
├─ Webhooks (charge.succeeded)
├─ Invoicing
├─ Refunds
├─ 3D Secure
├─ Fee: 2.99% + R$0.30
└─ PCI Compliance: Stripe handles
```

### 7. Calendar (Google)
```
Google Calendar API
├─ 2-way sync
├─ Event creation
├─ Free slot detection
├─ Reminders
├─ Notifications
├─ Guest invites
└─ Rate Limit: 1000 req/day
```

### 8. Email (SendGrid)
```
SendGrid API
├─ Email delivery
├─ Templates
├─ Batch sending
├─ Open tracking
├─ Click tracking
├─ Bounce handling
├─ Rate: 100 emails/day free
└─ Cost: R$0.50-5 per 10k emails
```

### 9. Storage (AWS S3)
```
AWS S3 + CloudFront
├─ Image storage
├─ Video upload (opcional)
├─ CDN delivery
├─ Compression: ImageOptim
├─ Lifecycle: 90 days -> Glacier
├─ Encryption: AES-256
├─ CORS enabled
└─ Cost: R$0.05 per GB
```

---

## DATABASE SCHEMA (50+ Tabelas)

### Usuários
```sql
-- users (clínicas/admin)
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  senha HASH,
  nome VARCHAR(255),
  telefone VARCHAR(20),
  data_criacao TIMESTAMP,
  data_ultimoacesso TIMESTAMP,
  ativo BOOLEAN,
  role ENUM('admin','staff','view')
);

-- clinicas
CREATE TABLE clinicas (
  id UUID PRIMARY KEY,
  user_id UUID FK,
  nome VARCHAR(255),
  cnpj VARCHAR(20),
  endereco TEXT,
  telefone VARCHAR(20),
  logo_url VARCHAR(500),
  data_criacao TIMESTAMP
);
```

### Pacientes
```sql
-- pacientes
CREATE TABLE pacientes (
  id UUID PRIMARY KEY,
  clinica_id UUID FK,
  nome VARCHAR(255),
  email VARCHAR(255),
  telefone VARCHAR(20),
  whatsapp VARCHAR(20),
  cpf VARCHAR(15),
  data_nascimento DATE,
  genero ENUM('M','F','Outro'),
  endereco TEXT,
  numero_procedimentos INT DEFAULT 0,
  procedimento_favorito VARCHAR(255),
  data_criacao TIMESTAMP,
  data_ultimocontato TIMESTAMP,
  status ENUM('ativo','inativo','bloqueado'),
  classificacao ENUM('ouro','prata','bronze','novo')
);

-- pacientes_telefones (múltiplos telefones)
CREATE TABLE pacientes_telefones (
  id UUID PRIMARY KEY,
  paciente_id UUID FK,
  numero VARCHAR(20),
  tipo ENUM('celular','comercial','residencial'),
  principal BOOLEAN
);

-- pacientes_enderecos
CREATE TABLE pacientes_enderecos (
  id UUID PRIMARY KEY,
  paciente_id UUID FK,
  rua VARCHAR(255),
  numero VARCHAR(10),
  complemento VARCHAR(255),
  bairro VARCHAR(100),
  cidade VARCHAR(100),
  estado VARCHAR(2),
  cep VARCHAR(10),
  tipo ENUM('residencial','comercial'),
  principal BOOLEAN
);
```

### Procedimentos
```sql
-- procedimentos
CREATE TABLE procedimentos (
  id UUID PRIMARY KEY,
  clinica_id UUID FK,
  nome VARCHAR(255),
  descricao TEXT,
  duracao_minutos INT,
  preco_padrao DECIMAL(10,2),
  categoria ENUM('facial','corporal','capilar','outra'),
  ativo BOOLEAN,
  imagem_url VARCHAR(500),
  data_criacao TIMESTAMP
);

-- procedimentos_preco (pricing dinâmico)
CREATE TABLE procedimentos_preco (
  id UUID PRIMARY KEY,
  procedimento_id UUID FK,
  preco DECIMAL(10,2),
  validaidade_de DATE,
  validade_ate DATE
);
```

### Agendamentos
```sql
-- agendamentos
CREATE TABLE agendamentos (
  id UUID PRIMARY KEY,
  clinica_id UUID FK,
  paciente_id UUID FK,
  procedimento_id UUID FK,
  profissional_id UUID FK,
  data_agendamento TIMESTAMP,
  duracao_minutos INT,
  status ENUM('agendado','confirmado','realizado','cancelado','no_show'),
  preco DECIMAL(10,2),
  pagamento_status ENUM('pendente','pago','reembolsado'),
  notas TEXT,
  data_criacao TIMESTAMP,
  data_atualizacao TIMESTAMP,
  google_event_id VARCHAR(255),
  lembrete_24h_enviado BOOLEAN,
  lembrete_2h_enviado BOOLEAN
);

-- agendamentos_confirmacoes
CREATE TABLE agendamentos_confirmacoes (
  id UUID PRIMARY KEY,
  agendamento_id UUID FK,
  canal ENUM('whatsapp','sms','email'),
  data_envio TIMESTAMP,
  lido BOOLEAN,
  data_leitura TIMESTAMP
);
```

### Pagamentos
```sql
-- pagamentos
CREATE TABLE pagamentos (
  id UUID PRIMARY KEY,
  agendamento_id UUID FK,
  paciente_id UUID FK,
  clinica_id UUID FK,
  valor DECIMAL(10,2),
  metodo ENUM('cartao','pix','boleto','dinheiro'),
  status ENUM('pendente','processando','aprovado','recusado','reembolsado'),
  stripe_payment_id VARCHAR(255),
  data_criacao TIMESTAMP,
  data_processamento TIMESTAMP,
  descricao TEXT
);

-- pagamentos_recorrentes
CREATE TABLE pagamentos_recorrentes (
  id UUID PRIMARY KEY,
  paciente_id UUID FK,
  valor DECIMAL(10,2),
  dia_mes INT,
  status ENUM('ativo','suspenso','cancelado'),
  proxima_data DATE,
  stripe_subscription_id VARCHAR(255)
);
```

### Chats (Anna)
```sql
-- chats_conversas
CREATE TABLE chats_conversas (
  id UUID PRIMARY KEY,
  clinica_id UUID FK,
  paciente_whatsapp VARCHAR(20),
  data_inicio TIMESTAMP,
  data_ultima_mensagem TIMESTAMP,
  status ENUM('aberta','convertida','abandonada','spam'),
  conversao_agendamento_id UUID FK
);

-- chats_mensagens
CREATE TABLE chats_mensagens (
  id UUID PRIMARY KEY,
  conversa_id UUID FK,
  sender ENUM('anna','paciente'),
  mensagem TEXT,
  tipo ENUM('texto','imagem','documento'),
  data_envio TIMESTAMP,
  lido BOOLEAN,
  data_leitura TIMESTAMP,
  score_sentimento DECIMAL(3,2)
);

-- chats_qualificacao
CREATE TABLE chats_qualificacao (
  id UUID PRIMARY KEY,
  conversa_id UUID FK,
  score DECIMAL(3,0),
  interessado ENUM('sim','nao','talvez'),
  procedimento_interesse VARCHAR(255),
  date_preferida DATE,
  horario_preferido VARCHAR(10),
  telefone_confirmado VARCHAR(20)
);
```

### Feedback & Reviews
```sql
-- pesquisas_nps
CREATE TABLE pesquisas_nps (
  id UUID PRIMARY KEY,
  agendamento_id UUID FK,
  paciente_id UUID FK,
  score INT (0-10),
  comentario TEXT,
  data_envio TIMESTAMP,
  data_resposta TIMESTAMP,
  respondido BOOLEAN
);

-- avaliacoes
CREATE TABLE avaliacoes (
  id UUID PRIMARY KEY,
  agendamento_id UUID FK,
  paciente_id UUID FK,
  profissional_id UUID FK,
  rating INT (1-5),
  comentario TEXT,
  data_criacao TIMESTAMP
);
```

### Fidelização
```sql
-- pontos_programa
CREATE TABLE pontos_programa (
  id UUID PRIMARY KEY,
  clinica_id UUID FK,
  paciente_id UUID FK,
  saldo INT,
  pontos_totais_acumulados INT,
  data_criacao TIMESTAMP,
  data_atualizacao TIMESTAMP,
  nivel ENUM('bronze','prata','ouro','platina'),
  data_proximo_nivel DATE
);

-- pontos_transacoes
CREATE TABLE pontos_transacoes (
  id UUID PRIMARY KEY,
  pontos_programa_id UUID FK,
  tipo ENUM('creditados','resgatados','expirados'),
  quantidade INT,
  motivo VARCHAR(255),
  data_transacao TIMESTAMP,
  referencia_agendamento_id UUID FK
);

-- descontos_programa
CREATE TABLE descontos_programa (
  id UUID PRIMARY KEY,
  clinica_id UUID FK,
  nome VARCHAR(255),
  descricao TEXT,
  pontos_necessarios INT,
  desconto_valor DECIMAL(10,2),
  desconto_percentual DECIMAL(5,2),
  validade_dias INT,
  uso_maximo INT,
  data_criacao TIMESTAMP
);
```

### Analytics & Reports
```sql
-- dashboard_metricas
CREATE TABLE dashboard_metricas (
  id UUID PRIMARY KEY,
  clinica_id UUID FK,
  data DATE,
  faturamento_dia DECIMAL(10,2),
  agendamentos_dia INT,
  no_shows_dia INT,
  conversoes_dia INT,
  novos_pacientes_dia INT,
  atendimentos_realizados INT,
  ticket_medio DECIMAL(10,2)
);

-- analytics_eventos
CREATE TABLE analytics_eventos (
  id UUID PRIMARY KEY,
  clinica_id UUID FK,
  tipo_evento VARCHAR(100),
  descricao TEXT,
  paciente_id UUID FK,
  data_evento TIMESTAMP,
  dados_adicionais JSONB
);
```

---

## 8 MÓDULOS FUNCIONAIS

### 1. Pacientes
```
CRUD Pacientes
├─ Criar paciente
├─ Editar informações
├─ Deletar paciente
├─ Buscar/Filtrar
├─ Histórico agendamentos
├─ Tags/Classificação
├─ Contatos múltiplos
└─ Endereços múltiplos
```

### 2. Agendamentos
```
Calendário & Agendamentos
├─ Vista dia/semana/mês
├─ Novo agendamento (wizard)
├─ Editar agendamento
├─ Cancelar com motivo
├─ Sincronização Google Calendar
├─ Detecção slots livres
├─ Bloqueio horário
└─ Exportar calendar
```

### 3. Chat (Anna)
```
WhatsApp + IA
├─ Receber mensagens
├─ Análise automática
├─ 4 perguntas qualificação
├─ Score de interesse (0-100)
├─ Sugestão agendamento
├─ Confirmação via botão
├─ Histórico conversa
└─ Analytics chat
```

### 4. Lembretes
```
Automação de Lembros
├─ Lembrete 24h antes
├─ Lembrete 2h antes
├─ Confirmação 1-tap
├─ Cancelamento 1-tap
├─ SMS backup
├─ Email backup
├─ Customizar mensagens
└─ Taxa sucesso tracking
```

### 5. Pagamentos
```
Stripe Integration
├─ Cobrança automática
├─ Link de pagamento
├─ Recorrente (mensal)
├─ Pix (instant)
├─ Comprovante digital
├─ Reembolso
├─ Split comissão
└─ Reconciliação
```

### 6. Pesquisa & Feedback
```
NPS + Análise Sentimento
├─ Pesquisa NPS automática
├─ Análise sentimento IA
├─ Recomendação upsell
├─ Oferta personalizada
├─ Reativação campanhas
├─ Follow-up automático
└─ Score tracking
```

### 7. Dashboard & Reports
```
Analytics & Business Intelligence
├─ KPI Dashboard
├─ Gráficos receita
├─ Tabela procedimentos
├─ Performance profissional
├─ Análise cohort
├─ Lifetime value (CLV)
├─ Previsões (ML)
└─ Export PDF/Excel
```

### 8. Administração
```
Settings & Operações
├─ Configurações clínica
├─ Profissionais/Horários
├─ Procedimentos & Preços
├─ Integração APIs
├─ Backup & Restore
├─ Auditoria (logs)
├─ Permissões usuários
└─ Temas & Customização
```

---

## 6 FLUXOS DE AUTOMAÇÃO

### 1. Lead → Cliente
```
Lead entra no WhatsApp
    ↓
Anna faz 4 perguntas
    ↓
Qualifica (score 0-100)
    ↓
Se score > 70:
  ├─ Sugerir agendamento
  ├─ Mostrar slots disponíveis
  ├─ Confirmar data/hora
  └─ Cobrar (Stripe)
    ↓
Se confirmado:
  ├─ Criar agendamento
  ├─ Enviar Google Calendar invite
  ├─ Agendar lembrete 24h
  ├─ Agendar lembrete 2h
  └─ Notificar clínica (Slack)
```

### 2. Lembrete 24h
```
Agendamento criado
    ↓
+24h antes:
  ├─ Enviar WhatsApp
  ├─ Incluir link confirmar/cancelar
  ├─ Registrar se leu
  └─ Log no banco
    ↓
Se cancelou:
  ├─ Marcar agendamento como cancelado
  ├─ Liberar horário
  ├─ Remover lembretes pendentes
  └─ Notificar clínica
```

### 3. Lembrete 2h
```
Agendamento confirmado
    ↓
+2h antes:
  ├─ Enviar SMS (backup)
  ├─ Enviar email (backup)
  ├─ Log tentativas
  └─ Registrar resposta
    ↓
Se não confirmou ainda:
  ├─ Enviar WhatsApp com local
  ├─ Horário
  └─ Telefone clínica
```

### 4. Pesquisa NPS
```
Agendamento realizado (marked done)
    ↓
+24h depois:
  ├─ Enviar pesquisa NPS
  ├─ "Quanto 0-10?"
  └─ Coletar resposta
    ↓
Análise sentimento:
  ├─ Se NPS 0-6: Insatisfeito
  │  └─ Enviar cupom desconto
  ├─ Se NPS 7-8: Neutro
  │  └─ Enviar feedback form
  └─ Se NPS 9-10: Promotor
     └─ Enviar upsell
```

### 5. Upsell Inteligente
```
Cliente satisfeito (NPS 9-10)
    ↓
Anna analisa:
  ├─ Histórico procedimentos
  ├─ Padrão de compra
  ├─ Valor CLV
  └─ Margem por procedimento
    ↓
Recomenda procedimento:
  ├─ "Você pode testar Botox"
  ├─ Mostrar foto antes/depois
  ├─ Oferecer desconto 10%
  └─ Link agendamento direto
    ↓
Se agendou:
  └─ Sucesso! CLV +42%
```

### 6. Reativação
```
Paciente inativo (>90 dias sem agendamento)
    ↓
ML detecta risco abandono:
  ├─ Análise comportamento
  ├─ Comparar com cohort
  └─ Score risco (0-100)
    ↓
Se score > 70:
  ├─ Enviar "saudade" message
  ├─ Oferecer desconto especial
  ├─ Usar foto de sucesso anterior
  └─ Link agendamento
    ↓
Se retornou:
  ├─ Registrar reativação
  ├─ MLmodel aprende
  └─ +R$42k/mês receita
```

---

## 9 INTEGRAÇÕES EXTERNAS

| Integração | Função | API | Custo |
|-----------|--------|-----|-------|
| **OpenAI** | Chatbot Anna | gpt-4 | R$200/mês |
| **WhatsApp** | Mensagens | Twilio | R$0.05/msg |
| **Google Calendar** | Sincronização | API | Grátis |
| **Stripe** | Pagamentos | REST API | 2.99% |
| **SendGrid** | Email | SMTP | R$5/10k msgs |
| **AWS S3** | Fotos | REST API | R$0.05/GB |
| **Sentry** | Error tracking | REST API | R$29/mês |
| **DataDog** | Monitoring | API | R$15/host |
| **DocuSign** | Assinatura | REST API | R$20/mês |

---

## API ENDPOINTS (tRPC Routers)

```typescript
// users
trpc.users.login.mutate()
trpc.users.logout.mutate()
trpc.users.profile.query()
trpc.users.updateProfile.mutate()

// pacientes
trpc.pacientes.list.query()
trpc.pacientes.create.mutate()
trpc.pacientes.update.mutate()
trpc.pacientes.delete.mutate()
trpc.pacientes.getById.query()

// agendamentos
trpc.agendamentos.list.query()
trpc.agendamentos.create.mutate()
trpc.agendamentos.confirm.mutate()
trpc.agendamentos.cancel.mutate()
trpc.agendamentos.getSlots.query()

// chats
trpc.chats.list.query()
trpc.chats.getConversa.query()
trpc.chats.enviarMensagem.mutate()

// pagamentos
trpc.pagamentos.create.mutate()
trpc.pagamentos.webhook.mutate()

// dashboard
trpc.dashboard.getKpis.query()
trpc.dashboard.getGrafico.query()

// relatorios
trpc.relatorios.getMensal.query()
trpc.relatorios.getAnalitica.query()
trpc.relatorios.exportPdf.query()
```

---

## SEGURANÇA & LGPD

```
Autenticação:
├─ NextAuth.js (JWT)
├─ Hash senha: bcrypt
└─ Session timeout: 24h

Autorização:
├─ RBAC (Role-Based)
├─ Admin, Staff, View
└─ Row-level security

Criptografia:
├─ HTTPS/TLS 1.3
├─ Database: AES-256
├─ API Keys: encrypted
└─ Backup: encrypted

LGPD Compliance:
├─ Consentimento explícito
├─ Direito de deleção
├─ Direito de portabilidade
├─ Privacy policy
├─ Data retention (5 anos)
└─ Audit logs (24 meses)
```

---

**Documento:** Arquitetura Técnica Completa  
**Versão:** 2.0  
**Data:** 14 de janeiro de 2026  
**Status:** ✅ Pronto para implementação
