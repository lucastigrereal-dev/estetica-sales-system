# 🎯 PLANO DE DELEGAÇÃO - Sistema Vendas Estética

Este documento contém os **tickets de delegação** para você executar em outras IAs (Llama, Claude Code, GPT Codex, Perplexity, Genspark). Cada ticket é um prompt pronto para copiar/colar.

---

## 📋 VISÃO GERAL DO PROJETO

**Repositório GitHub:** `estetica-sales-system`

**Objetivo:** Sistema unificado de vendas para clínica de estética integrando:
- Prospecção via WhatsApp (WaSender)
- Atendimento e CRM (WaCRM)
- Agendamentos (Sistema Clínica)
- Automação (N8N)

---

## 🔧 TICKET #1 - API REST (Backend)
**Delegar para:** Claude Code ou GPT Codex (VS Code)
**Pasta no GitHub:** `/backend/`

### Prompt para copiar:
```
Crie uma API REST em Python (FastAPI) para um sistema de clínica de estética com os seguintes endpoints:

LEADS:
- POST /leads - Criar novo lead (nome, telefone, origem, interesse_procedimento)
- GET /leads - Listar leads com filtro por status
- PUT /leads/{id}/status - Atualizar status do lead
- POST /leads/{id}/convert - Converter lead em paciente

PACIENTES:
- POST /pacientes - Criar paciente
- GET /pacientes - Listar pacientes
- GET /pacientes/{id} - Detalhes do paciente

AGENDAMENTOS:
- POST /agendamentos - Criar agendamento
- GET /agendamentos - Listar agendamentos (filtro por data, profissional)
- PUT /agendamentos/{id}/confirmar - Confirmar agendamento
- PUT /agendamentos/{id}/cancelar - Cancelar agendamento

PROCEDIMENTOS:
- GET /procedimentos - Listar procedimentos disponíveis

Use SQLite como banco de dados. Inclua:
- Validação com Pydantic
- Documentação automática (Swagger)
- CORS habilitado
- Arquivo requirements.txt

Estrutura de pastas:
/backend
  /app
    __init__.py
    main.py
    models.py
    schemas.py
    database.py
    routers/
      leads.py
      pacientes.py
      agendamentos.py
  requirements.txt
  README.md
```

### Onde salvar:
Criar pasta `/backend/` no repositório e commitar os arquivos.

---

## 🔧 TICKET #2 - Frontend Dashboard
**Delegar para:** Claude Code ou GPT Codex
**Pasta no GitHub:** `/frontend/`

### Prompt para copiar:
```
Crie um dashboard em React + TypeScript + TailwindCSS para uma clínica de estética.

PÁGINAS:
1. Dashboard (estatísticas: leads hoje, agendamentos, conversões)
2. Leads (tabela com filtros, ações de status)
3. Agendamentos (calendário visual, criar/editar)
4. Pacientes (lista e detalhes)

COMPONENTES:
- Sidebar com navegação
- Cards de estatísticas
- Tabela com paginação e filtros
- Modal de criação/edição
- Calendário de agendamentos

INTEGRAÇÃO:
- Consumir API REST em http://localhost:8000
- Usar React Query para cache
- Usar React Router para navegação

Use Vite como bundler. Estilo visual moderno e limpo.

Estrutura:
/frontend
  /src
    /components
    /pages
    /hooks
    /services
    App.tsx
    main.tsx
  package.json
  tailwind.config.js
  README.md
```

### Onde salvar:
Criar pasta `/frontend/` no repositório.

---

## 🔧 TICKET #3 - Webhook WhatsApp (N8N)
**Delegar para:** Perplexity ou Genspark (pesquisa + código)
**Pasta no GitHub:** `/n8n-workflows/`

### Prompt para copiar:
```
Pesquise e crie um fluxo N8N (JSON) que:

1. Recebe mensagens do WhatsApp via webhook (Evolution API ou similar)
2. Detecta intenção do cliente usando OpenAI:
   - "interesse" → salva como lead
   - "agendar" → inicia fluxo de agendamento
   - "preço" → envia tabela de preços
3. Responde automaticamente com IA (GPT-4)
4. Salva a conversa no banco de dados SQLite

Inclua:
- Nó de webhook para receber mensagens
- Nó de OpenAI para classificação e resposta
- Nó de SQLite para persistência
- Nó de HTTP Request para enviar resposta ao WhatsApp

Forneça o JSON completo do workflow pronto para importar no N8N.
```

### Onde salvar:
Arquivo `/n8n-workflows/whatsapp-ai-flow.json`

---

## 🔧 TICKET #4 - Scripts de Sincronização
**Delegar para:** Llama (local) ou Claude
**Pasta no GitHub:** `/scripts/`

### Prompt para copiar:
```
Crie scripts Python para sincronizar dados entre sistemas:

SCRIPT 1: sync_wacrm.py
- Lê o arquivo db.db do WaCRM (SQLite)
- Extrai sessões, lembretes e templates
- Insere no banco de dados unificado

SCRIPT 2: sync_wasender.py
- Lê arquivos Excel exportados do WaSender
- Importa contatos como leads
- Marca origem como "wasender"

SCRIPT 3: export_leads.py
- Exporta leads do banco unificado para Excel
- Formato compatível com WaSender para disparos

SCRIPT 4: send_reminders.py
- Busca agendamentos das próximas 24h
- Gera lista de lembretes para enviar
- Marca como "lembrete_enviado"

Todos os scripts devem:
- Usar argparse para parâmetros
- Ter logging configurado
- Tratar erros graciosamente
```

### Onde salvar:
Pasta `/scripts/` com cada arquivo .py

---

## 🔧 TICKET #5 - Documentação e Deploy
**Delegar para:** Perplexity ou Genspark
**Pasta no GitHub:** `/docs/`

### Prompt para copiar:
```
Crie documentação completa para um sistema de vendas de estética:

1. GUIA DE INSTALAÇÃO (install.md)
   - Requisitos (Python 3.11, Node 18, SQLite, N8N)
   - Passo a passo para Windows e Linux
   - Configuração de variáveis de ambiente

2. GUIA DE USO (usage.md)
   - Como adicionar leads manualmente
   - Como configurar campanhas de disparo
   - Como agendar procedimentos
   - Como usar o chatbot WhatsApp

3. GUIA DE INTEGRAÇÃO (integration.md)
   - Como conectar WaCRM ao sistema
   - Como conectar WaSender ao sistema
   - Como configurar N8N
   - Como usar múltiplos números (iPhone)

4. TROUBLESHOOTING (troubleshooting.md)
   - Erros comuns e soluções
   - Como evitar banimento no WhatsApp
   - Backup e recuperação
```

### Onde salvar:
Pasta `/docs/` com cada arquivo .md

---

## 🔧 TICKET #6 - Docker e Deploy
**Delegar para:** Claude Code ou GPT Codex
**Pasta no GitHub:** `/` (raiz)

### Prompt para copiar:
```
Crie configuração Docker para um sistema com:
- Backend Python (FastAPI) na porta 8000
- Frontend React na porta 3000
- N8N na porta 5678
- SQLite como volume persistente

Arquivos necessários:
1. Dockerfile para backend
2. Dockerfile para frontend
3. docker-compose.yml unificado
4. .env.example com variáveis necessárias

O docker-compose deve:
- Criar rede interna entre serviços
- Mapear volumes para persistência
- Configurar health checks
- Permitir hot-reload em desenvolvimento
```

### Onde salvar:
Arquivos na raiz do repositório.

---

## 📊 ORDEM DE EXECUÇÃO

1. **TICKET #1** (Backend) - Base do sistema
2. **TICKET #4** (Scripts) - Sincronização de dados
3. **TICKET #3** (N8N) - Automação WhatsApp
4. **TICKET #2** (Frontend) - Interface visual
5. **TICKET #5** (Docs) - Documentação
6. **TICKET #6** (Docker) - Deploy

---

## 🔄 FLUXO DE TRABALHO

1. Você executa o ticket na IA correspondente
2. Salva o código gerado no seu computador
3. Faz commit no GitHub na pasta indicada
4. Me avisa quando terminar um bloco
5. Eu reviso, integro e oriento os próximos passos

---

## 📁 ESTRUTURA FINAL DO GITHUB

```
estetica-sales-system/
├── backend/
│   ├── app/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   └── package.json
├── n8n-workflows/
│   └── *.json
├── scripts/
│   └── *.py
├── database/
│   └── schema.sql
├── docs/
│   └── *.md
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
├── .env.example
└── README.md
```

---

**Quando terminar cada ticket, me manda o link do commit ou cola o código aqui que eu organizo e integro!**


---

## 🚨 TICKET PRIORITÁRIO - Extração Kommo + Disparo Paralelo
**Delegar para:** Llama (local) ou Claude Code
**Pasta no GitHub:** `/scripts/`

### Contexto:
Você tem leads na Kommo que não respondem pela API oficial (bloqueios da Meta). A solução é extrair esses números e disparar via WaSender, depois trazer de volta quando responderem.

### Prompt para copiar:
```
Crie um sistema de scripts Python para extrair leads da Kommo e preparar para disparo externo:

SCRIPT 1: kommo_export.py
- Conecta na API da Kommo (amoCRM)
- Extrai leads com status "Sem resposta" ou "Lead frio"
- Filtra apenas os que têm número de telefone
- Exporta para Excel no formato do WaSender:
  - Colunas: Name, Phone, Email, Tags
- Salva em /exports/leads_para_disparo_YYYYMMDD.xlsx

SCRIPT 2: prepare_campaign.py
- Lê o Excel exportado
- Divide em lotes de 50 números (limite diário por chip)
- Cria arquivos separados: lote_01.xlsx, lote_02.xlsx, etc
- Gera relatório de quantos lotes e tempo estimado

SCRIPT 3: track_responses.py
- Monitora uma pasta /responses/ onde você salva prints ou exports do WaSender
- Identifica números que responderam
- Gera lista para reimportar na Kommo com tag "Respondeu_WaSender"

SCRIPT 4: kommo_import.py
- Lê a lista de números que responderam
- Atualiza o lead na Kommo via API
- Adiciona tag "Respondeu_WaSender"
- Move para o funil de "Atendimento Ativo"

Requisitos:
- Usar a biblioteca 'amocrm-api' ou requests direto
- Configuração via arquivo .env (KOMMO_API_KEY, KOMMO_SUBDOMAIN)
- Logging detalhado
- Tratamento de rate limits da API
```

### Onde salvar:
Pasta `/scripts/kommo/` com os 4 arquivos

### Como usar (CMD paralelo):
```bash
# Aba 1: Exportar da Kommo
python scripts/kommo/kommo_export.py

# Aba 2: Preparar lotes
python scripts/kommo/prepare_campaign.py --input exports/leads_para_disparo_20260114.xlsx

# Aba 3: Após disparar no WaSender, rastrear respostas
python scripts/kommo/track_responses.py --watch

# Aba 4: Reimportar respondentes na Kommo
python scripts/kommo/kommo_import.py --input responses/responderam.xlsx
```

---

## 🔄 FLUXO KOMMO → WASENDER → KOMMO

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   KOMMO     │────▶│   EXPORT    │────▶│  WASENDER   │────▶│   KOMMO     │
│ (Leads Frios)│     │  (Excel)    │     │  (Disparo)  │     │(Lead Quente)│
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
      │                   │                   │                   │
      ▼                   ▼                   ▼                   ▼
   API Oficial         50/lote            Sem travas         Tag especial
   (bloqueada)        (seguro)           (liberdade)        (prioridade)
```

---

## 📱 OPERAÇÃO MULTI-ABA (CMD)

Para máxima eficiência, rode assim:

| Aba CMD | Script | Função |
|---------|--------|--------|
| 1 | `kommo_export.py` | Exporta leads novos a cada hora |
| 2 | `prepare_campaign.py` | Prepara lotes para disparo |
| 3 | `sync_leads.py` | Sincroniza banco unificado |
| 4 | `track_responses.py` | Monitora respostas em tempo real |

---

## ⚡ DICA DE PERFORMANCE

Se você tem o **Llama rodando local**, use ele para gerar os scripts porque:
1. Não gasta créditos
2. Roda offline
3. Você pode iterar rápido

Depois me manda o código e eu reviso/integro aqui.

