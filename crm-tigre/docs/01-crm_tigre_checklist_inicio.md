# 🐯 CRM TIGRE - CHECKLIST DE INÍCIO

## Implementação Estruturada (Semanas 1-4)

Você vai usar este documento TODA SEMANA durante os primeiros 4 meses.

---

## ✅ PASSO 1: PRÉ-DESENVOLVIMENTO

### Checklist Executivo (HOJE)

- [ ] **Financeiro:**
  - [ ] Orçamento aprovado (R$58.800 ou escolhido)
  - [ ] Contrato assinado com dev
  - [ ] Primeira parcela paga
  - [ ] Plano de pagamento definido

- [ ] **Infraestrutura:**
  - [ ] Conta GitHub criada (ou time)
  - [ ] Repositório criado: `crm-tigre-clinica`
  - [ ] Vercel conectado ao GitHub
  - [ ] Supabase account criado
  - [ ] Domínio registrado (opcional: suavincrica.com/crm)

- [ ] **Credenciais:**
  - [ ] OpenAI API key gerada (para Anna Chatbot)
  - [ ] WhatsApp Business API ativada
  - [ ] Stripe account criado
  - [ ] Google Calendar API ativada
  - [ ] SendGrid account criado (email)
  - [ ] Twilio account (SMS backup)

- [ ] **Comunicação:**
  - [ ] Grupo WhatsApp criado (você + dev + PM)
  - [ ] Daily standup agendado (10:00 AM)
  - [ ] Reunião semanal agendada (2ª feira 14:00)
  - [ ] Slack/Discord instalado

---

## 📊 SEMANA 1: SETUP & ESTRUTURA

### Segunda-feira (Kickoff)
**Reunião:** 2 horas com dev

- [ ] Apresentação arquitetura
- [ ] Definir padrões de código
- [ ] Testar ambiente local
- [ ] Primeiro commit no GitHub
- [ ] Você recebe credenciais de acesso

**Seu trabalho:**
- [ ] Preparar lista de pacientes (exportar Excel)
- [ ] Fotografias de procedimentos (se tiver)
- [ ] Textos para Anna (prompts iniciais)

### Terça a Quinta
**Dev faz:** Setup inicial (GitHub, Vercel, Supabase, banco dados)

**Você:**
- [ ] Revisita lista de features
- [ ] Prepara dados de teste (5-10 pacientes fictícios)
- [ ] Define nomes dos procedimentos
- [ ] Lista de campos que faltam

### Sexta-feira (Teste 1)
**Reunião:** 30 min

- [ ] Dev mostra: Login funcionando
- [ ] Dev mostra: Listar pacientes (banco vazio)
- [ ] Você testa: Entrar no sistema
- [ ] Você testa: Clicar em botões
- [ ] Você relata bugs encontrados

**Métrica esperada:**
- ✅ Sistema rodando em localhost
- ✅ Você consegue fazer login
- ✅ Database conectado

---

## 📊 SEMANA 2: PRIMEIRA FEATURE (PACIENTES)

### Segunda-feira
**Dev faz:** CRUD de pacientes (criar, ler, atualizar, deletar)

- [ ] Tela de pacientes (listagem)
- [ ] Novo paciente (form)
- [ ] Editar paciente
- [ ] Detalhes do paciente
- [ ] Filtros básicos

**Você:**
- [ ] Continua preparando dados
- [ ] Testa versão anterior em staging
- [ ] Relatório de bugs

### Quarta-feira (Teste 2)
**Reunião:** 1 hora

- [ ] Dev mostra: Tela de pacientes pronta
- [ ] Você testa: Adicionar novo paciente
- [ ] Você testa: Editar informações
- [ ] Você testa: Filtrar por status
- [ ] Você reporta issues

**Checklist seu teste:**
- [ ] Consegui adicionar 3 pacientes
- [ ] Dados foram salvos (refresh: ainda estão lá?)
- [ ] Edit funcionou
- [ ] Validação de email funcionou
- [ ] Design ficou ok no celular?

### Sexta-feira
**Deploy em staging:** Dev sobe para URL pública

**Você:**
- [ ] Testa no seu celular (iPhone/Android)
- [ ] Testa em WiFi e dados móveis
- [ ] Testa em Safari e Chrome
- [ ] Relatório final da semana

**Métrica esperada:**
- ✅ 100+ pacientes cadastrados
- ✅ Dados persistem após refresh
- ✅ Funciona no celular

---

## 📊 SEMANA 3: AGENDAMENTOS

### Segunda-feira
**Dev faz:** CRUD de agendamentos

- [ ] Calendário visual (dia/semana/mês)
- [ ] Novo agendamento (wizard)
- [ ] Sincronização Google Calendar
- [ ] Status visual (confirmado, pendente, realizado)

**Você:**
- [ ] Prepara nomes de procedimentos
- [ ] Define horários de funcionamento (ex: 9h-18h)
- [ ] Define duração por procedimento
- [ ] Testa feature anterior

### Quarta-feira (Teste 3)
**Reunião:** 1 hora

- [ ] Dev mostra: Calendário funcionando
- [ ] Você agenda primeiro paciente
- [ ] Você testa: Novo agendamento
- [ ] Você testa: Visualizações (dia/semana/mês)

**Checklist seu teste:**
- [ ] Consegui agendar paciente
- [ ] Google Calendar sincronizou?
- [ ] Horários conflitantes foram bloqueados?
- [ ] Visualização mês ficou legível?

### Sexta-feira
**Deploy:** Agendamentos em staging

**Você:**
- [ ] Testa agendamento no celular
- [ ] Testa com vários pacientes
- [ ] Checklist de issues

**Métrica esperada:**
- ✅ 20+ agendamentos criados
- ✅ Calendário sincronizado
- ✅ No conflicts de horário

---

## 📊 SEMANA 4: LEMBRETES & MVP COMPLETO

### Segunda-feira
**Dev faz:** Lembretes automáticos

- [ ] Lembrete 24h antes (WhatsApp)
- [ ] Lembrete 2h antes (WhatsApp)
- [ ] Marcação como confirmado/cancelado
- [ ] Dashboard básico (KPIs)

**Você:**
- [ ] Valida textos dos lembretes
- [ ] Testa SMS (backup)
- [ ] Testa agendamento anterior

### Quarta-feira (Teste 4)
**Reunião:** 1 hora

- [ ] Dev mostra: Lembrete automático funcionando
- [ ] Dev mostra: Dashboard com números
- [ ] Você testa: Receber lembrete WhatsApp

**Checklist seu teste:**
- [ ] Recebi lembrete 24h
- [ ] Recebi lembrete 2h
- [ ] Consegui confirmar pelo botão
- [ ] Dashboard mostrou dados corretos

### Sexta-feira (Review MVP)
**Reunião:** 2 horas

**MVP Completo deve ter:**
- ✅ Pacientes (CRUD)
- ✅ Agendamentos (calendário)
- ✅ Lembretes automáticos (WhatsApp)
- ✅ Dashboard básico
- ✅ Login/Autenticação

**Você testa tudo junto:**
1. Entra no sistema
2. Adiciona paciente
3. Agenda novo agendamento
4. Recebe lembrete automaticamente
5. Confirma presença
6. Vê dados no dashboard

**Métrica esperada:**
- ✅ 0 crashes
- ✅ 95%+ uptime
- ✅ <2s load time
- ✅ <100ms resposta API

---

## 🔧 COMO ESCALAR PROBLEMAS

### Bug Crítico (Sistema fora)
1. Notifique dev AGORA (WhatsApp)
2. Descreva: O que você fez? O que quebrou?
3. Dev prioritiza (drop tudo)
4. Alvo: Fix em <1h

### Bug Importante (Feature não funciona)
1. Crie screenshot
2. Descreva passo a passo
3. Envie para dev (email + WhatsApp)
4. Dev prioriza (próxima day)
5. Alvo: Fix em 24h

### Melhoria/Sugestão
1. Anote em documento compartilhado
2. Discuta na reunião semanal
3. Dev decide se prioritiza ou não
4. Vai para backlog

### Template de Bug Report

```
Título: [Componente] Descrição breve

Versão: [V1.0.2]
Data/Hora: [14 jan 14:30]
URL: [https://crm.suaclinca.com/agendamentos]

Passos para reproduzir:
1. Login com email@test.com
2. Clique em "Novo Agendamento"
3. Selecione paciente "Maria"
4. Clique "Agendar"

Resultado esperado:
Agendamento criado e aparece no calendário

Resultado atual:
Aparece erro "Network Error"

Logs/Screenshot: [anexar]
```

---

## 📈 MÉTRICAS A MONITORAR (SEMANAS 1-4)

### Performance
- [ ] Page load: <3s
- [ ] API response: <200ms
- [ ] Uptime: >99%
- [ ] Crashes: 0

### Utilização
- [ ] Pacientes criados
- [ ] Agendamentos criados
- [ ] Lembretes enviados
- [ ] Taxa sucesso lembrete

### Dados
- [ ] Confirmação presença: >85%
- [ ] No-show vs esperado
- [ ] Feedback usuário

---

## 🎯 PRÓXIMAS SEMANAS (5-16)

Semanas 5-8: IA + Automações
- Anna Chatbot
- Agendamento automático via WhatsApp
- Pesquisa NPS
- Upsell inteligente

Semanas 9-16: Inteligência Avançada
- Análise de sentimento
- Programa fidelidade
- Relatórios 360°
- ML predictivo

---

## ⚠️ SINAIS DE ALERTA

Se vir isso, reaja AGORA:

| Sinal | Ação |
|-------|------|
| Dev não responde >4h | Ligar/Escalar |
| Feature atrasada 1 semana | Reunião emergencial |
| Muitos bugs (<5% funciona) | Parar e refatorar |
| You frustrated (sua frustração) | Respirar + ligar amigo |

---

**Documento:** CRM TIGRE - Checklist Início  
**Versão:** 1.0  
**Atualizar:** Todo mês
