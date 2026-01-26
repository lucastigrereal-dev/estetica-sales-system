# 🚀 GUIA RÁPIDO - ESTÉTICA SALES SYSTEM

## ⚡ SETUP INICIAL (5 MINUTOS)

### 1️⃣ Executar Script de Setup

```bash
# No diretório estetica-sales-system
python setup_inicial.py
```

O script vai perguntar:
- Nome da clínica
- CNPJ (opcional)
- Telefone
- Email
- Endereço
- **Seu nome**
- **Seu email de login**
- **Sua senha**

✅ Pronto! Clínica e usuário admin criados.

---

## 2️⃣ RODAR O SISTEMA

### Opção A: Docker (Recomendado - Tudo automático)

```bash
# Subir todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

**Acesse:**
- 🌐 **Frontend**: http://localhost
- 🔧 **API Backend**: http://localhost:8000
- 📚 **Documentação**: http://localhost:8000/docs
- 🤖 **N8N Automação**: http://localhost:5678

---

### Opção B: Local (Desenvolvimento)

#### Terminal 1 - Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### Terminal 2 - Frontend

```bash
cd crm-tigre/frontend
npm install
npm start
```

**Acesse:**
- 🌐 **Frontend**: http://localhost:3000
- 🔧 **Backend**: http://localhost:8000

---

## 3️⃣ FAZER LOGIN

1. Acesse http://localhost (ou http://localhost:3000 se rodando local)
2. Use o **email** e **senha** que você criou no setup
3. ✅ Pronto! Você está dentro do sistema

---

## 📊 O QUE VOCÊ PODE FAZER AGORA

### ✅ Gestão de Leads
- Cadastrar novos leads (Instagram, WhatsApp, Site, Manual)
- Acompanhar status (novo → contatado → interessado → agendado → convertido)
- Converter leads em pacientes

### ✅ Agendamentos
- Criar agendamentos para pacientes
- Vincular procedimentos
- Confirmar/cancelar agendamentos
- Ver agenda do dia/semana/mês

### ✅ Pagamentos
- Gerar PIX instantâneo (Gerencianet)
- Gerar PIX ou Boleto (Asaas)
- Registrar pagamentos manuais (Dinheiro, Cartão)
- Aplicar descontos
- Ver histórico financeiro

### ✅ Dashboard & Relatórios
- KPIs em tempo real
- Funil de conversão
- Receita por período
- Top procedimentos
- Exportar relatórios em PDF/Excel

---

## 🔧 CONFIGURAÇÕES OPCIONAIS

### Credenciais de Pagamento

1. Vá em **Configurações** → **Credenciais de Pagamento**
2. Escolha o provider:
   - **Gerencianet**: Client ID + Secret + Certificado
   - **Asaas**: API Key
3. Ative/desative modo **Sandbox** (teste)
4. Salvar

**Sem credenciais:** Sistema funciona normalmente, mas pagamentos PIX/Boleto não são gerados automaticamente.

---

## 📚 DOCUMENTAÇÃO TÉCNICA

- **Relatório Completo**: `SDRPREMIUM.md`
- **API Docs (Swagger)**: http://localhost:8000/docs
- **Redoc**: http://localhost:8000/redoc

---

## 🆘 PROBLEMAS COMUNS

### Erro: "Port 8000 already in use"
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8000 | xargs kill -9
```

### Erro: "Database not found"
```bash
# Rodar setup novamente
python setup_inicial.py
```

### Erro: "Cannot connect to backend"
```bash
# Verificar se backend está rodando
curl http://localhost:8000/health

# Deve retornar: {"status":"ok"}
```

### Frontend não carrega
```bash
# Limpar cache e reinstalar
cd crm-tigre/frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ **Cadastrar leads** (Menu: Leads → Novo Lead)
2. ✅ **Criar agendamentos** (Menu: Agendamentos → Novo)
3. ✅ **Ver Dashboard** (Menu: Dashboard)
4. ✅ **Gerar relatórios** (Menu: Relatórios)

---

## 💡 DICAS

- **Modo Sandbox**: Use para testar pagamentos sem dinheiro real
- **Backup**: Banco SQLite está em `backend/database/crm_tigre.db`
- **Logs**: Verifique `docker-compose logs -f backend` se houver erros
- **Porta ocupada?**: Altere em `docker-compose.yml` (ex: "8001:8000")

---

## 📞 SUPORTE

- **GitHub Issues**: https://github.com/lucastigrereal-dev/estetica-sales-system/issues
- **Documentação API**: http://localhost:8000/docs

---

**Sistema pronto para uso! 🎉**
