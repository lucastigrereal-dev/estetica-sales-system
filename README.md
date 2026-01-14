# 💉 Sistema Unificado de Vendas de Estética

Sistema completo de prospecção, atendimento e agendamento para clínicas de estética, integrando múltiplas ferramentas de automação WhatsApp.

## 🎯 Visão Geral

Este sistema unifica as funcionalidades de:
- **WaCRM** - Gestão de atendimento e CRM
- **WaSender** - Prospecção e disparos em massa
- **Sistema Clínica** - Gestão de agendamentos e pacientes
- **N8N** - Automação de fluxos e integração
- **Escala iPhone** - Múltiplos números WhatsApp

## 📁 Estrutura do Projeto

```
estetica-sales-system/
├── database/
│   └── schema.sql          # Schema do banco de dados unificado
├── scripts/
│   └── sync_leads.py       # Script de sincronização de leads
├── n8n-workflows/
│   ├── estetica-sales-flow.json    # Fluxo principal customizado
│   ├── whatsapp-chatbot.json       # Chatbot WhatsApp com IA
│   ├── appointment-followup.json   # Follow-up de agendamentos
│   ├── lead-management.json        # Gestão de leads
│   └── whatsapp-basic.json         # Chatbot básico
├── config/
│   └── settings.json       # Configurações do sistema
├── docs/
│   └── guia-implementacao.md
└── frontend/
    └── (UI Kit FluxCRM - Figma)
```

## 🚀 Instalação

### 1. Banco de Dados
```bash
# Criar o banco SQLite
sqlite3 database/estetica_sales.db < database/schema.sql
```

### 2. Dependências Python
```bash
pip install pandas openpyxl
```

### 3. Configurar N8N
1. Importe os workflows da pasta `n8n-workflows/` no seu N8N
2. Configure as credenciais:
   - OpenAI API Key
   - WhatsApp API (Evolution API ou similar)
   - Banco de dados SQLite

### 4. Configurar WaCRM/WaSender
Ajuste os caminhos no arquivo `scripts/sync_leads.py`:
```python
CONFIG = {
    "wacrm_db": r"C:\Program Files\WaCRM\db.db",
    "wasender_db": r"C:\Program Files\WASender\db.db",
    "unified_db": "./database/estetica_sales.db",
}
```

## 📊 Fluxo de Vendas

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  WaSender   │────▶│   WaCRM     │────▶│   N8N       │────▶│  Clínica    │
│ (Prospecção)│     │ (Atendimento)│     │ (Automação) │     │(Agendamento)│
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
      │                   │                   │                   │
      ▼                   ▼                   ▼                   ▼
   Extração           Qualificação        Resposta IA         Consulta
   de Leads           do Lead             Automática          Realizada
```

## 🔧 Funcionalidades

### Prospecção (WaSender)
- Extração de leads do Google Maps
- Filtro de números válidos
- Disparos em massa com delay

### Atendimento (WaCRM)
- Gestão de múltiplas sessões WhatsApp
- Key Markers para organização
- Lembretes de follow-up

### Automação (N8N)
- Chatbot com IA para qualificação
- Lembretes automáticos 24h antes
- Integração com banco de dados

### Gestão (Sistema Clínica)
- Cadastro de pacientes
- Agendamento de procedimentos
- Histórico de atendimentos

## 📱 Escala de Números (iPhone)

Para operar múltiplos números:
1. Acesse `udid.tech` no Safari do iPhone
2. Baixe o perfil de desenvolvedor
3. Instale via Ajustes > Geral > VPN e Dispositivo
4. Baixe as versões duplicadas do WhatsApp Business

**Limite recomendado:** 50 mensagens/dia por número

## 🎨 Interface (UI Kit)

O projeto inclui o UI Kit **FluxCRM** (Figma) para desenvolvimento do front-end.
Arquivo: `frontend/FluxCRM - CRM Dashboard UI Kit.fig`

## ⚠️ Avisos Importantes

1. **Risco de Banimento:** Automação via interface viola os termos do WhatsApp
2. **Delays Obrigatórios:** Sempre use intervalos de 30-60s entre mensagens
3. **Backup:** Faça backup regular do arquivo `estetica_sales.db`

## 📞 Procedimentos Incluídos

| Procedimento | Preço | Duração |
|-------------|-------|---------|
| Botox | R$ 800 | 30 min |
| Preenchimento Labial | R$ 1.200 | 45 min |
| Bioestimulador | R$ 2.500 | 60 min |
| Harmonização Facial | R$ 3.500 | 120 min |
| Lipo de Papada | R$ 1.800 | 45 min |
| Skinbooster | R$ 900 | 30 min |

## 📄 Licença

Este projeto é para uso pessoal/comercial do proprietário.

---
**Desenvolvido com 🤖 Manus AI**
