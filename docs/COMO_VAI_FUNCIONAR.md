# 🎯 COMO O SISTEMA VAI FUNCIONAR

Este documento explica a visão completa do sistema e como você vai construí-lo usando múltiplas IAs.

---

## 🏗️ ARQUITETURA GERAL

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SEU ECOSSISTEMA DE VENDAS                          │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────┐
                              │   VOCÊ      │
                              │  (Celular)  │
                              └──────┬──────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         │                           │                           │
         ▼                           ▼                           ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│    INSTAGRAM    │       │    WHATSAPP     │       │     KOMMO       │
│    (Jarvee)     │       │   (WaSender)    │       │   (API Oficial) │
│                 │       │                 │       │                 │
│ • Seguir        │       │ • Disparos      │       │ • Leads quentes │
│ • Curtir        │       │ • Extração      │       │ • Histórico     │
│ • DM automática │       │ • Grupos        │       │ • Funil oficial │
└────────┬────────┘       └────────┬────────┘       └────────┬────────┘
         │                         │                         │
         └─────────────────────────┼─────────────────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │     BANCO DE DADOS CENTRAL   │
                    │         (SQLite/Postgres)    │
                    │                              │
                    │  • leads                     │
                    │  • pacientes                 │
                    │  • agendamentos              │
                    │  • mensagens                 │
                    │  • campanhas                 │
                    └──────────────┬───────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
              ▼                    ▼                    ▼
   ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
   │      N8N         │ │    WHATICKET     │ │  SISTEMA CLÍNICA │
   │   (Automação)    │ │  (Atendimento)   │ │   (Agendamento)  │
   │                  │ │                  │ │                  │
   │ • Chatbot IA     │ │ • Multi-usuário  │ │ • Agenda         │
   │ • Lembretes      │ │ • Kanban         │ │ • Pacientes      │
   │ • Follow-up      │ │ • Filas          │ │ • Procedimentos  │
   └──────────────────┘ └──────────────────┘ └──────────────────┘
```

---

## 🔄 FLUXO DE UM LEAD (Do Zero ao Agendamento)

### ETAPA 1: PROSPECÇÃO
```
Jarvee (Instagram)          WaSender (WhatsApp)         Kommo (Frios)
       │                           │                         │
       │ Segue perfis de           │ Extrai números do       │ Exporta leads
       │ clínicas concorrentes     │ Google Maps             │ sem resposta
       │                           │                         │
       ▼                           ▼                         ▼
   DM automática              Disparo em massa          Script Python
   "Oi! Vi que você           "Olá! Avaliação           extrai e prepara
   curte estética..."         gratuita de Botox..."     para disparo
```

### ETAPA 2: PRIMEIRO CONTATO
```
Lead responde "Tenho interesse"
              │
              ▼
┌─────────────────────────────────┐
│  N8N detecta via webhook        │
│  • Classifica intenção com IA   │
│  • Salva no banco como lead     │
│  • Envia resposta automática    │
└─────────────────────────────────┘
              │
              ▼
"Que ótimo! Qual procedimento te interessa?
 1️⃣ Botox
 2️⃣ Preenchimento
 3️⃣ Harmonização"
```

### ETAPA 3: QUALIFICAÇÃO
```
Lead responde "Botox"
              │
              ▼
┌─────────────────────────────────┐
│  N8N atualiza lead              │
│  • interesse = "botox"          │
│  • status = "qualificado"       │
│  • Envia vídeo explicativo      │
└─────────────────────────────────┘
              │
              ▼
"Perfeito! O Botox custa R$800 e dura 30 min.
 Quer agendar uma avaliação gratuita?"
```

### ETAPA 4: AGENDAMENTO
```
Lead responde "Sim, quero agendar"
              │
              ▼
┌─────────────────────────────────┐
│  N8N ou Atendente humano        │
│  • Oferece horários disponíveis │
│  • Cria agendamento no sistema  │
│  • Converte lead em paciente    │
└─────────────────────────────────┘
              │
              ▼
Sistema Clínica registra:
• Paciente: Maria Silva
• Procedimento: Botox
• Data: 20/01/2026 14:00
• Profissional: Dra. Ana
```

### ETAPA 5: CONFIRMAÇÃO AUTOMÁTICA
```
24 horas antes do agendamento
              │
              ▼
┌─────────────────────────────────┐
│  N8N dispara lembrete           │
│  "Olá Maria! Lembrando do seu   │
│   agendamento amanhã às 14h.    │
│   Confirma? Responda SIM"       │
└─────────────────────────────────┘
              │
              ▼
Lead responde "SIM"
              │
              ▼
Sistema atualiza: confirmacao_recebida = 1
```

---

## 🛠️ COMO VOCÊ VAI CONSTRUIR (Delegação)

### VOCÊ (Orquestrador)
- Define o que precisa
- Distribui tarefas para as IAs
- Testa e integra os códigos
- Faz commit no GitHub

### MANUS (Eu - Arquiteto)
- Crio a estrutura e os tickets
- Reviso códigos que você me manda
- Integro as partes
- Documento tudo

### LLAMA (Local - Código Pesado)
- Gera scripts Python
- Cria APIs
- Processa dados
- Não gasta créditos

### CLAUDE CODE (VS Code)
- Código complexo
- Debugging
- Refatoração
- Integração

### GPT CODEX (CMD)
- Scripts rápidos
- Automações
- Testes

### PERPLEXITY / GENSPARK
- Pesquisa de APIs
- Documentação
- Tutoriais
- Troubleshooting

---

## 📋 ORDEM DE EXECUÇÃO DOS TICKETS

| Ordem | Ticket | IA Sugerida | Tempo Est. | Dependência |
|-------|--------|-------------|------------|-------------|
| 1 | Schema do Banco | ✅ FEITO | - | - |
| 2 | API Backend | Llama/Claude | 2h | Ticket 1 |
| 3 | Scripts Kommo | Llama | 1h | Ticket 1 |
| 4 | Fluxos N8N | Perplexity | 1h | Ticket 2 |
| 5 | Frontend | Claude Code | 3h | Ticket 2 |
| 6 | Integração Whaticket | Claude | 1h | Ticket 4 |
| 7 | Docker | GPT Codex | 30min | Todos |
| 8 | Documentação | Perplexity | 1h | Todos |

---

## 📁 ESTRUTURA FINAL DO REPOSITÓRIO

```
estetica-sales-system/
├── backend/                    # API REST (FastAPI)
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── database.py
│   │   └── routers/
│   └── requirements.txt
│
├── frontend/                   # Dashboard (React)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
│
├── n8n-workflows/              # Fluxos de automação
│   ├── estetica-sales-flow.json
│   ├── whatsapp-chatbot.json
│   └── appointment-followup.json
│
├── scripts/                    # Scripts Python
│   ├── sync_leads.py
│   └── kommo/
│       ├── kommo_export.py
│       ├── prepare_campaign.py
│       ├── track_responses.py
│       └── kommo_import.py
│
├── integrations/               # Pontes entre sistemas
│   └── whaticket-n8n-bridge.js
│
├── database/                   # Schema e migrations
│   └── schema.sql
│
├── docs/                       # Documentação
│   ├── PLANO_DELEGACAO.md
│   ├── COMO_VAI_FUNCIONAR.md
│   └── ANALISE_FERRAMENTAS_EXTRAS.md
│
├── exports/                    # Arquivos exportados
├── responses/                  # Respostas rastreadas
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🚀 PRÓXIMO PASSO IMEDIATO

1. **Abra o Llama no VS Code**
2. **Cole o TICKET #1 (API Backend)** do arquivo `PLANO_DELEGACAO.md`
3. **Salve os arquivos gerados** na pasta `/backend/`
4. **Faça commit:** `git add . && git commit -m "feat: backend API" && git push`
5. **Me avisa** que terminou para eu revisar

---

## 💡 DICAS DE PRODUTIVIDADE

1. **Abra 4 abas do CMD:**
   - Aba 1: Llama gerando código
   - Aba 2: Git (commits)
   - Aba 3: Testes (python/node)
   - Aba 4: Logs

2. **Fluxo rápido:**
   ```
   Llama gera → Você salva → Git commit → Me manda link → Eu reviso
   ```

3. **Se der erro:**
   - Cola o erro no Perplexity
   - Ou me manda aqui que eu ajudo

---

**Vamos construir essa máquina de vendas! 🚀**
