# 🐯 CRM TIGRE

## Sistema Completo de Gestão para Clínicas de Estética

O CRM Tigre é construído **em cima do Whaticket**, aproveitando um sistema já testado e funcional para economizar 60+ horas de desenvolvimento.

---

## ⚡ ESTRATÉGIA: WHATICKET + MÓDULOS DE ESTÉTICA

O Whaticket (em `ferramentas/whaticket/`) já oferece autenticação, WhatsApp, chat, kanban e multi-tenant. O CRM Tigre adiciona os módulos específicos para clínicas de estética.

| Whaticket (Base) | CRM Tigre (Adiciona) |
|------------------|----------------------|
| ✅ Auth + Usuários | 📋 Pacientes |
| ✅ WhatsApp (Baileys) | 💉 Procedimentos |
| ✅ Chat/Tickets | 📅 Agendamentos |
| ✅ Kanban | 💳 Financeiro |
| ✅ Multi-tenant | 🤖 Anna IA |
| ✅ Filas | ⏰ Lembretes |
| ✅ Chatbot básico | 📊 Dashboard |

---

## 🎯 RESULTADOS ESPERADOS

| Métrica | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| Faturamento | R$ 30k | R$ 75k | **+150%** |
| Conversão | 12.5% | 62-65% | **+5x** |
| No-show | 20% | 2-5% | **-90%** |
| Seu tempo admin | 25h/sem | 4h/sem | **-84%** |

---

## 📅 TIMELINE: 8 SEMANAS

| Fase | Semanas | O que entrega |
|------|---------|---------------|
| Fundação | 1-2 | Pacientes + Agendamentos |
| Monetização | 3-4 | Financeiro + Anna IA |
| Automação | 5-6 | Lembretes + Dashboard |
| Produção | 7-8 | Deploy + Testes |

---

## 🚀 COMO COMEÇAR

### 1. Clone e prepare
```bash
git clone https://github.com/lucastigrereal-dev/estetica-sales-system.git
cd estetica-sales-system
cp -r ferramentas/whaticket/whaticket-saas crm-tigre/
```

### 2. Execute os prompts
Abra `PROMPTS_CLAUDE_CODE_TIGRE.md` e execute cada prompt no Claude Code, na ordem.

### 3. Suba em produção
```bash
docker-compose up -d
```

---

## 📁 ARQUIVOS IMPORTANTES

| Arquivo | Descrição |
|---------|-----------|
| `ROADMAP_CRM_TIGRE.md` | Timeline completa e checklist |
| `PROMPTS_CLAUDE_CODE_TIGRE.md` | 8 prompts para o Claude Code |
| `.env.example` | Variáveis de ambiente |
| `docs/` | Documentação completa (8 arquivos) |

---

## 💰 ECONOMIA

| Abordagem | Tempo | Custo |
|-----------|-------|-------|
| Do zero | 160h | R$ 16k |
| Com Whaticket | 40h | R$ 4k |
| **Economia** | **120h** | **R$ 12k** |

---

**Versão:** 3.0  
**Data:** 14 de janeiro de 2026  
**Base:** Whaticket SaaS
