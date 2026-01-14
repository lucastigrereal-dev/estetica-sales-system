# Whaticket Bridge - Integração N8N

Sistema de integração entre Whaticket e N8N para automação de atendimento via WhatsApp.

## Arquitetura

```
┌─────────────┐        ┌──────────────┐        ┌────────────┐        ┌─────────────┐
│  Whaticket  │───────▶│    Bridge    │───────▶│    N8N     │───────▶│   OpenAI    │
│   (WhatsApp)│        │  (Port 3001) │        │ (Port 5678)│        │  (Optional) │
└─────────────┘        └──────────────┘        └────────────┘        └─────────────┘
       ▲                       │                       │
       │                       │                       │
       └───────────────────────┴───────────────────────┘
              Respostas automáticas via callback
```

## Componentes

### 1. Bridge Service (Express)
- Servidor Node.js/Express na porta 3001
- Recebe webhooks do Whaticket
- Envia eventos para N8N
- Recebe callbacks do N8N
- Envia respostas de volta ao Whaticket

### 2. N8N Workflow
- Processa eventos recebidos
- Gera respostas automáticas
- Pode integrar com IA (OpenAI, Claude, etc.)
- Gerencia lógica de negócio

### 3. Whaticket API Client
- Classe wrapper para API do Whaticket
- Métodos: sendMessage, updateTicket, getTicket

### 4. N8N Client
- Cliente HTTP para enviar eventos ao N8N
- Método sendEvent para disparar workflows

## Início Rápido

### 1. Instalar Dependências

```bash
cd integrations
npm install
```

### 2. Configurar Variáveis de Ambiente

```bash
cp .env.example .env
```

Edite `.env`:
```env
WHATICKET_API_URL=https://seu-whaticket.com/api
WHATICKET_TOKEN=seu_token_aqui
N8N_WEBHOOK_URL=http://localhost:5678/webhook/whaticket
PORT=3001
```

### 3. Instalar e Iniciar N8N

```bash
# Instalar N8N globalmente
npm install -g n8n

# Iniciar N8N
n8n start
```

### 4. Importar Workflow no N8N

1. Acesse http://localhost:5678
2. Importe o arquivo `n8n-workflow-whaticket.json`
3. Ative o workflow
4. Copie a URL do webhook

### 5. Iniciar o Bridge

```bash
npm run dev
```

O servidor estará disponível em:
- Webhook Whaticket: http://localhost:3001/webhook/whaticket
- Callback N8N: http://localhost:3001/callback/n8n
- Health Check: http://localhost:3001/health

## Configuração no Whaticket

### Adicionar Webhook

1. Acesse o painel admin do Whaticket
2. Vá em **Configurações → Webhooks**
3. Adicione novo webhook:
   - **URL**: `http://localhost:3001/webhook/whaticket`
   - **Eventos**:
     - ✅ Nova Mensagem
     - ✅ Status do Ticket Alterado

## Testando a Integração

### Teste 1: Health Check

```bash
curl http://localhost:3001/health
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "service": "whaticket-bridge",
  "timestamp": "2026-01-14T..."
}
```

### Teste 2: Simular Evento do Whaticket

```bash
curl -X POST http://localhost:3001/webhook/whaticket \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "whaticket_event",
    "data": {
      "type": "message",
      "body": "Olá, gostaria de informações",
      "fromMe": false,
      "ticket": {
        "id": 123,
        "status": "open"
      },
      "contact": {
        "name": "Maria Santos"
      }
    }
  }'
```

### Teste 3: Verificar Logs

```bash
# Terminal do Bridge
# Deve mostrar:
# 📥 Received Whaticket webhook event
# ✅ Event forwarded to N8N

# Terminal do N8N
# Verifique a aba "Executions" no navegador
```

## Estrutura de Arquivos

```
integrations/
├── src/
│   ├── index.js                    # Servidor Express principal
│   └── services/
│       ├── whaticket.js            # Cliente API Whaticket
│       └── n8n.js                  # Cliente N8N
├── package.json                    # Dependências Node.js
├── .env                            # Configurações (não commitado)
├── .env.example                    # Template de configurações
├── n8n-workflow-whaticket.json     # Workflow N8N para importar
├── N8N_SETUP.md                    # Guia detalhado do N8N
└── README.md                       # Este arquivo
```

## Fluxo de Dados

### 1. Cliente envia mensagem no WhatsApp
```
Cliente → WhatsApp → Whaticket
```

### 2. Whaticket dispara webhook
```
Whaticket → POST /webhook/whaticket (Bridge)
Payload:
{
  "eventType": "whaticket_event",
  "data": { ... }
}
```

### 3. Bridge encaminha para N8N
```
Bridge → POST /webhook/whaticket (N8N)
```

### 4. N8N processa e gera resposta
```
N8N Workflow:
1. Recebe evento
2. Verifica tipo de mensagem
3. Gera resposta (IA ou keywords)
4. Envia callback
```

### 5. N8N envia callback ao Bridge
```
N8N → POST /callback/n8n (Bridge)
Payload:
{
  "ticketId": 123,
  "message": "Resposta gerada",
  "action": "send_message"
}
```

### 6. Bridge envia resposta ao Whaticket
```
Bridge → POST /api/messages/:ticketId (Whaticket)
```

### 7. Whaticket envia ao cliente
```
Whaticket → WhatsApp → Cliente
```

## API Endpoints

### POST /webhook/whaticket
Recebe eventos do Whaticket.

**Request Body:**
```json
{
  "eventType": "whaticket_event",
  "data": {
    "type": "message",
    "body": "mensagem",
    "fromMe": false,
    "ticket": { "id": 123, "status": "open" },
    "contact": { "name": "Cliente" }
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Event received and forwarded to N8N"
}
```

### POST /callback/n8n
Recebe callbacks do N8N.

**Request Body (Enviar Mensagem):**
```json
{
  "ticketId": 123,
  "message": "Texto da resposta",
  "action": "send_message"
}
```

**Request Body (Atualizar Ticket):**
```json
{
  "ticketId": 123,
  "action": "update_ticket",
  "data": {
    "status": "closed"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Callback processed successfully"
}
```

### GET /health
Health check do serviço.

**Response:**
```json
{
  "status": "ok",
  "service": "whaticket-bridge",
  "timestamp": "2026-01-14T..."
}
```

## Respostas Automáticas

O workflow N8N inclui respostas baseadas em palavras-chave:

| Palavra-Chave | Resposta |
|---------------|----------|
| olá, oi, bom dia | Saudação personalizada |
| preço, valor, quanto | Informações sobre preços |
| agendar, marcar, horário | Oferta de agendamento |
| endereço, localização | Informações de localização |
| obrigado, obrigada | Agradecimento |
| (outras) | Mensagem de espera |

## Personalizações

### Adicionar Nova Palavra-Chave

Edite o nó "Generate AI Response" no workflow N8N:

```javascript
if (message.includes('sua_palavra')) {
  response = 'Sua resposta aqui';
}
```

### Integrar com OpenAI

1. Obtenha API Key: https://platform.openai.com
2. No N8N, adicione nó HTTP Request antes de "Generate AI Response"
3. Configure chamada à API:

```javascript
{
  "url": "https://api.openai.com/v1/chat/completions",
  "method": "POST",
  "headers": {
    "Authorization": "Bearer YOUR_API_KEY"
  },
  "body": {
    "model": "gpt-4",
    "messages": [
      {"role": "system", "content": "Você é atendente de estética"},
      {"role": "user", "content": "={{$json.message}}"}
    ]
  }
}
```

### Adicionar Horário Comercial

Adicione nó "IF" no N8N verificando horário:

```javascript
const now = new Date();
const hour = now.getHours();
const day = now.getDay();

// Segunda a Sexta, 9h às 18h
const isBusinessHour = day >= 1 && day <= 5 && hour >= 9 && hour < 18;

return { json: { isBusinessHour } };
```

## Monitoramento

### Logs do Bridge

```bash
cd integrations
npm run dev

# Logs em tempo real:
# 📥 Received Whaticket webhook event
# 📤 Sending event to N8N
# ✅ Message sent to ticket 123
```

### Execuções do N8N

1. Acesse http://localhost:5678
2. Clique em "Executions" (lado esquerdo)
3. Visualize cada execução com dados de entrada/saída

### Verificar Status

```bash
# Health check
curl http://localhost:3001/health

# Processos Node.js
ps aux | grep node

# Porta 3001 em uso
lsof -i :3001  # Linux/Mac
netstat -ano | findstr :3001  # Windows
```

## Troubleshooting

### Bridge não inicia

**Erro:** `Whaticket API URL and Token are required`

**Solução:** Configure o arquivo `.env` com as credenciais corretas.

### N8N não recebe eventos

**Verificações:**
1. N8N está rodando? `ps aux | grep n8n`
2. Workflow está ativo no N8N?
3. URL do webhook está correta no `.env`?

**Teste direto:**
```bash
curl -X POST http://localhost:5678/webhook/whaticket \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

### Whaticket não recebe respostas

**Verificações:**
1. Token do Whaticket está correto?
2. API do Whaticket está acessível?
3. Ticket ID é válido?

**Teste API Whaticket:**
```bash
curl -X GET https://seu-whaticket.com/api/tickets/123 \
  -H "Authorization: Bearer SEU_TOKEN"
```

## Segurança

### Produção

1. **Use HTTPS**: Configure SSL/TLS
2. **Adicione Autenticação**: Token nos webhooks
3. **Rate Limiting**: Limite requisições por IP
4. **Validação**: Valide payloads recebidos
5. **Logs**: Não logue tokens/senhas

### Exemplo com Autenticação

```javascript
// src/index.js
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

app.post('/webhook/whaticket', (req, res) => {
  const authHeader = req.headers['authorization'];

  if (authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // ... resto do código
});
```

## Deploy

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

### PM2 (Process Manager)

```bash
npm install -g pm2
pm2 start src/index.js --name whaticket-bridge
pm2 save
pm2 startup
```

### Variáveis de Ambiente (Produção)

```env
NODE_ENV=production
WHATICKET_API_URL=https://api.seudominio.com/api
WHATICKET_TOKEN=token_producao_seguro
N8N_WEBHOOK_URL=https://n8n.seudominio.com/webhook/whaticket
PORT=3001
WEBHOOK_SECRET=seu_secret_seguro_aqui
```

## Próximos Passos

1. ✅ Integração básica funcionando
2. ⬜ Adicionar autenticação nos webhooks
3. ⬜ Integrar com IA (OpenAI/Claude)
4. ⬜ Criar dashboard de métricas
5. ⬜ Implementar filas de atendimento
6. ⬜ Adicionar testes automatizados
7. ⬜ Deploy em produção (Docker/PM2)

## Suporte

- **N8N Docs**: https://docs.n8n.io
- **Whaticket**: https://github.com/canove/whaticket
- **Express.js**: https://expressjs.com

## Licença

MIT
