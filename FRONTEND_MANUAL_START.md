# 🎨 COMO INICIAR O FRONTEND MANUALMENTE

## ⚠️ SITUAÇÃO ATUAL:

O frontend está com dependências instaladas, mas está demorando para compilar via script automático.

**Recomendação:** Iniciar em um terminal separado para ver o progresso em tempo real.

---

## 🚀 INICIAR FRONTEND (Passo a Passo):

### **Opção 1: Terminal Separado (Recomendado)**

1. **Abra um NOVO terminal/PowerShell**

2. **Navegue para o diretório:**
   ```bash
   cd C:\Users\lucas\estetica-sales-system\crm-tigre\frontend
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm start
   ```

4. **Aguarde a compilação** (pode demorar 1-3 minutos na primeira vez)

5. **O navegador abrirá automaticamente** em:
   - http://localhost:3002 (configurado)
   - ou http://localhost:3000 (padrão)

---

## ✅ **O QUE JÁ ESTÁ PRONTO:**

### Backend API
- ✅ Rodando em http://localhost:8000
- ✅ Autenticação funcionando
- ✅ Todos os endpoints ativos

### Frontend
- ✅ Dependências instaladas (2417 pacotes)
- ✅ Configuração .env criada
- ✅ Backend URL configurada
- ⚠️ Aguardando compilação inicial

---

## 🔧 **ARQUIVOS CONFIGURADOS:**

### `.env` (Backend URL)
```
REACT_APP_BACKEND_URL=http://localhost:8000
PORT=3002
```

### `package.json`
- React 16.13.1
- Material-UI 4.12.3
- 40+ bibliotecas instaladas

---

## 🎯 **APÓS INICIAR:**

1. **Login no Frontend:**
   - Email: `admin@clinica.com`
   - Senha: `admin123`

2. **Funcionalidades Disponíveis:**
   - Dashboard com KPIs
   - Gestão de Leads
   - Agendamentos
   - Pagamentos
   - Relatórios

---

## 🐛 **SE DER ERRO:**

### Erro: "Port 3002 already in use"
```bash
# Use outra porta
set PORT=3003 && npm start
```

### Erro de compilação
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
npm start
```

### Erro de memória
```bash
# Aumentar memória do Node
set NODE_OPTIONS=--max_old_space_size=4096
npm start
```

---

## 📱 **ALTERNATIVA: USAR API DIRETAMENTE**

Se o frontend não compilar, use a API Swagger:

**http://localhost:8000/docs**

- Interface completa para testar todos os endpoints
- Não precisa de frontend
- Login: admin@clinica.com / admin123

---

## 🆘 **PROBLEMAS COMUNS:**

### 1. Webpack demora muito
**Normal na primeira compilação**. Pode levar 2-5 minutos.

### 2. Navegador não abre
Acesse manualmente: http://localhost:3002

### 3. Tela branca no navegador
- Abra o Console (F12)
- Verifique erros de JavaScript
- Verifique se backend está rodando

### 4. Erro de conexão com backend
Verifique se backend está ativo:
```bash
curl http://localhost:8000/health
```

---

## ✅ **CHECKLIST PRÉ-INICIALIZAÇÃO:**

- [x] Node.js instalado (v24.11.0)
- [x] npm instalado (11.6.1)
- [x] Dependências instaladas (2417 pacotes)
- [x] .env configurado
- [x] Backend rodando (porta 8000)
- [ ] Frontend compilado e rodando

---

## 🎊 **QUANDO ESTIVER RODANDO:**

Você verá no terminal:
```
Compiled successfully!

You can now view frontend in the browser.

  Local:            http://localhost:3002
  On Your Network:  http://192.168.x.x:3002
```

**Acesse e faça login! 🎉**

---

**Documentação Backend:** http://localhost:8000/docs
**Status do Sistema:** SISTEMA_RODANDO.md
