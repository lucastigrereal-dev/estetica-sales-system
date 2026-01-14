# 🐯 CRM TIGRE

## Sistema Completo de Gestão para Clínicas de Estética

O CRM Tigre é um sistema de gestão empresarial completo, desenvolvido especificamente para clínicas de estética. Ele automatiza 95% das tarefas administrativas, permitindo que você foque no que realmente importa: seus pacientes.

---

## 🎯 Resultados Esperados

| Métrica | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| **Faturamento Mensal** | R$ 30.000 | R$ 75.000 | **↑ 150%** |
| **Ticket Médio** | R$ 2.000 | R$ 2.850 | **↑ 42%** |
| **Taxa Conversão** | 12.5% | 62-65% | **↑ 5x** |
| **No-show** | 20% | 2-5% | **↓ 90%** |
| **Retenção Pacientes** | 30% | 80%+ | **↑ 2.7x** |
| **Seu Tempo Admin** | 25h/semana | 4h/semana | **↓ 84%** |

---

## ✨ Funcionalidades

### 📋 Gestão de Pacientes
- Cadastro completo com histórico
- Classificação automática (Ouro, Prata, Bronze)
- Múltiplos telefones e endereços
- Procedimento favorito identificado

### 📅 Agendamentos Inteligentes
- Calendário visual (dia/semana/mês)
- Sincronização Google Calendar
- Detecção de conflitos
- Bloqueio de horários

### 🤖 Anna - Assistente IA
- Chatbot WhatsApp 24/7
- Qualificação automática de leads
- 4 perguntas estratégicas
- Score de interesse (0-100)
- Agendamento automático

### ⏰ Lembretes Automáticos
- WhatsApp 24h antes
- WhatsApp 2h antes
- Confirmação com 1 clique
- SMS como backup

### 💳 Pagamentos Integrados
- Stripe (cartão + Pix)
- Link de pagamento via WhatsApp
- Cobrança recorrente
- Reembolso automático

### 📊 Dashboard Executivo
- KPIs em tempo real
- Gráficos de faturamento
- Taxa de conversão
- Relatórios automáticos

### ⭐ Programa de Fidelidade
- Pontos por procedimento
- Níveis (Bronze → Platina)
- Resgate automático
- Bônus de aniversário

### 📈 Inteligência Avançada
- Análise de sentimento (IA)
- Detecção de abandono (ML)
- Reativação automática
- Upsell inteligente

---

## 🛠 Stack Tecnológico

### Frontend
- **Framework:** Next.js 14 (React 18)
- **Linguagem:** TypeScript
- **Styling:** TailwindCSS
- **UI Components:** Radix UI
- **State:** TanStack Query + Zustand
- **Deploy:** Vercel

### Backend
- **Runtime:** Node.js 20
- **Framework:** Express.js + tRPC
- **Linguagem:** TypeScript
- **Queue:** Bull
- **Real-time:** Socket.io
- **Deploy:** Railway ou Render

### Database
- **SQL:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **Cache:** Redis
- **Backups:** Automated 7-day retention

### Integrações
- **IA:** OpenAI (GPT-4)
- **Messaging:** WhatsApp Business API
- **Calendar:** Google Calendar
- **Payments:** Stripe + Pix
- **Email:** SendGrid
- **Storage:** AWS S3

---

## 📁 Estrutura do Projeto

```
crm-tigre/
├── docs/                    # Documentação completa
├── frontend/                # Next.js 14 + React
├── backend/                 # Node.js + tRPC
├── prisma/                  # Schema do banco
├── automations/             # Fluxos N8N
├── integrations/            # Configs de integrações
├── scripts/                 # Scripts utilitários
├── ROADMAP_CRM_TIGRE.md     # Plano de 16 semanas
└── PROMPTS_CLAUDE_CODE_TIGRE.md  # Prompts para desenvolvimento
```

---

## 🚀 Como Começar

### 1. Clone o repositório
```bash
git clone https://github.com/lucastigrereal-dev/estetica-sales-system.git
cd estetica-sales-system/crm-tigre
```

### 2. Leia a documentação
```
docs/01-crm_tigre_checklist_inicio.md  # Checklist inicial
docs/02-crm_tigre_plano_acao.md        # Plano de 16 semanas
docs/05-resumo_executivo_crm_tigre.md  # Resumo executivo
```

### 3. Execute os prompts do Claude Code
```
PROMPTS_CLAUDE_CODE_TIGRE.md  # 8 prompts na ordem
```

### 4. Configure as variáveis de ambiente
```bash
cp .env.example .env
# Edite .env com suas credenciais
```

### 5. Suba o ambiente
```bash
docker-compose up -d
```

---

## 📅 Timeline de Implementação

| Fase | Semanas | Entregáveis |
|------|---------|-------------|
| **MVP** | 1-4 | Pacientes, Agendamentos, Lembretes |
| **IA** | 5-8 | Anna Chatbot, Pagamentos, NPS |
| **Avançado** | 9-16 | Fidelidade, ML, Relatórios 360° |

---

## 💰 Investimento

### Desenvolvimento
- **Total:** R$ 58.800 (uma vez)

### Infraestrutura (mensal)
- **Total:** ~R$ 3-4k/mês

### ROI
- **Payback:** 3 meses
- **ROI Year 1:** 382%
- **ROI Year 2:** 850%+

---

## 📞 Suporte

Para dúvidas sobre implementação, consulte:
- `docs/06-DOCUMENTACAO_FINAL_COMPLETA.md`
- `docs/07-crm_tigre_arquitetura_completa.md`

---

**Versão:** 2.0  
**Data:** 14 de janeiro de 2026  
**Desenvolvido com:** 🤖 Manus AI + Claude Code
