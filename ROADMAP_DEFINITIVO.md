# 🗺️ ROADMAP DEFINITIVO - JARVIS DA ESTÉTICA

**Este documento é o guia mestre. Mesmo sem o Manus, você consegue continuar.**

---

## 📋 ÍNDICE

1. [Visão Geral do Sistema](#1-visão-geral-do-sistema)
2. [Arquitetura Completa](#2-arquitetura-completa)
3. [Fases de Implementação](#3-fases-de-implementação)
4. [Comandos para CMD (Multi-Aba)](#4-comandos-para-cmd-multi-aba)
5. [Prompts para Outras IAs](#5-prompts-para-outras-ias)
6. [Checklist de Execução](#6-checklist-de-execução)

---

## 1. VISÃO GERAL DO SISTEMA

### O que você está construindo:
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        JARVIS DA ESTÉTICA                                    │
│                   Sistema Completo de Vendas e Atendimento                   │
└─────────────────────────────────────────────────────────────────────────────┘

ENTRADA (Múltiplos Canais)
├── Instagram (Jarvee + ManyChat)
├── WhatsApp (WaSender + WaCRM + Whaticket)
├── TikTok/Meta Ads
├── Google Ads / Google Meu Negócio
├── Site / Landing Pages
└── Kommo (API Oficial)
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         N8N (ORQUESTRADOR CENTRAL)                           │
│  • Recebe leads de todos os canais                                          │
│  • Classifica intenção com IA (GPT/Claude/Gemini)                           │
│  • Roteia para o atendimento correto                                        │
│  • Dispara automações (lembretes, follow-up)                                │
└─────────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ATENDIMENTO                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│  AUTOMÁTICO (Bot)           │  HUMANO (Equipe)          │  VIP (Você)       │
│  • Respostas rápidas        │  • Whaticket multi-user   │  • Kommo oficial  │
│  • Qualificação             │  • Kanban de tickets      │  • Clientes top   │
│  • FAQ                      │  • Filas por assunto      │  • Fechamento     │
└─────────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SISTEMA CLÍNICA                                      │
│  • Agendamentos                                                              │
│  • Pacientes                                                                 │
│  • Procedimentos                                                             │
│  • Financeiro                                                                │
│  • Lembretes automáticos 24h                                                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. ARQUITETURA COMPLETA

### Ferramentas por Função:

| FUNÇÃO | FERRAMENTA | PASTA NO REPO |
|--------|------------|---------------|
| Prospecção WhatsApp | WaSender | `/ferramentas/wasender/` |
| Prospecção Instagram | Jarvee | `/ferramentas/jarvee/` |
| CRM Individual | WaCRM | `/ferramentas/wacrm/` |
| Atendimento Equipe | Whaticket | `/ferramentas/whaticket/` |
| CRM Oficial | Kommo | `/ferramentas/kommo/` |
| Automação | N8N | `/ferramentas/n8n/` + `/n8n-workflows/` |
| Agendamento | Sistema Clínica | `/backend/` |
| IA Central | GPT/Claude/Gemini | Configurado no N8N |

### Banco de Dados Unificado:
```
/database/schema.sql

Tabelas:
├── leads (todos os leads de todos os canais)
├── pacientes (leads convertidos)
├── agendamentos (consultas marcadas)
├── procedimentos (serviços oferecidos)
├── mensagens (histórico de conversas)
├── campanhas (disparos em massa)
└── automacoes (logs do N8N)
```

---

## 3. FASES DE IMPLEMENTAÇÃO

### FASE 1: INFRAESTRUTURA (Semana 1)
```
□ Clonar repositório GitHub
□ Instalar Docker
□ Subir N8N local
□ Configurar banco de dados
□ Testar conexões
```

### FASE 2: PROSPECÇÃO (Semana 2)
```
□ Configurar WaSender
□ Configurar Jarvee (Instagram)
□ Criar listas de leads
□ Testar disparos pequenos
□ Ajustar delays (Protocolo Baixo Risco)
```

### FASE 3: ATENDIMENTO (Semana 3)
```
□ Instalar Whaticket na VPS
□ Configurar filas de atendimento
□ Criar respostas rápidas
□ Integrar com N8N (webhook)
□ Treinar equipe
```

### FASE 4: AUTOMAÇÃO (Semana 4)
```
□ Importar fluxos N8N do repositório
□ Configurar chatbot IA
□ Criar lembretes 24h
□ Configurar follow-up automático
□ Testar fluxo completo
```

### FASE 5: ESCALA (Semana 5+)
```
□ Adicionar mais números (método iPhone)
□ Escalar disparos
□ Otimizar conversão
□ Criar relatórios
□ Ajustar baseado em dados
```

---

## 4. COMANDOS PARA CMD (MULTI-ABA)

### Configuração Inicial (Rodar uma vez):
```bash
# Aba 1: Clonar repositório
git clone https://github.com/lucastigrereal-dev/estetica-sales-system.git
cd estetica-sales-system

# Aba 2: Instalar dependências Python
pip install -r requirements.txt

# Aba 3: Subir Docker (N8N + Banco)
docker-compose up -d
```

### Operação Diária (4 Abas):

**ABA 1 - Exportar Leads da Kommo:**
```bash
cd estetica-sales-system
python scripts/kommo/kommo_export.py --status "sem_resposta"
# Gera: exports/leads_para_disparo_YYYYMMDD.xlsx
```

**ABA 2 - Preparar Lotes para Disparo:**
```bash
cd estetica-sales-system
python scripts/kommo/prepare_campaign.py --input exports/leads_para_disparo_*.xlsx --lote 50
# Gera: exports/lote_01.xlsx, lote_02.xlsx, etc
```

**ABA 3 - Sincronizar Respostas:**
```bash
cd estetica-sales-system
python scripts/kommo/track_responses.py --watch
# Monitora pasta /responses/ em tempo real
```

**ABA 4 - Reimportar na Kommo:**
```bash
cd estetica-sales-system
python scripts/kommo/kommo_import.py --input responses/responderam.xlsx
# Atualiza leads na Kommo com tag "Respondeu_WaSender"
```

### Comandos Git (Após alterações):
```bash
git add .
git commit -m "feat: descrição da mudança"
git push
```

---

## 5. PROMPTS PARA OUTRAS IAs

### 🦙 LLAMA (Local - Código Pesado)

**Prompt 1: API Backend**
```
Crie uma API REST em Python (FastAPI) para um sistema de clínica de estética.

Endpoints necessários:
- POST /leads - Criar lead (nome, telefone, origem, interesse)
- GET /leads - Listar com filtros
- PUT /leads/{id}/status - Atualizar status
- POST /leads/{id}/convert - Converter em paciente
- POST /agendamentos - Criar agendamento
- GET /agendamentos - Listar por data
- PUT /agendamentos/{id}/confirmar - Confirmar

Use SQLite, Pydantic para validação, inclua Swagger.
Estrutura: /backend/app/ com main.py, models.py, schemas.py, database.py, routers/
```

**Prompt 2: Scripts Kommo**
```
Crie 4 scripts Python para integração com Kommo (amoCRM):

1. kommo_export.py - Exporta leads com status "sem_resposta" para Excel
2. prepare_campaign.py - Divide Excel em lotes de 50 números
3. track_responses.py - Monitora pasta e identifica quem respondeu
4. kommo_import.py - Atualiza leads na Kommo via API

Use: requests, openpyxl, python-dotenv
Configuração via .env: KOMMO_SUBDOMAIN, KOMMO_API_KEY
```

---

### 🤖 CLAUDE CODE (VS Code - Código Complexo)

**Prompt 1: Frontend Dashboard**
```
Crie um dashboard em React + TypeScript + TailwindCSS para clínica de estética.

Páginas:
1. Dashboard (cards: leads hoje, agendamentos, conversões)
2. Leads (tabela com filtros e ações)
3. Agendamentos (calendário visual)
4. Pacientes (lista e detalhes)

Componentes: Sidebar, Cards, Tabela paginada, Modal, Calendário
API: http://localhost:8000
Use: React Query, React Router, Vite
```

**Prompt 2: Integração Whaticket-N8N**
```
Crie um webhook handler em Node.js que:
1. Recebe eventos do Whaticket (nova mensagem, ticket criado)
2. Formata e envia para N8N via HTTP POST
3. Recebe resposta do N8N e envia de volta ao Whaticket

Inclua: autenticação via API Key, logs, tratamento de erros
Salvar em: /integrations/whaticket-n8n-bridge.js
```

---

### 🔍 PERPLEXITY / GENSPARK (Pesquisa + Docs)

**Prompt 1: Fluxo N8N WhatsApp**
```
Pesquise e crie um fluxo N8N (JSON) que:
1. Recebe mensagens do WhatsApp via webhook (Evolution API)
2. Classifica intenção com OpenAI (interesse, agendar, preço)
3. Responde automaticamente com IA
4. Salva conversa no SQLite

Forneça o JSON completo pronto para importar.
```

**Prompt 2: Documentação de Instalação**
```
Crie documentação completa para instalar um sistema de vendas:

1. REQUISITOS (Python 3.11, Node 18, Docker, N8N)
2. INSTALAÇÃO passo a passo (Windows e Linux)
3. CONFIGURAÇÃO de variáveis de ambiente
4. TROUBLESHOOTING (erros comuns)

Formato Markdown, linguagem clara.
```

---

### 💻 GPT CODEX (CMD - Scripts Rápidos)

**Prompt 1: Docker Compose**
```
Crie docker-compose.yml para:
- Backend Python (FastAPI) porta 8000
- Frontend React porta 3000
- N8N porta 5678
- SQLite como volume

Inclua: rede interna, volumes persistentes, health checks
```

**Prompt 2: Script de Backup**
```
Crie script bash que:
1. Faz backup do banco SQLite
2. Compacta com data no nome
3. Envia para pasta do Google Drive (rclone)
4. Deleta backups com mais de 7 dias

Agendar via cron para rodar diariamente às 3h.
```

---

## 6. CHECKLIST DE EXECUÇÃO

### Pré-requisitos:
- [ ] Git instalado
- [ ] Python 3.11 instalado
- [ ] Node.js 18+ instalado
- [ ] Docker instalado
- [ ] VS Code com extensões (Python, Claude, Llama)
- [ ] Conta GitHub configurada

### Semana 1 - Setup:
- [ ] Clonar repositório
- [ ] Configurar .env
- [ ] Subir Docker
- [ ] Testar API backend
- [ ] Acessar N8N (localhost:5678)

### Semana 2 - Prospecção:
- [ ] Instalar WaSender
- [ ] Configurar número de teste
- [ ] Fazer disparo de 10 mensagens
- [ ] Verificar se não foi bloqueado
- [ ] Escalar para 50/dia

### Semana 3 - Atendimento:
- [ ] Contratar VPS (Contabo/Hetzner)
- [ ] Instalar Whaticket
- [ ] Configurar domínio
- [ ] Criar primeiro atendente
- [ ] Testar fluxo completo

### Semana 4 - Automação:
- [ ] Importar fluxos N8N
- [ ] Configurar API OpenAI
- [ ] Testar chatbot
- [ ] Configurar lembretes
- [ ] Validar integrações

### Semana 5+ - Escala:
- [ ] Adicionar mais números
- [ ] Aumentar volume de disparos
- [ ] Analisar métricas
- [ ] Otimizar conversão
- [ ] Documentar aprendizados

---

## 📁 ESTRUTURA FINAL DO REPOSITÓRIO

```
estetica-sales-system/
├── arquitetura/                    # Documentos de arquitetura
│   ├── jarvis/                     # Arquitetura Jarvis Clínica
│   ├── aurora/                     # SDR Aurora
│   ├── ARQUITETURA_TECNICA.md
│   ├── Blueprint_Sistema_Vendas_Estetica.md
│   └── Ecossistema_Vendas_Integrado.md
│
├── assets/                         # Imagens e recursos
│   └── FluxogramadeGeraçãodeLeads.png
│
├── backend/                        # API REST (FastAPI)
│   └── app/
│
├── frontend/                       # Dashboard (React)
│   └── src/
│
├── ferramentas/                    # Documentação de cada ferramenta
│   ├── wacrm/
│   ├── wasender/
│   ├── whaticket/
│   ├── jarvee/
│   ├── n8n/
│   └── kommo/
│
├── n8n-workflows/                  # Fluxos N8N prontos
│   ├── estetica-sales-flow.json
│   ├── whatsapp-chatbot.json
│   └── appointment-followup.json
│
├── scripts/                        # Scripts Python
│   ├── sync_leads.py
│   └── kommo/
│
├── integrations/                   # Pontes entre sistemas
│
├── guias/                          # Guias e tutoriais
│
├── comandos/                       # Scripts de automação CMD
│
├── database/                       # Schema SQL
│   └── schema.sql
│
├── docs/                           # Documentação
│   ├── PLANO_DELEGACAO.md
│   ├── COMO_VAI_FUNCIONAR.md
│   └── ANALISE_FERRAMENTAS_EXTRAS.md
│
├── docker-compose.yml
├── .env.example
├── ROADMAP_DEFINITIVO.md           # ESTE ARQUIVO
└── README.md
```

---

## 🆘 SE PRECISAR DE AJUDA

1. **Erro no código:** Cola no Perplexity ou Claude
2. **Dúvida de arquitetura:** Releia `/arquitetura/`
3. **Problema com ferramenta:** Veja `/ferramentas/[nome]/`
4. **Quer continuar com Manus:** Manda o link do commit e pergunta

---

**Última atualização:** 14/01/2026
**Autor:** Manus + Lucas
**Versão:** 1.0
