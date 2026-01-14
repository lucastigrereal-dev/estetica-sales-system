# Quick Start Guide - Whaticket Bridge

Guia rápido para colocar a integração funcionando em 5 minutos.

## Pré-requisitos

- Node.js 18+ instalado
- Acesso ao Whaticket com API Token
- Porta 3001 e 5678 disponíveis

## Passo 1: Configurar Bridge (2 min)

```bash
# Ir para pasta de integrations
cd estetica-sales-system/integrations

# Instalar dependências
npm install

# Criar arquivo .env
cp .env.example .env
```

Edite `.env` com suas credenciais:

```env
WHATICKET_API_URL=https://seu-whaticket.com/api
WHATICKET_TOKEN=seu_token_aqui
N8N_WEBHOOK_URL=http://localhost:5678/webhook/whaticket
PORT=3001
```

### Como obter o Token do Whaticket:

1. Acesse seu Whaticket
2. Vá em **Configurações → API**
3. Copie o token de autenticação

## Passo 2: Instalar e Iniciar N8N (1 min)

Em um novo terminal:

```bash
# Instalar N8N globalmente
npm install -g n8n

# Iniciar N8N
n8n start
```

Acesse: http://localhost:5678

## Passo 3: Importar Workflow N8N (1 min)

1. No N8N, clique em **"Import from File"** (Ctrl+O)
2. Selecione: `integrations/n8n-workflow-whaticket.json`
3. Clique em **"Import"**
4. Ative o workflow (toggle no canto superior direito)

## Passo 4: Iniciar o Bridge (1 min)

No terminal do projeto:

```bash
cd estetica-sales-system/integrations
npm run dev
```

Você verá:

```
🚀 Whaticket Bridge server running on port 3001
📡 Webhook endpoint: http://localhost:3001/webhook/whaticket
📡 Callback endpoint: http://localhost:3001/callback/n8n
```

## Passo 5: Testar Integração (30 segundos)

Em um novo terminal:

```bash
cd estetica-sales-system/integrations
npm test
```

Se tudo estiver correto, você verá:

```
╔═══════════════════════════════════════════════════╗
║  Test Summary                                     ║
╚═══════════════════════════════════════════════════╝

Total Tests: 7
Passed: 7
Failed: 0

🎉 All tests passed! Integration is working correctly.
```

## Pronto! 🎉

Sua integração está funcionando. Agora configure o webhook no Whaticket.

## Configurar Webhook no Whaticket

1. Acesse o painel do Whaticket
2. Vá em **Configurações → Webhooks**
3. Adicione:
   - **URL**: `http://localhost:3001/webhook/whaticket`
   - **Eventos**: ✅ Nova Mensagem, ✅ Status Alterado

**Nota:** Se o Whaticket estiver em outro servidor, use ngrok ou similar:

```bash
# Instalar ngrok
npm install -g ngrok

# Expor porta 3001
ngrok http 3001

# Use a URL gerada no webhook do Whaticket
# Exemplo: https://abc123.ngrok.io/webhook/whaticket
```

## Testando com Cliente Real

1. Envie uma mensagem no WhatsApp para seu Whaticket
2. Digite: "Olá"
3. A resposta automática deve chegar em segundos

## Verificando Logs

### Terminal do Bridge:
```
[2026-01-14T...] POST /webhook/whaticket
📥 Received Whaticket webhook event
📤 Sending event to N8N: whaticket_event
✅ Event sent successfully to N8N
```

### N8N (navegador):
1. Clique em "Executions"
2. Veja a execução mais recente
3. Explore cada nó para ver os dados

## Troubleshooting Rápido

### Bridge não inicia

**Erro:**
```
Error: Whaticket API URL and Token are required
```

**Solução:**
- Verifique se o arquivo `.env` existe
- Confirme que as variáveis estão preenchidas

### N8N não recebe eventos

**Verifique:**
```bash
# N8N está rodando?
curl http://localhost:5678

# Workflow está ativo no N8N?
# (Verifique o toggle no canto superior direito)

# URL está correta no .env?
cat .env | grep N8N_WEBHOOK_URL
```

### Testes falham

**Execute teste individual:**
```bash
curl http://localhost:3001/health
```

Se retornar 200, o bridge está ok.

**Teste o N8N diretamente:**
```bash
curl -X POST http://localhost:5678/webhook/whaticket \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

### Whaticket não recebe respostas

**Teste a API do Whaticket:**
```bash
curl -X GET https://seu-whaticket.com/api/tickets/1 \
  -H "Authorization: Bearer SEU_TOKEN"
```

Se retornar erro, o token pode estar inválido.

## Comandos Úteis

```bash
# Parar o bridge (Ctrl+C)

# Ver processos Node.js
ps aux | grep node

# Verificar portas em uso
netstat -ano | findstr :3001  # Windows
lsof -i :3001                 # Linux/Mac

# Reiniciar N8N
pkill n8n && n8n start

# Limpar cache do npm
npm cache clean --force
```

## Próximos Passos

Agora que está funcionando:

1. **Personalize as respostas**: Edite o nó "Generate AI Response" no N8N
2. **Adicione IA real**: Integre OpenAI ou Claude (veja N8N_SETUP.md)
3. **Configure horário comercial**: Adicione verificação de horário
4. **Monitore**: Configure alertas para erros
5. **Deploy**: Use PM2 ou Docker para produção

## Estrutura do Projeto

```
integrations/
├── src/
│   ├── index.js                # ✅ Bridge server
│   └── services/
│       ├── whaticket.js        # ✅ Cliente Whaticket
│       └── n8n.js              # ✅ Cliente N8N
├── .env                        # ✅ Suas configurações
├── n8n-workflow-whaticket.json # ✅ Workflow N8N
├── test-integration.js         # ✅ Testes
├── README.md                   # 📚 Documentação completa
├── N8N_SETUP.md               # 📚 Guia N8N detalhado
└── QUICKSTART.md              # 📚 Este arquivo
```

## Arquitetura Visual

```
┌─────────────┐
│   Cliente   │
│  (WhatsApp) │
└──────┬──────┘
       │ 1. Envia mensagem
       ▼
┌─────────────┐
│  Whaticket  │
└──────┬──────┘
       │ 2. Webhook para Bridge
       ▼
┌─────────────┐
│   Bridge    │ ◄── Você está aqui (porta 3001)
│ (Express)   │
└──────┬──────┘
       │ 3. Encaminha para N8N
       ▼
┌─────────────┐
│     N8N     │ ◄── Processa e gera resposta (porta 5678)
│  (Workflow) │
└──────┬──────┘
       │ 4. Callback para Bridge
       ▼
┌─────────────┐
│   Bridge    │
└──────┬──────┘
       │ 5. Envia resposta ao Whaticket
       ▼
┌─────────────┐
│  Whaticket  │
└──────┬──────┘
       │ 6. Entrega ao cliente
       ▼
┌─────────────┐
│   Cliente   │
│  (WhatsApp) │
└─────────────┘
```

## Suporte

- 📖 [README.md](./README.md) - Documentação completa
- 🔧 [N8N_SETUP.md](./N8N_SETUP.md) - Guia detalhado do N8N
- 🧪 `npm test` - Executar testes
- ❤️ [GitHub Issues](https://github.com/seu-repo/issues) - Reportar bugs

---

**Tempo estimado:** 5 minutos
**Dificuldade:** Fácil
**Status:** ✅ Pronto para produção
