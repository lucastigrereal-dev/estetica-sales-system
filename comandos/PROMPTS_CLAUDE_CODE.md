# 🤖 PROMPTS PARA CLAUDE CODE (CMD)

**Como usar:** Abra o Claude Code no terminal, cole o prompt e deixe ele executar.

---

## 📋 ORDEM DE EXECUÇÃO

| Aba | Prompt | O que cria | Tempo |
|-----|--------|------------|-------|
| 1 | CC1 | API Backend completa | 5min |
| 2 | CC2 | Scripts Kommo | 3min |
| 3 | CC3 | Docker + Configs | 2min |
| 4 | CC4 | Frontend Dashboard | 8min |
| 5 | CC5 | Fluxos N8N | 3min |
| 6 | CC6 | Integração Whaticket | 3min |

---

## CC1: API BACKEND (FastAPI)

```
Crie a API backend completa para o sistema de clínica de estética.

DIRETÓRIO: /home/ubuntu/estetica-sales-system/backend/

CRIAR ARQUIVOS:

1. backend/requirements.txt:
fastapi==0.109.0
uvicorn==0.27.0
sqlalchemy==2.0.25
pydantic==2.5.3
python-dotenv==1.0.0
openpyxl==3.1.2

2. backend/app/database.py:
- SQLite em ../database/estetica.db
- Engine e SessionLocal
- Base declarativa

3. backend/app/models.py:
- Lead (id, nome, telefone, email, origem, interesse, status, created_at)
- Paciente (id, nome, telefone, email, lead_id, created_at)
- Agendamento (id, paciente_id, procedimento_id, data, profissional, status, confirmado)
- Procedimento (id, nome, preco, duracao_min)

4. backend/app/schemas.py:
- Pydantic schemas para cada model (Create, Update, Response)

5. backend/app/routers/leads.py:
- POST /leads
- GET /leads (filtros: status, origem)
- GET /leads/{id}
- PUT /leads/{id}/status
- POST /leads/{id}/convert

6. backend/app/routers/agendamentos.py:
- POST /agendamentos
- GET /agendamentos (filtros: data, profissional)
- PUT /agendamentos/{id}/confirmar
- PUT /agendamentos/{id}/cancelar

7. backend/app/routers/dashboard.py:
- GET /dashboard/stats (leads_hoje, agendamentos_hoje, taxa_conversao)

8. backend/app/main.py:
- FastAPI app
- CORS para localhost:3000
- Include routers
- Criar tabelas on startup

Após criar, execute: cd backend && pip install -r requirements.txt && python -m uvicorn app.main:app --reload
```

---

## CC2: SCRIPTS KOMMO

```
Crie os scripts de integração com Kommo para exportar e importar leads.

DIRETÓRIO: /home/ubuntu/estetica-sales-system/scripts/kommo/

CRIAR ARQUIVOS:

1. scripts/kommo/config.py:
- Carregar .env (KOMMO_SUBDOMAIN, KOMMO_API_KEY)
- Classe KommoClient com métodos para API

2. scripts/kommo/kommo_export.py:
- Argparse: --status (default: sem_resposta), --limit (default: 500)
- Buscar leads na API Kommo
- Filtrar por status
- Exportar para Excel: exports/leads_YYYYMMDD.xlsx
- Colunas: Nome, Telefone, Email, Tags, Data

3. scripts/kommo/prepare_campaign.py:
- Argparse: --input (arquivo xlsx), --lote (default: 50)
- Ler Excel
- Validar telefones (formato BR)
- Dividir em lotes
- Salvar: exports/lote_01.xlsx, lote_02.xlsx, etc
- Printar resumo: total leads, total lotes

4. scripts/kommo/track_responses.py:
- Argparse: --watch (modo contínuo), --input (arquivo específico)
- Monitorar pasta responses/
- Identificar números que responderam
- Salvar: responses/responderam.xlsx

5. scripts/kommo/kommo_import.py:
- Argparse: --input (arquivo xlsx), --tag (default: Respondeu_WaSender)
- Ler Excel com números
- Buscar lead na Kommo por telefone
- Adicionar tag
- Logar operações

Todos os scripts devem ter logging configurado e tratamento de erros.
```

---

## CC3: DOCKER E CONFIGURAÇÕES

```
Crie a configuração Docker para rodar todo o sistema.

DIRETÓRIO: /home/ubuntu/estetica-sales-system/

CRIAR ARQUIVOS:

1. docker-compose.yml:
services:
  backend:
    build: ./backend
    ports: 8000:8000
    volumes: ./backend:/app, ./database:/database
    environment: DATABASE_PATH=/database/estetica.db
    
  frontend:
    build: ./frontend
    ports: 3000:3000
    volumes: ./frontend:/app
    depends_on: backend
    
  n8n:
    image: n8nio/n8n
    ports: 5678:5678
    volumes: n8n_data:/home/node/.n8n
    environment: N8N_BASIC_AUTH_ACTIVE=true
    
volumes:
  n8n_data:

2. backend/Dockerfile:
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

3. frontend/Dockerfile:
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "dev", "--", "--host"]

4. .env (atualizar o existente):
# API
DATABASE_PATH=./database/estetica.db
API_HOST=0.0.0.0
API_PORT=8000

# Kommo
KOMMO_SUBDOMAIN=sua-empresa
KOMMO_API_KEY=seu_token

# OpenAI
OPENAI_API_KEY=sk-xxx

# N8N
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=senha123

5. Makefile:
up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

restart:
	docker-compose restart

backend-shell:
	docker-compose exec backend bash
```

---

## CC4: FRONTEND DASHBOARD (React)

```
Crie o frontend dashboard completo em React + TypeScript + TailwindCSS.

DIRETÓRIO: /home/ubuntu/estetica-sales-system/frontend/

EXECUTAR PRIMEIRO:
cd /home/ubuntu/estetica-sales-system/frontend
npm create vite@latest . -- --template react-ts
npm install tailwindcss postcss autoprefixer @tanstack/react-query react-router-dom axios date-fns lucide-react
npx tailwindcss init -p

CRIAR/MODIFICAR ARQUIVOS:

1. tailwind.config.js:
content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]

2. src/index.css:
@tailwind base;
@tailwind components;
@tailwind utilities;

3. src/services/api.ts:
- Axios instance base http://localhost:8000
- Funções: getLeads, createLead, updateLeadStatus, getAgendamentos, getDashboardStats

4. src/types/index.ts:
- Lead, Paciente, Agendamento, Procedimento, DashboardStats

5. src/components/Layout/Sidebar.tsx:
- Links: Dashboard, Leads, Agendamentos, Pacientes
- Ícones do lucide-react
- Estilo dark com TailwindCSS

6. src/components/Layout/Layout.tsx:
- Sidebar fixa à esquerda
- Área de conteúdo à direita
- Outlet do react-router

7. src/components/Cards/StatCard.tsx:
- Props: title, value, icon, trend
- Estilo card com sombra

8. src/components/Table/DataTable.tsx:
- Props: columns, data, onRowClick
- Paginação simples
- Ordenação por coluna

9. src/pages/Dashboard.tsx:
- 4 StatCards: Leads Hoje, Agendamentos, Conversões, Faturamento
- Lista: Próximos 5 agendamentos
- useQuery para buscar dados

10. src/pages/Leads.tsx:
- Filtros: status (select), busca (input)
- DataTable com leads
- Botão: Novo Lead (abre modal)
- Ações: Ver, Mudar Status, Converter

11. src/pages/Agendamentos.tsx:
- Filtro por data
- Lista de agendamentos do dia
- Ações: Confirmar, Cancelar

12. src/App.tsx:
- BrowserRouter
- QueryClientProvider
- Routes: /, /leads, /agendamentos, /pacientes
- Layout wrapper

Após criar, execute: npm run dev
```

---

## CC5: FLUXOS N8N

```
Crie os workflows N8N em formato JSON para automação.

DIRETÓRIO: /home/ubuntu/estetica-sales-system/n8n-workflows/

CRIAR ARQUIVOS:

1. n8n-workflows/01-whatsapp-receiver.json:
Workflow que:
- Webhook recebe mensagem do WhatsApp (POST /webhook/whatsapp)
- Extrai: from, message, timestamp
- Chama OpenAI para classificar intenção (interesse, agendar, preco, duvida)
- Salva no banco SQLite
- Retorna resposta

2. n8n-workflows/02-lead-qualifier.json:
Workflow que:
- Trigger: novo lead no banco
- Busca histórico do contato
- Calcula score (0-100)
- Atualiza status do lead
- Se score > 70: notifica equipe

3. n8n-workflows/03-appointment-reminder.json:
Workflow que:
- Cron: roda todo dia às 9h
- Busca agendamentos das próximas 24h
- Para cada: envia lembrete via WhatsApp
- Atualiza: lembrete_enviado = true

4. n8n-workflows/04-followup-sequence.json:
Workflow que:
- Trigger: lead sem resposta há 3 dias
- Envia mensagem de follow-up
- Se não responder em +3 dias: segunda mensagem
- Se não responder em +7 dias: marca como perdido

Cada JSON deve ser válido e importável no N8N.
Incluir nodes: Webhook, HTTP Request, OpenAI, SQLite, IF, Set.
```

---

## CC6: INTEGRAÇÃO WHATICKET

```
Crie o serviço de integração entre Whaticket e N8N.

DIRETÓRIO: /home/ubuntu/estetica-sales-system/integrations/

CRIAR ARQUIVOS:

1. integrations/package.json:
{
  "name": "whaticket-bridge",
  "scripts": { "start": "node src/index.js", "dev": "nodemon src/index.js" },
  "dependencies": { "express": "^4.18.2", "axios": "^1.6.0", "dotenv": "^16.0.0" }
}

2. integrations/src/index.js:
- Express server porta 3001
- POST /webhook/whaticket - recebe eventos do Whaticket
- POST /callback/n8n - recebe resposta do N8N
- Formata e roteia mensagens

3. integrations/src/services/whaticket.js:
- Classe WhaticketAPI
- Métodos: sendMessage(ticketId, message), updateTicket(ticketId, data)
- Usa axios com WHATICKET_API_URL e WHATICKET_TOKEN do .env

4. integrations/src/services/n8n.js:
- Classe N8NClient
- Método: sendEvent(eventType, data)
- Envia para N8N_WEBHOOK_URL

5. integrations/.env.example:
WHATICKET_API_URL=https://seu-whaticket.com/api
WHATICKET_TOKEN=xxx
N8N_WEBHOOK_URL=http://localhost:5678/webhook/whaticket
PORT=3001

Após criar, execute: cd integrations && npm install && npm run dev
```

---

## 🎯 COMO RODAR (4 ABAS CMD)

```
ABA 1 - BACKEND:
cd /home/ubuntu/estetica-sales-system
claude "Execute o prompt CC1 do arquivo comandos/PROMPTS_CLAUDE_CODE.md"

ABA 2 - SCRIPTS:
cd /home/ubuntu/estetica-sales-system
claude "Execute o prompt CC2 do arquivo comandos/PROMPTS_CLAUDE_CODE.md"

ABA 3 - DOCKER:
cd /home/ubuntu/estetica-sales-system
claude "Execute o prompt CC3 do arquivo comandos/PROMPTS_CLAUDE_CODE.md"

ABA 4 - FRONTEND:
cd /home/ubuntu/estetica-sales-system
claude "Execute o prompt CC4 do arquivo comandos/PROMPTS_CLAUDE_CODE.md"
```

---

## ✅ APÓS CADA PROMPT

```bash
# Verificar o que foi criado
git status

# Commitar
git add .
git commit -m "feat: [nome do que foi criado]"
git push
```

---

## 🔄 FLUXO DE TRABALHO

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Claude     │────▶│   GitHub    │────▶│   Manus     │
│  Code       │     │   (commit)  │     │  (revisão)  │
│  (cria)     │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
      │                                        │
      │                                        │
      └────────────────────────────────────────┘
                    (próximo prompt)
```
