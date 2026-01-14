# 🚀 Integração Dashboard Executivo e Relatórios - CRM Tigre Frontend

## Arquivos Criados

### 📊 API Service
- `src/services/api-dashboard.js` - Funções para comunicação com backend

### 📈 Componentes de Gráficos
- `src/components/Charts/FaturamentoChart.js` - Gráfico de linha (faturamento)
- `src/components/Charts/AgendamentosChart.js` - Gráfico de barras (agendamentos)
- `src/components/Charts/ConversaoFunil.js` - Funil de conversão visual
- `src/components/Charts/TopProcedimentos.js` - Gráfico de pizza (procedimentos)

### 📄 Páginas
- `src/pages/DashboardExecutivo/index.js` - Dashboard com KPIs e gráficos
- `src/pages/Relatorios/index.js` - Geração e exportação de relatórios

---

## 🔧 Como Integrar no App.js

### 1. Adicionar Imports

```javascript
// No topo do arquivo App.js
import DashboardExecutivo from "./pages/DashboardExecutivo";
import Relatorios from "./pages/Relatorios";
```

### 2. Adicionar Rotas

```javascript
// Dentro do <Switch> do Router
<Route exact path="/dashboard-executivo" component={DashboardExecutivo} />
<Route exact path="/relatorios" component={Relatorios} />
```

### Exemplo Completo (App.js):

```javascript
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// Imports existentes...
import Dashboard from "./pages/Dashboard";
import Tickets from "./pages/Tickets";
// ... outras páginas

// NOVOS IMPORTS
import DashboardExecutivo from "./pages/DashboardExecutivo";
import Relatorios from "./pages/Relatorios";

function App() {
  return (
    <Router>
      <Switch>
        {/* Rotas existentes */}
        <Route exact path="/" component={Dashboard} />
        <Route exact path="/tickets" component={Tickets} />

        {/* NOVAS ROTAS */}
        <Route exact path="/dashboard-executivo" component={DashboardExecutivo} />
        <Route exact path="/relatorios" component={Relatorios} />
      </Switch>
    </Router>
  );
}

export default App;
```

---

## 📱 Adicionar ao Menu Lateral (MainListItems.js ou similar)

```javascript
import { Assessment, BarChart } from "@material-ui/icons";

// Dentro do retorno do componente de menu:
<ListItem button onClick={() => history.push("/dashboard-executivo")}>
  <ListItemIcon>
    <BarChart />
  </ListItemIcon>
  <ListItemText primary="Dashboard Executivo" />
</ListItem>

<ListItem button onClick={() => history.push("/relatorios")}>
  <ListItemIcon>
    <Assessment />
  </ListItemIcon>
  <ListItemText primary="Relatórios" />
</ListItem>
```

---

## ⚙️ Configuração Necessária

### 1. Configurar API Base URL

Certifique-se de que o arquivo `src/services/api.js` está configurado corretamente:

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || "http://localhost:8000/api",
});

export default api;
```

### 2. Configurar Clinica ID

O dashboard busca o `clinicaId` do `localStorage`. Você pode configurá-lo no login:

```javascript
// Após login bem-sucedido:
localStorage.setItem("clinicaId", user.clinicaId);
```

Ou criar um contexto global:

```javascript
// src/context/ClinicaContext.js
import React, { createContext, useState, useContext } from "react";

const ClinicaContext = createContext();

export const ClinicaProvider = ({ children }) => {
  const [clinicaId, setClinicaId] = useState(
    localStorage.getItem("clinicaId") || 1
  );

  return (
    <ClinicaContext.Provider value={{ clinicaId, setClinicaId }}>
      {children}
    </ClinicaContext.Provider>
  );
};

export const useClinica = () => useContext(ClinicaContext);
```

---

## 🎨 Funcionalidades Implementadas

### Dashboard Executivo

✅ **4 KPIs no Topo**:
- Agendamentos Hoje (total + realizados)
- Faturamento Hoje
- No-Shows (quantidade + taxa)
- Novos Leads

✅ **Gráficos**:
- Faturamento (últimos 30 dias) - LineChart
- Agendamentos por dia - BarChart
- Funil de Conversão (Leads → Qualificados → Agendados → Realizados)
- Top Procedimentos - PieChart

✅ **Auto-Refresh**:
- Atualiza automaticamente a cada 5 minutos
- Mostra horário da última atualização

### Relatórios

✅ **Relatório Mensal PDF**:
- Seleciona mês e ano
- Gera PDF completo com todas as métricas
- Download automático

✅ **Exportação Excel**:
- Agendamentos (com filtros de data e status)
- Pacientes (com filtro por nome)
- Financeiro (com filtros de data, status e método)

---

## 🧪 Como Testar

### 1. Iniciar Backend
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

### 2. Iniciar Frontend
```bash
cd crm-tigre/frontend
npm start
```

### 3. Acessar Páginas
- Dashboard: `http://localhost:3000/dashboard-executivo`
- Relatórios: `http://localhost:3000/relatorios`

### 4. Testar Funcionalidades
1. **Dashboard**: Verificar se os KPIs e gráficos carregam
2. **Relatórios**: Gerar um PDF mensal
3. **Exportação**: Exportar agendamentos para Excel
4. **Auto-refresh**: Aguardar 5 minutos e verificar atualização

---

## 🐛 Troubleshooting

### Erro: "clinicaId is not defined"
**Solução**: Configure o clinicaId no localStorage:
```javascript
localStorage.setItem("clinicaId", 1);
```

### Erro: "Network Error" ou CORS
**Solução**: Verifique se o backend está rodando na porta 8000 e se o CORS está configurado corretamente no `main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Gráficos não aparecem
**Solução**: Verifique se os dados estão sendo retornados corretamente:
```javascript
console.log("Dados do dashboard:", resumo, metricas, conversao);
```

### PDF/Excel não baixa
**Solução**: Verifique se o backend está retornando o arquivo corretamente (responseType: "blob")

---

## 📦 Dependências Já Instaladas

✅ `recharts` - Biblioteca de gráficos (já instalado no package.json)
✅ `@material-ui/core` - UI Components
✅ `@material-ui/icons` - Ícones
✅ `axios` - Cliente HTTP
✅ `react-toastify` - Notificações

---

## 🎯 Próximos Passos Recomendados

1. **Adicionar Filtros de Período** no Dashboard
2. **Implementar Cache** de dados para melhor performance
3. **Adicionar Loading States** mais sofisticados
4. **Criar Tela de Preview** dos relatórios antes de baixar
5. **Implementar Histórico** de relatórios gerados
6. **Adicionar Comparativos** visuais (mês anterior vs atual)
7. **Criar Alertas** quando métricas estiverem abaixo da meta

---

## 📝 Notas Importantes

- O Dashboard atualiza automaticamente a cada 5 minutos
- Os relatórios são gerados sob demanda
- Todos os downloads são automáticos (não requerem confirmação)
- As métricas consideram apenas dados da clínica autenticada (multi-tenant)
- Os gráficos são responsivos e se adaptam ao tamanho da tela

---

**Versão**: 1.0.0
**Última Atualização**: 2026-01-14
