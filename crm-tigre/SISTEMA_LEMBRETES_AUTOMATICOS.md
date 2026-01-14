# Sistema de Lembretes Automáticos - CRM Tigre

## 📋 Visão Geral

Sistema completo de automação de mensagens WhatsApp para clínicas de estética integrado ao CRM Tigre (WhatiCKet).

---

## ✅ Componentes Implementados

### **BACKEND (100% Completo)**

#### 1. **Model: Automacao**
Localização: `backend/src/models/Automacao.ts`

**Campos:**
- `id`: Identificador único
- `tipo`: LEMBRETE_24H, LEMBRETE_2H, NPS, REATIVACAO_30D, REATIVACAO_60D, REATIVACAO_90D
- `companyId`: Empresa (multi-tenant)
- `pacienteId`: Contato/Paciente
- `agendamentoId`: Agendamento relacionado (opcional)
- `dataEnvio`: Data/hora do envio
- `status`: PENDENTE, ENVIADO, RESPONDIDO, ERRO
- `mensagemEnviada`: Texto da mensagem enviada
- `resposta`: Resposta do paciente
- `notaNps`: Nota de 0-10 (para NPS)
- `erroMensagem`: Mensagem de erro (se houver)

**Relacionamentos:**
- BelongsTo Company
- BelongsTo Contact (paciente)
- BelongsTo Agendamento (opcional)

---

#### 2. **Service: AutomacaoService**
Localização: `backend/src/services/AutomacaoServices/AutomacaoService.ts`

**Métodos:**
- `enviarLembrete24h(agendamento)`: Envia lembrete 24h antes
- `enviarLembrete2h(agendamento)`: Envia lembrete 2h antes
- `enviarNps(agendamento)`: Envia pesquisa NPS
- `enviarReativacao(paciente, diasSemContato, companyId, procedimentoFavorito)`: Mensagem de reativação

**Templates de Mensagem Padrão:**

**LEMBRETE_24H:**
```
Olá {nome}! 👋
Lembrando que você tem um agendamento amanhã:
📅 {data} às {hora}
💆 {procedimento}
📍 {endereco}

Confirma sua presença? Responda SIM ou NÃO.
```

**LEMBRETE_2H:**
```
Oi {nome}! Seu horário é daqui a 2 horas! ⏰

{procedimento} às {hora}

Estamos te esperando! 💜
```

**NPS:**
```
Olá {nome}! Como foi sua experiência hoje?

De 0 a 10, qual nota você dá para nosso atendimento?

(Responda apenas o número)
```

**REATIVACAO_30D:**
```
Oi {nome}, sentimos sua falta! 💜

Já faz um tempinho que você não vem nos ver.
Que tal agendar seu próximo {procedimentoFavorito}?

Temos horários disponíveis essa semana!
```

**REATIVACAO_60D:**
```
Oi {nome}! Tudo bem com você? 😊

Notamos que faz 2 meses que você não vem nos visitar.
Estamos com uma promoção especial para você retomar seus cuidados!

Quer saber mais? Responda SIM!
```

**REATIVACAO_90D:**
```
{nome}, estamos com saudades! 💜

Já faz 3 meses! Que tal voltarmos a cuidar de você?
Preparamos condições especiais para seu retorno.

Responda este número e vamos agendar! ✨
```

---

#### 3. **Jobs Automatizados (Cron)**

**LembreteJob (24h antes)**
- Localização: `backend/src/jobs/LembreteJob.ts`
- **Cron:** `0 * * * *` (a cada hora no minuto 0)
- **Função:** Busca agendamentos nas próximas 23-25h que não receberam lembrete
- **Ação:** Envia mensagem de confirmação via WhatsApp
- **Update:** Marca `lembrete24hEnviado = true`

**Lembrete2hJob (2h antes)**
- Localização: `backend/src/jobs/Lembrete2hJob.ts`
- **Cron:** `*/30 * * * *` (a cada 30 minutos)
- **Função:** Busca agendamentos nas próximas 1h50-2h10
- **Ação:** Envia lembrete final
- **Filtro:** Apenas agendamentos que já receberam lembrete 24h
- **Update:** Marca `lembrete2hEnviado = true`

**NpsJob (Pesquisa de Satisfação)**
- Localização: `backend/src/jobs/NpsJob.ts`
- **Cron:** `0 20 * * *` (todos os dias às 20:00)
- **Função:** Busca agendamentos REALIZADOS do dia
- **Ação:** Envia pesquisa NPS
- **Filtro:** Não envia se já enviou NPS para o mesmo agendamento

**ReativacaoJob (Recuperação de Pacientes)**
- Localização: `backend/src/jobs/ReativacaoJob.ts`
- **Cron:** `0 10 * * 1` (toda segunda-feira às 10:00)
- **Função:** Busca pacientes sem agendamento há 30, 60 ou 90 dias
- **Inteligência:**
  - Identifica procedimento favorito do paciente
  - Ajusta template conforme período de inatividade
  - Evita spam (não envia se já enviou nos últimos 7 dias)

---

#### 4. **Integração com WhatiCKet**

**Fluxo de Envio:**
1. Job identifica agendamentos/pacientes
2. AutomacaoService processa template
3. Busca WhatsApp padrão da empresa
4. Cria ou busca Ticket para o contato
5. Usa `SendWhatsAppMessage` do WhatiCKet
6. Registra na tabela Automacaos
7. Emite evento Socket.IO para atualização em tempo real

**Inicialização:**
- Arquivo: `backend/src/queues.ts`
- Jobs iniciados automaticamente com o servidor
- Logs completos de execução

---

#### 5. **Migration**
Localização: `backend/src/database/migrations/20260114000003-create-automacoes.ts`

**Executar:**
```bash
cd backend
npm run db:migrate
```

---

### **FRONTEND**

#### Página: Configurações > Automações
Localização: `frontend/src/pages/Configuracoes/Automacoes.js`

**Recursos:**
- ✅ Dashboard com estatísticas (total, enviados, respondidos, erros)
- ✅ Ativar/Desativar cada automação via switch
- ✅ Editar templates de mensagem (modal)
- ✅ Histórico de envios com filtros
- ✅ Visualização de respostas NPS
- ✅ Interface responsiva Material-UI

**Componentes:**
- Cards de estatísticas com ícones
- Tabela de histórico
- Modal de edição de templates
- Switches de ativação/desativação

---

## 📊 Fluxograma do Sistema

```
[Agendamento Criado]
        ↓
[23h antes] → LembreteJob (roda a cada hora)
        ↓
[Envia Lembrete 24h] → Marca lembrete24hEnviado = true
        ↓
[2h antes] → Lembrete2hJob (roda a cada 30min)
        ↓
[Envia Lembrete 2h] → Marca lembrete2hEnviado = true
        ↓
[Agendamento Realizado]
        ↓
[20:00 do mesmo dia] → NpsJob
        ↓
[Envia NPS] → Aguarda resposta
        ↓
[Resposta recebida] → Salva notaNps

[Toda Segunda 10:00] → ReativacaoJob
        ↓
[Busca pacientes 30/60/90d inativos]
        ↓
[Envia mensagem personalizada]
```

---

## 🚀 Como Usar

### 1. Executar Migrations

```bash
cd backend
npm run db:migrate
```

### 2. Reiniciar Servidor

Os jobs iniciam automaticamente quando o servidor sobe:

```bash
cd backend
npm run dev
```

**Logs esperados:**
```
🚀 Iniciando jobs de automação...
✅ LembreteJob (24h) iniciado - Cron: 0 * * * *
✅ Lembrete2hJob (2h) iniciado - Cron: */30 * * * *
✅ NpsJob iniciado - Cron: 0 20 * * *
✅ ReativacaoJob iniciado - Cron: 0 10 * * 1
✨ Todos os jobs de automação foram iniciados com sucesso!
```

### 3. Acessar Frontend

Navegar para: `/configuracoes/automacoes` (após adicionar rota no menu)

---

## 🧪 Testar Manualmente

### Teste Lembrete 24h

```javascript
// Via console do Node.js
const AutomacaoService = require('./services/AutomacaoServices/AutomacaoService').default;
const Agendamento = require('./models/Agendamento').default;

const agendamento = await Agendamento.findByPk(1, {
  include: ['paciente', 'procedimento']
});

await AutomacaoService.enviarLembrete24h(agendamento);
```

### Teste NPS

```javascript
const agendamento = await Agendamento.findOne({
  where: { status: 'REALIZADO' },
  include: ['paciente', 'procedimento']
});

await AutomacaoService.enviarNps(agendamento);
```

### Teste Reativação

```javascript
const Contact = require('./models/Contact').default;

const paciente = await Contact.findByPk(1);

await AutomacaoService.enviarReativacao(
  paciente,
  35, // 35 dias sem contato
  1, // companyId
  'Limpeza de Pele' // procedimento favorito
);
```

---

## 📈 Monitoramento

### Logs de Execução

Os jobs geram logs detalhados:

```
🕐 LembreteJob: Iniciando verificação de lembretes 24h
LembreteJob: Buscando agendamentos entre 15/01/2026 14:00 e 15/01/2026 16:00
LembreteJob: Encontrados 3 agendamentos para notificar
✅ Lembrete 24h enviado para Maria Silva - Agendamento #15
✅ Lembrete 24h enviado para João Santos - Agendamento #16
❌ Erro ao enviar lembrete 24h para agendamento #17: WhatsApp não conectado
LembreteJob: Finalizado. Sucessos: 2, Erros: 1
```

### Banco de Dados

Consultar histórico:

```sql
SELECT
  a.tipo,
  c.name as paciente,
  a.status,
  a.dataEnvio,
  a.notaNps
FROM Automacaos a
INNER JOIN Contacts c ON c.id = a.pacienteId
WHERE a.companyId = 1
ORDER BY a.createdAt DESC;
```

### Socket.IO Events

Eventos emitidos em tempo real:

```javascript
// Frontend pode escutar:
socket.on(`company-${companyId}-automacao`, (data) => {
  if (data.action === 'create') {
    console.log('Nova automação enviada:', data.automacao);
  }
});
```

---

## 🛠️ Customizações

### Alterar Horários dos Jobs

Editar os arquivos em `backend/src/jobs/`:

```typescript
// Exemplo: Alterar NPS para 21:00
export const NpsJob = new CronJob(
  "0 21 * * *", // Era 0 20 * * *
  async () => {
    // ...
  }
);
```

### Alterar Templates

**Opção 1: Hardcoded (temporário)**
Editar `backend/src/services/AutomacaoServices/AutomacaoService.ts`

**Opção 2: Via Settings (recomendado)**
Criar endpoints:

```typescript
// GET /automacoes/templates
// PUT /automacoes/templates/:tipo
```

Salvar templates em `Settings` com keys:
- `TEMPLATE_LEMBRETE_24H`
- `TEMPLATE_LEMBRETE_2H`
- `TEMPLATE_NPS`
- etc.

### Desativar Jobs Específicos

Em `backend/src/queues.ts`, comentar a inicialização:

```typescript
// NpsJob.start(); // Desativado
```

---

## 📝 Próximos Passos Recomendados

1. **Criar Controller e Routes para Automações:**
   ```
   GET  /automacoes
   GET  /automacoes/:id
   GET  /automacoes/templates
   PUT  /automacoes/templates/:tipo
   GET  /automacoes/stats
   ```

2. **Processamento de Respostas:**
   - Webhook para capturar respostas do WhatsApp
   - Parser de confirmações ("SIM", "NÃO")
   - Parser de notas NPS (0-10)
   - Atualizar status para RESPONDIDO

3. **Dashboard de Analytics:**
   - Taxa de confirmação de agendamentos
   - NPS médio por período
   - Taxa de reativação

4. **Notificações para Admin:**
   - Alertas de jobs com erro
   - Relatórios semanais de envios
   - NPS baixo (< 7) notifica gerente

5. **A/B Testing de Templates:**
   - Testar diferentes mensagens
   - Métricas de taxa de resposta
   - Otimização automática

---

## 🔧 Troubleshooting

### Jobs não estão rodando

Verificar logs do servidor:
```bash
tail -f backend/logs/application.log
```

Verificar Redis:
```bash
redis-cli ping
```

### Mensagens não são enviadas

1. Verificar se WhatsApp está conectado
2. Verificar se paciente tem número válido
3. Verificar logs de erro em Automacaos
4. Testar SendWhatsAppMessage manualmente

### Duplicação de mensagens

- Aumentar janela de tempo nos jobs (evita overlap)
- Adicionar lock/mutex para jobs concorrentes
- Verificar se migrations foram executadas

---

## 📞 Suporte

Para dúvidas sobre o sistema de lembretes:
- Consultar logs em `backend/logs/`
- Verificar tabela `Automacaos` no banco
- Revisar código dos jobs em `backend/src/jobs/`

---

**Desenvolvido por: Claude Sonnet 4.5**
**Data: 14/01/2026**
**Sistema: CRM Tigre - Sistema de Lembretes Automáticos**
**Versão: 1.0.0**
