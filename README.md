# 💉 Sistema Unificado de Vendas de Estética

Sistema completo de prospecção, atendimento e agendamento para clínicas de estética.

---

## 🆕 UPGRADE: CRM TIGRE v2.0

Este repositório foi atualizado para incluir o **CRM Tigre** - um sistema de gestão empresarial completo e profissional.

### 📁 Estrutura do Repositório

```
estetica-sales-system/
│
├── crm-tigre/              # 🆕 NOVO SISTEMA COMPLETO
│   ├── docs/               # Documentação completa (8 arquivos)
│   ├── frontend/           # Next.js 14 + React + TailwindCSS
│   ├── backend/            # Node.js + tRPC + TypeScript
│   ├── prisma/             # Schema PostgreSQL
│   ├── ROADMAP_CRM_TIGRE.md
│   └── PROMPTS_CLAUDE_CODE_TIGRE.md
│
├── ferramentas/            # Ferramentas de automação Windows
│   ├── wacrm/              # CRM WhatsApp
│   ├── wasender/           # Disparador WhatsApp
│   ├── jarvee/             # Automação Instagram
│   └── whaticket/          # Atendimento multi-usuário
│
├── backend/                # API FastAPI (versão antiga)
├── scripts/                # Scripts de integração
├── n8n-workflows/          # Fluxos de automação
└── docs/                   # Documentação geral
```

---

## 🐯 CRM TIGRE - O Novo Sistema

O CRM Tigre é um upgrade massivo que transforma sua operação:

| Aspecto | Sistema Antigo | CRM Tigre |
|---------|----------------|-----------|
| **Frontend** | HTML básico | Next.js 14 + React |
| **Backend** | FastAPI (Python) | Node.js + tRPC |
| **Banco** | SQLite | PostgreSQL + Redis |
| **IA** | OpenAI básico | GPT-4 + Análise Sentimento |
| **WhatsApp** | WaSender (não-oficial) | WhatsApp Business API |
| **Pagamentos** | Nenhum | Stripe + Pix |
| **Calendário** | Manual | Google Calendar API |

### Resultados Esperados

| Métrica | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| **Faturamento** | R$ 30k | R$ 75k | **↑ 150%** |
| **Conversão** | 12.5% | 62-65% | **↑ 5x** |
| **No-show** | 20% | 2-5% | **↓ 90%** |
| **Seu Tempo** | 25h/sem | 4h/sem | **↓ 84%** |

### Como Começar

1. **Leia o ROADMAP:** `crm-tigre/ROADMAP_CRM_TIGRE.md`
2. **Execute os prompts:** `crm-tigre/PROMPTS_CLAUDE_CODE_TIGRE.md`
3. **Configure o .env:** `crm-tigre/.env.example`

---

## 🔧 Ferramentas de Automação (Windows)

Para prospecção e disparos em massa, use as ferramentas na pasta `ferramentas/`:

- **WaCRM** - Gestão de atendimento WhatsApp
- **WaSender** - Extração e disparos em massa
- **Jarvee** - Automação Instagram
- **Whaticket** - Atendimento multi-usuário

⚠️ **Atenção:** Essas ferramentas usam APIs não-oficiais e podem resultar em banimento.

---

## 📅 Timeline de Implementação

| Fase | Semanas | Entregáveis |
|------|---------|-------------|
| **MVP** | 1-4 | Pacientes, Agendamentos, Lembretes |
| **IA** | 5-8 | Anna Chatbot, Pagamentos, NPS |
| **Avançado** | 9-16 | Fidelidade, ML, Relatórios 360° |

---

## 👥 Contribuidores

- **lucastigrereal-dev** - Proprietário
- **claude** - Claude Code (desenvolvimento)
- **Manus AI** - Arquitetura e orquestração

---

**Versão:** 2.0  
**Data:** 14 de janeiro de 2026
