# N8N Workflow - Whaticket Integration

## Visão Geral

Este workflow N8N processa eventos do Whaticket e gera respostas automáticas usando lógica de IA.

## Fluxo de Dados

```
Whaticket → Bridge (3001) → N8N (5678) → Processa → Bridge → Whaticket
```

## Arquitetura do Workflow

### 1. **Webhook - Whaticket** (Trigger)
- Recebe eventos POST do bridge
- Endpoint: `/webhook/whaticket`
- Formato: JSON com `eventType` e `data`

### 2. **Check Event Type**
- Valida se é um evento do tipo `whaticket_event`
- Filtra eventos inválidos

### 3. **Is New Message?**
- Verifica se o evento é uma nova mensagem
- Separa mensagens de mudanças de status

### 4. **Is Ticket Open?**
- Confirma se o ticket está aberto
- Evita processar tickets fechados

### 5. **Process Message**
- Extrai dados da mensagem (ticketId, contactName, message)
- Ignora mensagens enviadas pelo agente (fromMe = true)
- Prepara dados para resposta

### 6. **Should Respond?**
- Verifica se deve gerar resposta automática
- Filtra mensagens que devem ser ignoradas

### 7. **Generate AI Response**
- Gera resposta baseada em palavras-chave
- Respostas personalizadas por contexto:
  - Saudações
  - Perguntas sobre preços
  - Agendamentos
  - Localização
  - Agradecimentos
  - Mensagem padrão

### 8. **Send to Bridge**
- Envia resposta para o bridge via HTTP POST
- Bridge encaminha para Whaticket

### 9. **Handle Status Change**
- Processa mudanças de status do ticket
- Atualiza informações quando ticket é fechado

### 10. **Merge Responses & Respond to Webhook**
- Combina todas as respostas
- Retorna confirmação para o bridge

## Como Importar no N8N

### Passo 1: Instalar N8N

```bash
npm install -g n8n
```

### Passo 2: Iniciar N8N

```bash
n8n start
```

Acesse: `http://localhost:5678`

### Passo 3: Importar Workflow

1. Abra N8N no navegador
2. Clique em **"Import from File"** (ou use Ctrl+O)
3. Selecione o arquivo `n8n-workflow-whaticket.json`
4. Clique em **"Import"**

### Passo 4: Ativar Webhook

1. Abra o workflow importado
2. Clique no nó **"Webhook - Whaticket"**
3. Clique em **"Listen for Test Event"** ou ative o workflow
4. Copie a URL do webhook (algo como: `http://localhost:5678/webhook/whaticket`)

### Passo 5: Configurar Bridge

Edite `integrations/.env`:

```env
N8N_WEBHOOK_URL=http://localhost:5678/webhook/whaticket
```

### Passo 6: Testar o Fluxo

Use curl para simular um evento:

```bash
curl -X POST http://localhost:3001/webhook/whaticket \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "whaticket_event",
    "data": {
      "type": "message",
      "body": "Olá, gostaria de agendar",
      "fromMe": false,
      "ticket": {
        "id": 123,
        "status": "open"
      },
      "contact": {
        "name": "João Silva"
      }
    }
  }'
```

## Personalizando Respostas

### Adicionar Nova Resposta por Palavra-Chave

Edite o nó **"Generate AI Response"**:

```javascript
if (message.includes('sua_palavra_chave')) {
  response = 'Sua resposta personalizada aqui 🎯';
}
```

### Integrar com IA Real (OpenAI/Claude)

1. Adicione um nó **HTTP Request** antes do "Generate AI Response"
2. Configure para chamar API da OpenAI ou Claude:

```javascript
// Exemplo OpenAI
{
  "url": "https://api.openai.com/v1/chat/completions",
  "method": "POST",
  "headers": {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
  },
  "body": {
    "model": "gpt-4",
    "messages": [
      {
        "role": "system",
        "content": "Você é um atendente de clínica de estética."
      },
      {
        "role": "user",
        "content": "={{$json.message}}"
      }
    ]
  }
}
```

### Adicionar Delay nas Respostas

1. Adicione um nó **"Wait"** entre "Generate AI Response" e "Send to Bridge"
2. Configure para aguardar 2-5 segundos (mais natural)

## Monitoramento

### Ver Execuções

1. No N8N, vá em **"Executions"**
2. Visualize logs de cada execução
3. Debug erros clicando na execução

### Logs do Bridge

```bash
# Ver logs em tempo real
cd estetica-sales-system/integrations
npm run dev
```

## Troubleshooting

### Webhook não recebe eventos
- Verifique se N8N está rodando na porta 5678
- Confirme que o workflow está ativado
- Teste com curl diretamente no webhook do N8N

### Bridge não envia para Whaticket
- Verifique `WHATICKET_API_URL` e `WHATICKET_TOKEN` no `.env`
- Teste a API do Whaticket com Postman/Insomnia
- Veja logs de erro no console do bridge

### Respostas não são enviadas
- Confirme que `fromMe` é `false` (mensagem do cliente)
- Verifique se ticket está com status `open`
- Debug o nó "Should Respond?" no N8N

## Próximos Passos

1. **Integrar IA Real**: Adicione OpenAI/Claude para respostas inteligentes
2. **Adicionar Banco de Dados**: Salve histórico de conversas
3. **Criar Dashboard**: Monitore métricas de atendimento
4. **Adicionar Filas**: Distribua tickets entre atendentes
5. **Implementar Horário Comercial**: Respostas automáticas fora do expediente

## Estrutura de Eventos Whaticket

### Evento de Nova Mensagem
```json
{
  "eventType": "whaticket_event",
  "data": {
    "type": "message",
    "id": 456,
    "body": "Mensagem do cliente",
    "fromMe": false,
    "mediaUrl": null,
    "ticket": {
      "id": 123,
      "status": "open",
      "userId": 1,
      "contactId": 789
    },
    "contact": {
      "id": 789,
      "name": "João Silva",
      "number": "5511999999999"
    }
  }
}
```

### Evento de Mudança de Status
```json
{
  "eventType": "whaticket_event",
  "data": {
    "type": "ticket_status_change",
    "ticket": {
      "id": 123,
      "status": "closed",
      "userId": 1
    }
  }
}
```

## Suporte

Para dúvidas sobre N8N: https://docs.n8n.io
Para dúvidas sobre Whaticket: https://github.com/canove/whaticket
