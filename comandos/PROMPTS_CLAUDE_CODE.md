# 🤖 PROMPTS PARA CLAUDE CODE (CMD)

**Como usar:** 
1. Clone o repositório no seu PC
2. Abra o CMD na pasta do projeto
3. Cole o prompt no Claude Code
4. Ele cria os arquivos automaticamente

---

## 🚀 SETUP INICIAL (Rodar uma vez)

```bash
# No CMD do Windows:
git clone https://github.com/lucastigrereal-dev/estetica-sales-system.git
cd estetica-sales-system
```

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
Estou na pasta do projeto "estetica-sales-system". Crie a API backend completa.

CRIAR ESTES ARQUIVOS (caminhos relativos à pasta atual):

1. backend/requirements.txt:
fastapi==0.109.0
uvicorn==0.27.0
sqlalchemy==2.0.25
pydantic==2.5.3
python-dotenv==1.0.0
openpyxl==3.1.2

2. backend/app/__init__.py:
(arquivo vazio)

3. backend/app/database.py:
- SQLite em ../database/estetica.db (caminho relativo)
- Engine e SessionLocal
- Base declarativa
- Função get_db()

4. backend/app/models.py:
- Lead (id, nome, telefone, email, origem, interesse, status, created_at)
- Paciente (id, nome, telefone, email, lead_id, created_at)
- Agendamento (id, paciente_id, procedimento_id, data, profissional, status, confirmado)
- Procedimento (id, nome, preco, duracao_min)

5. backend/app/schemas.py:
- Pydantic schemas para cada model (Create, Update, Response)

6. backend/app/routers/__init__.py:
(arquivo vazio)

7. backend/app/routers/leads.py:
- POST /leads - criar lead
- GET /leads - listar com filtros (status, origem)
- GET /leads/{id} - detalhes
- PUT /leads/{id}/status - mudar status
- POST /leads/{id}/convert - converter em paciente

8. backend/app/routers/agendamentos.py:
- POST /agendamentos - criar
- GET /agendamentos - listar com filtros (data, profissional)
- PUT /agendamentos/{id}/confirmar
- PUT /agendamentos/{id}/cancelar

9. backend/app/routers/dashboard.py:
- GET /dashboard/stats - retorna leads_hoje, agendamentos_hoje, taxa_conversao

10. backend/app/main.py:
- FastAPI app
- CORS habilitado para localhost:3000
- Include todos os routers com prefixo /api
- Criar tabelas on startup

Após criar os arquivos, me mostre os comandos para testar.
```

---

## CC2: SCRIPTS KOMMO

```
Estou na pasta do projeto "estetica-sales-system". Crie os scripts de integração com Kommo.

CRIAR ESTES ARQUIVOS:

1. scripts/kommo/__init__.py:
(arquivo vazio)

2. scripts/kommo/config.py:
- Carregar variáveis do .env (KOMMO_SUBDOMAIN, KOMMO_API_KEY)
- Classe KommoClient com métodos para chamar a API

3. scripts/kommo/kommo_export.py:
- Argparse: --status (default: sem_resposta), --limit (default: 500)
- Conectar na API Kommo
- Buscar leads pelo status
- Filtrar apenas com telefone válido
- Exportar para Excel: exports/leads_YYYYMMDD.xlsx
- Colunas: Nome, Telefone, Email, Tags, Data

4. scripts/kommo/prepare_campaign.py:
- Argparse: --input (arquivo xlsx), --lote (default: 50)
- Ler o Excel
- Validar telefones brasileiros
- Remover duplicados
- Dividir em lotes de N números
- Salvar: exports/lote_01.xlsx, lote_02.xlsx, etc
- Printar resumo no console

5. scripts/kommo/track_responses.py:
- Argparse: --watch (monitora contínuo), --input (arquivo específico)
- Monitorar pasta responses/
- Identificar números que responderam
- Gerar: responses/responderam.xlsx

6. scripts/kommo/kommo_import.py:
- Argparse: --input (arquivo xlsx), --tag (default: Respondeu_WaSender)
- Ler Excel com números que responderam
- Buscar lead na Kommo por telefone
- Adicionar tag ao lead
- Logar cada operação

Todos os scripts devem ter:
- Logging configurado
- Tratamento de erros
- Mensagens claras no console
```

---

## CC3: DOCKER E CONFIGURAÇÕES

```
Estou na pasta do projeto "estetica-sales-system". Crie as configurações Docker.

CRIAR ESTES ARQUIVOS:

1. docker-compose.yml:
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    volumes:
      - ./backend:/app
      - ./database:/database
    environment:
      - DATABASE_PATH=/database/estetica.db
    
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - backend
    
  n8n:
    image: n8nio/n8n
    ports:
      - "5678:5678"
    volumes:
      - n8n_data:/home/node/.n8n
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=admin123

volumes:
  n8n_data:

2. backend/Dockerfile:
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

3. frontend/Dockerfile:
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

4. Atualizar o arquivo .env.example existente, adicionando:
# Docker
COMPOSE_PROJECT_NAME=estetica-sales

# N8N
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=admin123

5. Makefile (para facilitar comandos):
.PHONY: up down logs restart

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

restart:
	docker-compose restart

backend-logs:
	docker-compose logs -f backend

frontend-logs:
	docker-compose logs -f frontend
```

---

## CC4: FRONTEND DASHBOARD (React)

```
Estou na pasta do projeto "estetica-sales-system". Crie o frontend dashboard.

PASSO 1 - INICIALIZAR (execute estes comandos primeiro):
cd frontend
npm create vite@latest . -- --template react-ts -y
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install @tanstack/react-query react-router-dom axios date-fns lucide-react

PASSO 2 - CRIAR/MODIFICAR ARQUIVOS:

1. frontend/tailwind.config.js:
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
}

2. frontend/src/index.css:
@tailwind base;
@tailwind components;
@tailwind utilities;

3. frontend/src/services/api.ts:
- Criar axios instance com baseURL http://localhost:8000/api
- Funções: getLeads(), createLead(), updateLeadStatus(), getAgendamentos(), getDashboardStats()

4. frontend/src/types/index.ts:
- Interface Lead { id, nome, telefone, email, origem, interesse, status, created_at }
- Interface Agendamento { id, paciente_id, procedimento_id, data, profissional, status }
- Interface DashboardStats { leads_hoje, agendamentos_hoje, taxa_conversao }

5. frontend/src/components/Layout/Sidebar.tsx:
- Menu lateral fixo com links: Dashboard, Leads, Agendamentos
- Usar ícones do lucide-react
- Estilo escuro com Tailwind

6. frontend/src/components/Layout/Layout.tsx:
- Wrapper com Sidebar + área de conteúdo
- Usar Outlet do react-router

7. frontend/src/components/Cards/StatCard.tsx:
- Props: title, value, icon
- Card com sombra e estilo moderno

8. frontend/src/pages/Dashboard.tsx:
- 3 StatCards: Leads Hoje, Agendamentos Hoje, Taxa Conversão
- Usar useQuery para buscar dados da API

9. frontend/src/pages/Leads.tsx:
- Tabela com lista de leads
- Filtro por status (select)
- Busca por nome/telefone

10. frontend/src/pages/Agendamentos.tsx:
- Lista de agendamentos
- Filtro por data
- Botões: Confirmar, Cancelar

11. frontend/src/App.tsx:
- BrowserRouter com Routes
- QueryClientProvider
- Rotas: / (Dashboard), /leads, /agendamentos
- Layout como wrapper

Após criar, execute: npm run dev
```

---

## CC5: FLUXOS N8N

```
Estou na pasta do projeto "estetica-sales-system". Crie os workflows N8N em JSON.

CRIAR ESTES ARQUIVOS:

1. n8n-workflows/01-whatsapp-receiver.json:
Workflow N8N que:
- Node 1: Webhook (POST /webhook/whatsapp)
- Node 2: Set - extrair campos (from, message, timestamp)
- Node 3: HTTP Request - chamar OpenAI para classificar intenção
- Node 4: Switch - rotear por intenção (interesse, agendar, preco, duvida)
- Node 5: HTTP Request - gerar resposta com OpenAI
- Node 6: Respond to Webhook - retornar resposta

2. n8n-workflows/02-appointment-reminder.json:
Workflow N8N que:
- Node 1: Cron Trigger (todo dia 9h)
- Node 2: HTTP Request - buscar agendamentos próximas 24h
- Node 3: Loop - para cada agendamento
- Node 4: HTTP Request - enviar lembrete WhatsApp
- Node 5: HTTP Request - marcar lembrete_enviado = true

3. n8n-workflows/03-followup-sequence.json:
Workflow N8N que:
- Node 1: Cron Trigger (todo dia 10h)
- Node 2: HTTP Request - buscar leads sem resposta há 3 dias
- Node 3: Loop - para cada lead
- Node 4: HTTP Request - enviar follow-up WhatsApp
- Node 5: HTTP Request - atualizar último_contato

Cada arquivo deve ser um JSON válido importável no N8N.
```

---

## CC6: INTEGRAÇÃO WHATICKET

```
Estou na pasta do projeto "estetica-sales-system". Crie o serviço de integração Whaticket.

CRIAR ESTES ARQUIVOS:

1. integrations/package.json:
{
  "name": "whaticket-bridge",
  "version": "1.0.0",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "axios": "^1.6.0",
    "dotenv": "^16.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}

2. integrations/src/index.js:
- Express server na porta 3001
- Carregar dotenv
- POST /webhook/whaticket - recebe eventos do Whaticket
- POST /callback/n8n - recebe resposta do N8N
- Logar todas as requisições

3. integrations/src/services/whaticket.js:
- Classe WhaticketAPI
- Constructor recebe URL e Token do .env
- Método sendMessage(ticketId, message)
- Método updateTicket(ticketId, data)

4. integrations/src/services/n8n.js:
- Classe N8NClient
- Constructor recebe webhook URL do .env
- Método sendEvent(eventType, payload)

5. integrations/.env.example:
WHATICKET_API_URL=https://seu-whaticket.com/api
WHATICKET_TOKEN=seu_token_aqui
N8N_WEBHOOK_URL=http://localhost:5678/webhook/whaticket
PORT=3001

Após criar, execute: cd integrations && npm install && npm run dev
```

---

## ✅ APÓS CADA PROMPT

No CMD, na pasta do projeto:

```bash
git status
git add .
git commit -m "feat: [descreva o que foi criado]"
git push
```

---

## 🎯 RESUMO DO FLUXO

```
1. Você clona o repo no seu PC
2. Abre 4 abas do CMD na pasta do projeto
3. Em cada aba, cola um prompt (CC1, CC2, CC3, CC4)
4. Claude Code cria os arquivos
5. Você faz commit e push
6. Avisa o Manus (eu) para revisar
7. Repete para os próximos prompts
```

---

## 🆘 SE DER ERRO

1. Cola o erro de volta no Claude Code
2. Ou me manda aqui que eu ajudo
3. Ou pesquisa no Perplexity
