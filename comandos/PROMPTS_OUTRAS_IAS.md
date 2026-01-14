# 🤖 PROMPTS PRONTOS PARA OUTRAS IAs

Copie e cole esses prompts nas IAs indicadas. Cada prompt gera uma parte do sistema.

---

## 🦙 LLAMA (Local no VS Code ou Ollama)

### PROMPT L1: API Backend Completa
```
Crie uma API REST completa em Python usando FastAPI para um sistema de clínica de estética.

ENDPOINTS OBRIGATÓRIOS:

LEADS:
- POST /api/leads - Criar novo lead
  Body: { "nome": str, "telefone": str, "email": str?, "origem": str, "interesse": str }
- GET /api/leads - Listar leads com filtros (status, origem, data)
- GET /api/leads/{id} - Detalhes de um lead
- PUT /api/leads/{id} - Atualizar lead
- PUT /api/leads/{id}/status - Mudar status (novo, qualificado, agendado, convertido, perdido)
- POST /api/leads/{id}/convert - Converter lead em paciente

PACIENTES:
- POST /api/pacientes - Criar paciente
- GET /api/pacientes - Listar pacientes
- GET /api/pacientes/{id} - Detalhes com histórico

AGENDAMENTOS:
- POST /api/agendamentos - Criar agendamento
  Body: { "paciente_id": int, "procedimento_id": int, "data": datetime, "profissional": str }
- GET /api/agendamentos - Listar (filtro por data, profissional, status)
- PUT /api/agendamentos/{id}/confirmar - Confirmar
- PUT /api/agendamentos/{id}/cancelar - Cancelar
- GET /api/agendamentos/hoje - Agendamentos do dia
- GET /api/agendamentos/pendentes-confirmacao - Sem confirmação

PROCEDIMENTOS:
- GET /api/procedimentos - Listar todos
- POST /api/procedimentos - Criar novo
- PUT /api/procedimentos/{id} - Atualizar preço/duração

DASHBOARD:
- GET /api/dashboard/stats - Estatísticas gerais
  Retorna: { leads_hoje, agendamentos_hoje, taxa_conversao, faturamento_mes }

REQUISITOS TÉCNICOS:
- SQLite como banco de dados
- SQLAlchemy como ORM
- Pydantic para validação
- CORS habilitado para localhost:3000
- Documentação Swagger automática
- Tratamento de erros padronizado
- Logging configurado

ESTRUTURA DE ARQUIVOS:
/backend
├── app/
│   ├── __init__.py
│   ├── main.py (FastAPI app, CORS, routers)
│   ├── database.py (SQLAlchemy engine, session)
│   ├── models.py (SQLAlchemy models)
│   ├── schemas.py (Pydantic schemas)
│   └── routers/
│       ├── __init__.py
│       ├── leads.py
│       ├── pacientes.py
│       ├── agendamentos.py
│       ├── procedimentos.py
│       └── dashboard.py
├── requirements.txt
└── README.md

Gere todos os arquivos completos e funcionais.
```

---

### PROMPT L2: Scripts de Integração Kommo
```
Crie 4 scripts Python para integrar com a API da Kommo (amoCRM).

CONTEXTO:
- Tenho leads na Kommo que não respondem pela API oficial
- Quero exportar esses leads, disparar via WaSender, e reimportar quando responderem

SCRIPT 1: kommo_export.py
```python
# Funcionalidades:
# - Conecta na API Kommo usando token
# - Busca leads com status específico (ex: "sem_resposta", "lead_frio")
# - Filtra apenas os que têm telefone válido
# - Exporta para Excel no formato:
#   | Nome | Telefone | Email | Tags | Data_Criacao |
# - Salva em: exports/leads_para_disparo_YYYYMMDD.xlsx

# Argumentos CLI:
# --status: filtrar por status (default: "sem_resposta")
# --pipeline: ID do pipeline (opcional)
# --limit: máximo de leads (default: 500)
```

SCRIPT 2: prepare_campaign.py
```python
# Funcionalidades:
# - Lê o Excel exportado
# - Valida números de telefone (formato brasileiro)
# - Remove duplicados
# - Divide em lotes de N números
# - Gera arquivos: lote_01.xlsx, lote_02.xlsx, etc
# - Gera relatório: total_leads, total_lotes, estimativa_tempo

# Argumentos CLI:
# --input: caminho do Excel
# --lote: tamanho do lote (default: 50)
# --output: pasta de saída (default: exports/)
```

SCRIPT 3: track_responses.py
```python
# Funcionalidades:
# - Monitora pasta /responses/ em tempo real
# - Aceita arquivos Excel ou CSV exportados do WaSender
# - Identifica números que responderam
# - Cruza com a lista original de disparos
# - Gera lista de "responderam" para reimportar

# Argumentos CLI:
# --watch: modo contínuo (monitora a cada 30s)
# --input: processar arquivo específico
```

SCRIPT 4: kommo_import.py
```python
# Funcionalidades:
# - Lê lista de números que responderam
# - Busca o lead correspondente na Kommo
# - Adiciona tag "Respondeu_WaSender"
# - Move para pipeline/status específico
# - Loga todas as operações

# Argumentos CLI:
# --input: arquivo com números que responderam
# --tag: tag a adicionar (default: "Respondeu_WaSender")
# --pipeline: mover para este pipeline (opcional)
```

REQUISITOS:
- Usar requests para API
- Usar openpyxl para Excel
- Usar python-dotenv para configuração
- Usar argparse para CLI
- Usar logging para logs
- Tratar rate limits da API (429)
- Configuração via .env:
  KOMMO_SUBDOMAIN=sua-empresa
  KOMMO_API_KEY=seu_token
  KOMMO_PIPELINE_ID=12345

Gere os 4 scripts completos e funcionais.
```

---

## 🤖 CLAUDE CODE (VS Code)

### PROMPT C1: Frontend Dashboard React
```
Crie um dashboard completo em React + TypeScript + TailwindCSS para uma clínica de estética.

PÁGINAS:

1. DASHBOARD (/)
   - Card: Leads Hoje (número + variação vs ontem)
   - Card: Agendamentos Hoje (número + lista resumida)
   - Card: Taxa de Conversão (% + gráfico mini)
   - Card: Faturamento do Mês (R$ + meta)
   - Gráfico: Leads por dia (últimos 7 dias)
   - Lista: Próximos agendamentos (5 itens)

2. LEADS (/leads)
   - Filtros: Status, Origem, Data, Busca por nome/telefone
   - Tabela com colunas: Nome, Telefone, Origem, Status, Data, Ações
   - Ações: Ver detalhes, Mudar status, Converter, Excluir
   - Paginação
   - Botão: Novo Lead (abre modal)
   - Modal de criação/edição

3. AGENDAMENTOS (/agendamentos)
   - Visualização: Calendário (semana) ou Lista
   - Filtros: Data, Profissional, Status
   - Criar agendamento (modal)
   - Ações: Confirmar, Cancelar, Reagendar
   - Cores por status: Pendente (amarelo), Confirmado (verde), Cancelado (vermelho)

4. PACIENTES (/pacientes)
   - Lista com busca
   - Detalhes: Dados pessoais, Histórico de procedimentos, Agendamentos
   - Editar dados

COMPONENTES:
- Layout com Sidebar fixa
- Header com busca global e notificações
- Cards de estatísticas
- Tabela reutilizável com ordenação e filtros
- Modal reutilizável
- Formulários com validação
- Toast para notificações
- Loading states

INTEGRAÇÃO:
- API base: http://localhost:8000/api
- Usar React Query para cache e refetch
- Usar React Router para navegação
- Usar React Hook Form para formulários
- Usar date-fns para datas

ESTRUTURA:
/frontend
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   ├── Cards/
│   │   ├── Table/
│   │   ├── Modal/
│   │   ├── Forms/
│   │   └── Charts/
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Leads.tsx
│   │   ├── Agendamentos.tsx
│   │   └── Pacientes.tsx
│   ├── hooks/
│   │   ├── useLeads.ts
│   │   ├── useAgendamentos.ts
│   │   └── useDashboard.ts
│   ├── services/
│   │   └── api.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts

Gere todos os arquivos completos. Use design moderno e limpo.
```

---

### PROMPT C2: Integração Whaticket + N8N
```
Crie um serviço Node.js que faz a ponte entre Whaticket e N8N.

FUNCIONALIDADES:

1. WEBHOOK RECEIVER (recebe do Whaticket)
   - POST /webhook/whaticket
   - Eventos: message.received, ticket.created, ticket.updated
   - Valida assinatura/token
   - Formata payload para N8N

2. WEBHOOK SENDER (envia para N8N)
   - Envia eventos formatados para N8N webhook
   - Retry em caso de falha (3 tentativas)
   - Log de todas as requisições

3. CALLBACK RECEIVER (recebe resposta do N8N)
   - POST /callback/n8n
   - Recebe resposta da IA
   - Envia de volta para Whaticket via API

4. API DO WHATICKET
   - Enviar mensagem para ticket
   - Atualizar status do ticket
   - Adicionar tag ao contato

ESTRUTURA:
/integrations/whaticket-bridge
├── src/
│   ├── index.ts (Express server)
│   ├── routes/
│   │   ├── webhook.ts
│   │   └── callback.ts
│   ├── services/
│   │   ├── whaticket.ts
│   │   └── n8n.ts
│   ├── utils/
│   │   ├── logger.ts
│   │   └── retry.ts
│   └── types.ts
├── package.json
├── tsconfig.json
└── .env.example

VARIÁVEIS DE AMBIENTE:
WHATICKET_API_URL=https://seu-whaticket.com/api
WHATICKET_API_TOKEN=xxx
N8N_WEBHOOK_URL=http://localhost:5678/webhook/xxx
PORT=3001

Gere todos os arquivos completos e funcionais.
```

---

## 🔍 PERPLEXITY / GENSPARK (Pesquisa)

### PROMPT P1: Fluxo N8N para WhatsApp + IA
```
Pesquise e crie um fluxo N8N completo (JSON) para automação de WhatsApp com IA.

O FLUXO DEVE:

1. RECEBER mensagens do WhatsApp via webhook
   - Compatível com Evolution API ou Baileys
   - Extrair: número, nome, mensagem, timestamp

2. CLASSIFICAR INTENÇÃO com OpenAI
   - Categorias: interesse, agendar, preço, dúvida, reclamação, outro
   - Extrair: procedimento mencionado, urgência, sentimento

3. DECIDIR AÇÃO baseado na classificação:
   - interesse → Responder com info + oferecer agendamento
   - agendar → Oferecer horários disponíveis
   - preço → Enviar tabela de preços
   - dúvida → Responder com FAQ
   - reclamação → Escalar para humano

4. GERAR RESPOSTA com OpenAI
   - Tom: profissional mas amigável
   - Máximo 300 caracteres
   - Incluir emoji quando apropriado
   - Sempre oferecer próximo passo

5. ENVIAR RESPOSTA via WhatsApp API

6. SALVAR no banco de dados (SQLite ou Postgres)
   - Mensagem original
   - Classificação
   - Resposta enviada
   - Timestamp

FORNEÇA:
1. JSON completo do workflow N8N
2. Instruções de importação
3. Variáveis que precisam ser configuradas
4. Exemplo de payload de entrada e saída
```

---

### PROMPT P2: Documentação de Instalação
```
Crie documentação completa de instalação para um sistema de vendas de clínica de estética.

ESTRUTURA:

1. REQUISITOS DO SISTEMA
   - Hardware mínimo (RAM, CPU, Disco)
   - Software necessário (Python, Node, Docker)
   - Contas necessárias (GitHub, OpenAI, Kommo)

2. INSTALAÇÃO WINDOWS (passo a passo)
   - Instalar Python 3.11
   - Instalar Node.js 18
   - Instalar Docker Desktop
   - Instalar Git
   - Clonar repositório
   - Configurar variáveis de ambiente
   - Subir serviços
   - Testar

3. INSTALAÇÃO LINUX/VPS (passo a passo)
   - Atualizar sistema
   - Instalar dependências
   - Configurar firewall
   - Instalar Docker
   - Clonar e configurar
   - Configurar como serviço (systemd)
   - Configurar SSL (Certbot)

4. CONFIGURAÇÃO
   - Arquivo .env explicado linha por linha
   - Configurar Kommo API
   - Configurar OpenAI API
   - Configurar WhatsApp (Evolution API)

5. PRIMEIRO USO
   - Acessar dashboard
   - Criar primeiro lead
   - Testar agendamento
   - Testar automação

6. TROUBLESHOOTING
   - Erros comuns e soluções
   - Logs e debugging
   - Suporte

Formato: Markdown com screenshots placeholder [SCREENSHOT: descrição]
Linguagem: Português brasileiro, clara e direta
```

---

## 💻 GPT CODEX (CMD/Terminal)

### PROMPT G1: Docker Compose Completo
```
Crie um docker-compose.yml completo para um sistema com:

SERVIÇOS:
1. backend (Python FastAPI)
   - Porta 8000
   - Volume para código (hot reload)
   - Depende do db

2. frontend (React Vite)
   - Porta 3000
   - Volume para código
   - Depende do backend

3. n8n (Automação)
   - Porta 5678
   - Volume para dados persistentes
   - Variáveis de ambiente para config

4. db (SQLite ou Postgres)
   - Volume para dados persistentes

REQUISITOS:
- Rede interna entre serviços
- Volumes nomeados para persistência
- Health checks
- Restart policy
- Variáveis via .env
- Profiles para dev/prod

TAMBÉM CRIE:
- Dockerfile.backend
- Dockerfile.frontend
- .env.example
- Makefile com comandos úteis (make up, make down, make logs, etc)
```

---

### PROMPT G2: Script de Backup Automático
```
Crie um script bash completo para backup automático do sistema.

FUNCIONALIDADES:
1. Backup do banco de dados SQLite
2. Backup dos arquivos de configuração
3. Backup dos workflows N8N
4. Compactar com data no nome (backup_YYYYMMDD_HHMMSS.tar.gz)
5. Enviar para Google Drive via rclone
6. Manter apenas últimos 7 dias localmente
7. Manter apenas últimos 30 dias no Drive
8. Enviar notificação de sucesso/falha (opcional: Telegram ou Email)

TAMBÉM CRIE:
- Instruções de configuração do rclone
- Crontab para agendar diariamente às 3h
- Script de restore
- Documentação
```

---

## 📋 ORDEM DE EXECUÇÃO DOS PROMPTS

| Ordem | Prompt | IA | Tempo Est. | Dependência |
|-------|--------|-----|------------|-------------|
| 1 | L1 (API Backend) | Llama | 30min | Nenhuma |
| 2 | L2 (Scripts Kommo) | Llama | 20min | Nenhuma |
| 3 | G1 (Docker) | GPT Codex | 15min | L1 |
| 4 | P1 (Fluxo N8N) | Perplexity | 20min | Nenhuma |
| 5 | C1 (Frontend) | Claude | 45min | L1 |
| 6 | C2 (Whaticket Bridge) | Claude | 20min | P1 |
| 7 | P2 (Documentação) | Perplexity | 30min | Todos |
| 8 | G2 (Backup) | GPT Codex | 15min | G1 |

---

## 💡 DICAS DE USO

1. **Copie o prompt INTEIRO** - não edite antes de colar
2. **Se a IA pedir mais detalhes** - responda com contexto do seu negócio
3. **Se o código tiver erro** - cole o erro de volta na IA
4. **Salve cada resultado** - na pasta correta do repositório
5. **Faça commit após cada prompt** - para não perder progresso
