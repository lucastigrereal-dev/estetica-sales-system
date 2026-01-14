# Implementação de Procedimentos e Agendamentos - CRM Tigre

## 📋 Sumário

Esta documentação descreve a implementação completa dos módulos de **Procedimentos** e **Agendamentos** no CRM Tigre, um sistema de gestão clínica baseado em WhatiCKet.

---

## ✅ O que foi implementado

### **BACKEND (100% Completo)**

#### 1. **Modelos (Models)**
Localização: `backend/src/models/`

- ✅ **Procedimento.ts**
  - Campos: id, nome, descricao, categoria, duracaoMinutos, precoPadrao, precoPromocional, ativo, imagemUrl, companyId
  - Relacionamentos: BelongsTo Company, HasMany Agendamentos

- ✅ **Agendamento.ts**
  - Campos: id, companyId, pacienteId, procedimentoId, profissionalId, dataAgendamento, horaInicio, horaFim, duracaoMinutos, status, preco, desconto, precoFinal, pagamentoStatus, metodoPagamento, notas, googleEventId, lembretes, motivoCancelamento
  - Status: AGENDADO, CONFIRMADO, REALIZADO, CANCELADO, NO_SHOW
  - Pagamento Status: PENDENTE, PAGO, PARCIAL, CANCELADO
  - Relacionamentos: BelongsTo Company, Contact (paciente), Procedimento, User (profissional)

#### 2. **Services (Lógica de Negócio)**
Localização: `backend/src/services/`

**ProcedimentoServices:**
- ✅ ListProcedimentosService
- ✅ CreateProcedimentoService
- ✅ ShowProcedimentoService
- ✅ UpdateProcedimentoService
- ✅ DeleteProcedimentoService

**AgendamentoServices:**
- ✅ ListAgendamentosService (com filtros por status, data, profissional)
- ✅ CreateAgendamentoService (validação de conflitos de horário)
- ✅ ShowAgendamentoService
- ✅ UpdateAgendamentoService
- ✅ ConfirmarAgendamentoService
- ✅ CancelarAgendamentoService (com motivo)
- ✅ MarcarRealizadoService (com pagamento)
- ✅ MarcarNoShowService
- ✅ GetSlotsDisponiveisService (horários livres para agendamento)

#### 3. **Controllers**
Localização: `backend/src/controllers/`

- ✅ **ProcedimentoController.ts**
  - index, store, show, update, remove
  - Validação com Yup
  - Emissão de eventos Socket.IO

- ✅ **AgendamentoController.ts**
  - index, store, show, update
  - confirmar, cancelar, marcarRealizado, marcarNoShow
  - slotsDisponiveis (GET query endpoint)
  - Validação com Yup
  - Emissão de eventos Socket.IO

#### 4. **Routes (Rotas API)**
Localização: `backend/src/routes/`

- ✅ **procedimentoRoutes.ts**
  ```
  GET    /procedimentos
  GET    /procedimentos/:procedimentoId
  POST   /procedimentos
  PUT    /procedimentos/:procedimentoId
  DELETE /procedimentos/:procedimentoId
  ```

- ✅ **agendamentoRoutes.ts**
  ```
  GET    /agendamentos
  GET    /agendamentos/slots-disponiveis
  GET    /agendamentos/:agendamentoId
  POST   /agendamentos
  PUT    /agendamentos/:agendamentoId
  POST   /agendamentos/:agendamentoId/confirmar
  POST   /agendamentos/:agendamentoId/cancelar
  POST   /agendamentos/:agendamentoId/marcar-realizado
  POST   /agendamentos/:agendamentoId/marcar-no-show
  ```

- ✅ **index.ts** (atualizado com as novas rotas)

#### 5. **Migrations (Banco de Dados)**
Localização: `backend/src/database/migrations/`

- ✅ **20260114000001-create-procedimentos.ts**
- ✅ **20260114000002-create-agendamentos.ts**

---

### **FRONTEND (Estrutura Base Criada)**

#### Páginas Criadas
Localização: `frontend/src/pages/`

- ✅ **Procedimentos/index.js**
  - Lista de procedimentos com tabela
  - Botões de Adicionar, Editar, Deletar
  - Filtros por status e categoria
  - Display de preços e duração

- ✅ **Agendamentos/index.js**
  - Calendário visual com react-big-calendar
  - Vistas: dia, semana, mês
  - Cores por status
  - Modal de detalhes ao clicar
  - Botões de ações (confirmar, cancelar, realizar)

---

## 🚧 O que falta implementar

### **FRONTEND - Componentes Necessários**

Você precisará criar estes componentes:

#### 1. **ProcedimentoModal.js**
Localização: `frontend/src/components/`

```javascript
// Formulário modal para criar/editar procedimento
// Campos:
// - nome (required)
// - descricao
// - categoria (select)
// - duracaoMinutos (number)
// - precoPadrao (currency)
// - precoPromocional (currency)
// - ativo (checkbox)
// - imagemUrl (file upload)
```

#### 2. **NovoAgendamento (Wizard)**
Localização: `frontend/src/pages/Agendamentos/NovoAgendamento.js`

```javascript
// Wizard de 4 passos:
// Passo 1: Selecionar Paciente (autocomplete com busca)
// Passo 2: Selecionar Procedimento (lista com preços)
// Passo 3: Selecionar Data/Hora
//   - Calendário
//   - API GET /agendamentos/slots-disponiveis
//   - Mostrar apenas horários livres
// Passo 4: Confirmar e finalizar
//   - Resumo
//   - Notas adicionais
//   - Método de pagamento
```

#### 3. **AgendamentoModal.js**
Localização: `frontend/src/components/`

```javascript
// Modal para editar agendamento existente
// Permitir reagendar (data/hora)
// Adicionar notas
// Alterar status
```

#### 4. **Adicionar ao Menu de Navegação**
Localização: `frontend/src/layout/MainListItems.js`

```javascript
// Adicionar links:
// - Procedimentos
// - Agendamentos
// - Calendário
```

#### 5. **Adicionar Rotas**
Localização: `frontend/src/routes/index.js`

```javascript
// Adicionar rotas protegidas:
import Procedimentos from "../pages/Procedimentos";
import Agendamentos from "../pages/Agendamentos";
import NovoAgendamento from "../pages/Agendamentos/NovoAgendamento";

<Route exact path="/procedimentos" component={Procedimentos} />
<Route exact path="/agendamentos" component={Agendamentos} />
<Route exact path="/agendamentos/novo" component={NovoAgendamento} />
```

---

## 🔗 Integração com WhatiCKet

### Como integrar tickets com agendamentos

#### 1. **Adicionar campo no modelo Ticket**

```typescript
// backend/src/models/Ticket.ts
@Column
agendamentoId: number;

@BelongsTo(() => Agendamento)
agendamento: Agendamento;
```

#### 2. **Criar serviço de conversão**

```typescript
// backend/src/services/TicketServices/ConvertToAgendamentoService.ts

import Ticket from "../../models/Ticket";
import Agendamento from "../../models/Agendamento";
import Contact from "../../models/Contact";

interface Request {
  ticketId: number;
  procedimentoId: number;
  dataAgendamento: Date;
  horaInicio: string;
  companyId: number;
}

const ConvertToAgendamentoService = async ({
  ticketId,
  procedimentoId,
  dataAgendamento,
  horaInicio,
  companyId
}: Request): Promise<Agendamento> => {
  // 1. Buscar ticket
  const ticket = await Ticket.findByPk(ticketId, {
    include: [Contact]
  });

  // 2. Criar agendamento usando o contact do ticket
  const agendamento = await CreateAgendamentoService({
    companyId,
    pacienteId: ticket.contactId,
    procedimentoId,
    dataAgendamento,
    horaInicio
  });

  // 3. Vincular ticket ao agendamento
  await ticket.update({ agendamentoId: agendamento.id });

  return agendamento;
};
```

#### 3. **Adicionar botão "Agendar" no ticket**

```javascript
// frontend/src/components/TicketActionButtons/index.js

<Button onClick={handleOpenAgendarModal}>
  <EventIcon /> Agendar Consulta
</Button>

// Modal aparece para selecionar procedimento e horário
// Ao confirmar, chama API POST /tickets/:id/converter-agendamento
```

---

## 📦 Dependências Necessárias

### Backend
Já incluídas no package.json:
- ✅ sequelize
- ✅ sequelize-typescript
- ✅ yup
- ✅ express
- ✅ socket.io

### Frontend
Adicionar ao package.json:

```json
{
  "dependencies": {
    "react-big-calendar": "^1.8.5",
    "moment": "^2.29.4"
  }
}
```

Executar:
```bash
cd frontend
npm install react-big-calendar moment
```

---

## 🗄️ Executar Migrations

```bash
cd backend
npm run db:migrate
```

Ou manualmente:
```bash
npx sequelize-cli db:migrate
```

---

## 🧪 Testar as APIs

### Procedimentos

**Criar procedimento:**
```bash
POST http://localhost:8000/procedimentos
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Limpeza de Pele",
  "descricao": "Procedimento de limpeza profunda",
  "categoria": "Estética Facial",
  "duracaoMinutos": 60,
  "precoPadrao": 150.00,
  "precoPromocional": 120.00,
  "ativo": true
}
```

**Listar procedimentos:**
```bash
GET http://localhost:8000/procedimentos
Authorization: Bearer {token}
```

### Agendamentos

**Buscar slots disponíveis:**
```bash
GET http://localhost:8000/agendamentos/slots-disponiveis?procedimentoId=1&dataAgendamento=2026-01-20
Authorization: Bearer {token}
```

**Criar agendamento:**
```bash
POST http://localhost:8000/agendamentos
Authorization: Bearer {token}
Content-Type: application/json

{
  "pacienteId": 5,
  "procedimentoId": 1,
  "dataAgendamento": "2026-01-20",
  "horaInicio": "14:00",
  "notas": "Primeira sessão"
}
```

**Confirmar agendamento:**
```bash
POST http://localhost:8000/agendamentos/1/confirmar
Authorization: Bearer {token}
```

---

## 🎨 Cores dos Status (Frontend)

```javascript
const statusColors = {
  AGENDADO: "#f39c12",     // Laranja
  CONFIRMADO: "#3498db",   // Azul
  REALIZADO: "#27ae60",    // Verde
  CANCELADO: "#e74c3c",    // Vermelho
  NO_SHOW: "#95a5a6"       // Cinza
};
```

---

## 📝 Próximos Passos

1. ✅ Backend completo
2. ✅ Frontend base criado
3. ⏳ Criar componentes faltantes (modals, wizard)
4. ⏳ Adicionar rotas no menu
5. ⏳ Implementar integração com tickets
6. ⏳ Adicionar lembretes automáticos (N8N)
7. ⏳ Integrar com Google Calendar (opcional)
8. ⏳ Implementar sistema de notificações WhatsApp

---

## 🚀 Como continuar

1. Execute as migrations:
```bash
cd backend
npm run db:migrate
```

2. Instale dependências do frontend:
```bash
cd frontend
npm install react-big-calendar moment
```

3. Crie os componentes faltantes seguindo os exemplos acima

4. Adicione as rotas no menu de navegação

5. Teste as funcionalidades

6. Implemente a integração com tickets do WhatiCKet

---

## 📞 Suporte

Para dúvidas sobre a implementação, consulte:
- Modelos existentes em `backend/src/models/`
- Controllers existentes em `backend/src/controllers/`
- Páginas existentes em `frontend/src/pages/`

---

**Desenvolvido por: Claude Sonnet 4.5**
**Data: 14/01/2026**
**Sistema: CRM Tigre (WhatiCKet Fork)**
