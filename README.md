# 🏥 Estética Sales System (CRM Tigre)

> Sistema completo de gestão para clínicas de estética com leads, agendamentos, pagamentos PIX/Boleto e analytics executivo.

[![FastAPI](https://img.shields.io/badge/FastAPI-0.109.0-009688.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-16.13.1-61DAFB.svg)](https://reactjs.org)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB.svg)](https://www.python.org)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📋 Índice

- [Features](#-features)
- [Tecnologias](#-tecnologias)
- [Quick Start](#-quick-start)
- [Documentação](#-documentação)
- [Roadmap](#-roadmap)

---

## ✨ Features

### ✅ Gestão de Leads
- ✅ Captura multi-canal (Instagram, WhatsApp, Site, Manual)
- ✅ Tracking de status (novo → convertido)
- ✅ Conversão automática para paciente
- ✅ Lead Scoring automático (0-100 pontos)
- ✅ Temperatura do lead (quente/morno/frio)

### ✅ Agendamentos
- ✅ Calendário visual de agendamentos
- ✅ Vinculação paciente + procedimento
- ✅ Confirmação/cancelamento
- ✅ Filtros avançados

### ✅ Pagamentos
- ✅ **PIX Gerencianet** (QR Code dinâmico)
- ✅ **PIX + Boleto Asaas**
- ✅ Webhooks automáticos
- ✅ Registro manual (Dinheiro, Cartão)
- ✅ Aplicação de descontos

### ✅ Analytics & Dashboards
- ✅ KPIs em tempo real
- ✅ Funil de conversão detalhado
- ✅ Dashboard executivo completo
- ✅ Comparação entre períodos
- ✅ Top procedimentos/pacientes

### ✅ Relatórios
- ✅ PDF mensal automatizado
- ✅ Excel de agendamentos
- ✅ Excel financeiro
- ✅ Exportação personalizada

### ✅ Segurança
- ✅ Autenticação JWT
- ✅ Roles (Admin, Atendente, Médico)
- ✅ Criptografia de credenciais (Fernet 256-bit)
- ✅ Multi-tenant (isolamento por clínica)

### ✅ Integrações
- ✅ Gerencianet PIX
- ✅ Asaas (PIX + Boleto)
- ✅ N8N workflows (8 prontos)
- ⚠️ Kommo CRM (scripts prontos)
- ⚠️ WhatICKET (cliente pronto, não integrado)

---

## 🛠️ Tecnologias

### Backend
- **FastAPI** 0.109.0 (async-first)
- **SQLAlchemy** 2.0.25 (ORM)
- **PostgreSQL** 15 / SQLite (dev)
- **Redis** 7 (cache)
- **Pydantic** 2.5.3 (validação)
- **HTTPX** (async HTTP)
- **ReportLab** (PDF), **XlsxWriter** (Excel)

### Frontend
- **React** 16.13.1
- **Material-UI** 4.12.3
- **Axios** (HTTP)
- **React Router** 5.2.0
- **React Query** 3.39.3

### Infraestrutura
- **Docker** + **Docker Compose**
- **Nginx** (reverse proxy)
- **N8N** (automação)
- **Gunicorn** + **Uvicorn** (ASGI)

---

## 🚀 Quick Start

### Pré-requisitos

- **Python** 3.11+
- **Node.js** 14+
- **Docker** (opcional, recomendado)

### 1. Setup Inicial (5 minutos)

```bash
# Clone o repositório
git clone https://github.com/lucastigrereal-dev/estetica-sales-system.git
cd estetica-sales-system

# Execute o script de setup
python setup_inicial.py
```

O script vai criar:
- ✅ Banco de dados SQLite
- ✅ Tabelas do sistema
- ✅ Clínica inicial
- ✅ Usuário admin
- ✅ 8 procedimentos padrão

### 2. Rodar o Sistema

#### Opção A: Docker (Recomendado)

```bash
docker-compose up -d
```

**Acesse:**
- Frontend: http://localhost
- API: http://localhost:8000
- Docs: http://localhost:8000/docs
- N8N: http://localhost:5678

#### Opção B: Local (Desenvolvimento)

```bash
# Terminal 1 - Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd crm-tigre/frontend
npm install
npm start
```

**Acesse:**
- Frontend: http://localhost:3000
- API: http://localhost:8000

### 3. Login

Use o **email** e **senha** criados no setup inicial.

---

## 📚 Documentação

- **[START.md](START.md)** - Guia rápido de início
- **[SDRPREMIUM.md](SDRPREMIUM.md)** - Relatório técnico completo (47KB)
- **API Docs**: http://localhost:8000/docs (Swagger UI)
- **Redoc**: http://localhost:8000/redoc

### Estrutura do Projeto

```
estetica-sales-system/
├── backend/              # FastAPI Backend
│   ├── app/
│   │   ├── routers/     # 10 módulos de API
│   │   ├── services/    # Gerencianet, Asaas, PDF, Excel
│   │   ├── models.py    # SQLAlchemy Models
│   │   ├── schemas.py   # Pydantic Schemas
│   │   └── main.py      # Entry point
│   ├── requirements.txt
│   └── Dockerfile
├── crm-tigre/
│   └── frontend/        # React Frontend
├── n8n-workflows/       # 8 workflows de automação
├── scripts/             # Scripts Kommo CRM
├── setup_inicial.py     # Script de setup
├── docker-compose.yml
└── START.md             # Guia de início
```

---

## 🎯 Roadmap

### ✅ Concluído (v2.0.0)
- ✅ Backend FastAPI completo
- ✅ Autenticação JWT + Roles
- ✅ Gestão de Leads + Lead Scoring
- ✅ Agendamentos
- ✅ Pagamentos PIX/Boleto (2 providers)
- ✅ Dashboard executivo
- ✅ Relatórios PDF/Excel
- ✅ Frontend React funcional
- ✅ Docker Compose pronto

### 🔜 Próximas Features

#### Q1 2026
- [ ] Testes automatizados (pytest)
- [ ] CI/CD GitHub Actions
- [ ] Deploy Railway/AWS
- [ ] Notificações Email (SendGrid)
- [ ] Lembretes automáticos WhatsApp

#### Q2 2026
- [ ] Portal do Paciente
- [ ] Gestão de Profissionais
- [ ] Prontuário Eletrônico
- [ ] Fotos antes/depois (S3)

#### Q3 2026
- [ ] Campanhas de Marketing
- [ ] Analytics Avançados (ML)
- [ ] Chatbot GPT-4
- [ ] Recomendações inteligentes

#### Q4 2026
- [ ] App Mobile (React Native)
- [ ] Marketplace de Clínicas
- [ ] White Label

---

## 📊 Status do Projeto

| Componente | Status | Coverage |
|------------|--------|----------|
| Backend API | ✅ 95% | - |
| Autenticação | ✅ 100% | - |
| Pagamentos | ✅ 95% | - |
| Frontend | ✅ 90% | - |
| Testes | ❌ 0% | 0% |
| Docs | ✅ 80% | - |

**Pronto para Produção:** ⚠️ Requer testes + CI/CD

---

## 🤝 Contribuindo

Pull requests são bem-vindos! Para mudanças maiores:

1. Abra uma issue primeiro
2. Fork o projeto
3. Crie sua branch (`git checkout -b feature/AmazingFeature`)
4. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
5. Push para a branch (`git push origin feature/AmazingFeature`)
6. Abra um Pull Request

---

## 📝 License

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 👨‍💻 Autor

**Lucas Tigre**
- GitHub: [@lucastigrereal-dev](https://github.com/lucastigrereal-dev)
- Projeto: [estetica-sales-system](https://github.com/lucastigrereal-dev/estetica-sales-system)

---

## 🙏 Agradecimentos

- FastAPI pela framework incrível
- Material-UI pelo design system
- Comunidade open-source

---

## 📈 Métricas

- **Linhas de Código**: ~4.500+
- **Endpoints API**: 40+
- **Tabelas DB**: 8
- **Integrações**: 4
- **Workflows N8N**: 8

---

**Feito com ❤️ para clínicas de estética**
