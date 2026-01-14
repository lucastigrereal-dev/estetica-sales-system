# 💉 Sistema Unificado de Vendas de Estética

Sistema completo de prospecção, atendimento e agendamento para clínicas de estética.

---

## 🐯 CRM TIGRE v3.0 (ATUALIZADO)

O CRM Tigre agora usa o **Whaticket como base**, economizando 60+ horas de desenvolvimento.

### 📁 Estrutura do Repositório

```
estetica-sales-system/
│
├── crm-tigre/                  # 🐯 SISTEMA PRINCIPAL
│   ├── docs/                   # Documentação (8 arquivos)
│   ├── ROADMAP_CRM_TIGRE.md    # ⭐ COMECE AQUI
│   ├── PROMPTS_CLAUDE_CODE_TIGRE.md  # Prompts para Claude Code
│   └── .env.example            # Variáveis de ambiente
│
├── ferramentas/                # Ferramentas de automação
│   ├── whaticket/              # 📦 BASE DO CRM TIGRE
│   ├── wacrm/                  # CRM WhatsApp
│   ├── wasender/               # Disparador
│   └── jarvee/                 # Instagram
│
├── backend/                    # API FastAPI (versão antiga)
├── scripts/                    # Scripts de integração
└── n8n-workflows/              # Fluxos N8N
```

---

## ⚡ COMO COMEÇAR

### 1. Leia o ROADMAP
```
crm-tigre/ROADMAP_CRM_TIGRE.md
```

### 2. Execute os Prompts
```
crm-tigre/PROMPTS_CLAUDE_CODE_TIGRE.md
```
São 8 prompts para o Claude Code executar. Rode na ordem.

### 3. Faça Deploy
```bash
docker-compose up -d
```

---

## 📊 ECONOMIA COM WHATICKET

| Abordagem | Tempo | Custo |
|-----------|-------|-------|
| Do zero | 160h | R$ 16k |
| Com Whaticket | 40h | R$ 4k |
| **Economia** | **120h** | **R$ 12k** |

O Whaticket já tem: Auth, WhatsApp, Chat, Kanban, Multi-tenant, Filas.
Você só adiciona: Pacientes, Agendamentos, Financeiro, Anna IA, Dashboard.

---

## 📅 TIMELINE: 8 SEMANAS

| Fase | Semanas | Entregáveis |
|------|---------|-------------|
| Fundação | 1-2 | Pacientes + Agendamentos |
| Monetização | 3-4 | Financeiro + Anna IA |
| Automação | 5-6 | Lembretes + Dashboard |
| Produção | 7-8 | Deploy + Testes |

---

## 👥 Contribuidores

- **lucastigrereal-dev** - Proprietário
- **claude** - Claude Code
- **Manus AI** - Arquitetura

---

**Versão:** 3.0  
**Data:** 14 de janeiro de 2026
