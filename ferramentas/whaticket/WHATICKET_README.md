# 💬 Whaticket - Sistema de Atendimento Multi-Usuário

## O que é
Whaticket é um sistema de atendimento ao cliente via WhatsApp com suporte a múltiplos atendentes, filas, chatbot e kanban.

## Funcionalidades

### Atendimento
- **Multi-usuários** - Vários atendentes simultâneos
- **Filas/Departamentos** - Organização por setor (Vendas, Suporte, etc)
- **Kanban** - Visualização de tickets em colunas
- **Dark Mode** - Tema escuro
- **Tags** - Etiquetas para organização

### Chatbot
- **Respostas automáticas** - Fluxos de atendimento
- **Variáveis** - Personalização de mensagens
- **Horário de funcionamento** - Mensagens fora do expediente

### Gestão
- **Dashboard** - Estatísticas de atendimento
- **Relatórios** - Tempo de resposta, tickets fechados
- **Planos** - Sistema multi-tenant (SaaS)

## Estrutura do Código

```
whaticket/
├── backend/                 # API Node.js + TypeScript
│   ├── src/
│   │   ├── controllers/     # Controladores
│   │   ├── database/        # Migrations e seeds
│   │   ├── helpers/         # Funções auxiliares
│   │   ├── libs/            # Bibliotecas (Baileys)
│   │   ├── middleware/      # Autenticação, etc
│   │   ├── models/          # Modelos Sequelize
│   │   ├── routes/          # Rotas da API
│   │   └── services/        # Lógica de negócio
│   └── package.json
│
└── frontend/                # React + Material-UI
    ├── src/
    │   ├── components/      # Componentes React
    │   ├── context/         # Contextos (Auth, etc)
    │   ├── hooks/           # Custom hooks
    │   ├── layout/          # Layout principal
    │   ├── pages/           # Páginas
    │   └── services/        # API calls
    └── package.json
```

## Tecnologias

### Backend
- Node.js + TypeScript
- Express
- Sequelize (ORM)
- Baileys 6.5.0 (WhatsApp)
- Socket.io (Real-time)
- MySQL/PostgreSQL

### Frontend
- React
- Material-UI
- Socket.io-client
- Axios

## Instalação

### Requisitos
- Node.js 16+
- MySQL ou PostgreSQL
- Redis (opcional)
- VPS com 2GB RAM mínimo

### Backend
```bash
cd backend
cp .env.example .env
# Editar .env com suas configurações
npm install
npx sequelize db:migrate
npm run dev
```

### Frontend
```bash
cd frontend
cp .env.example .env
# Editar .env com URL do backend
npm install
npm start
```

## Integração com o Sistema de Estética

### Fluxo de Atendimento
1. Lead chega via **WaSender** (prospecção)
2. Se responder, é direcionado para **Whaticket**
3. Atendente qualifica e agenda procedimento
4. **N8N** envia lembretes automáticos

### Filas Recomendadas
- **Vendas** - Novos leads
- **Agendamento** - Marcação de procedimentos
- **Suporte** - Dúvidas pós-procedimento
- **Financeiro** - Pagamentos e parcelamentos

### Chatbot Inicial
```
Olá! 👋 Bem-vindo(a) à [Clínica]!

Escolha uma opção:
1️⃣ Agendar procedimento
2️⃣ Ver preços
3️⃣ Falar com atendente
4️⃣ Horário de funcionamento
```

## Avisos Importantes

⚠️ **VPS Necessária** - Não roda em hospedagem compartilhada
⚠️ **Baileys** - Usa API não-oficial do WhatsApp
⚠️ **Backup** - Faça backup do banco diariamente
⚠️ **SSL** - Obrigatório para produção

## Hospedagem Recomendada
- Contabo VPS (~$5/mês)
- Hetzner (~$4/mês)
- DigitalOcean ($6/mês)
- AWS Lightsail ($5/mês)
