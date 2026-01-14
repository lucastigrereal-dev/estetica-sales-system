# CRM Tigre - Módulos Implementados

## 📦 Módulos Desenvolvidos

Este documento descreve todos os módulos implementados no CRM Tigre.

---

## 🏦 Módulo Financeiro (Completo)

Sistema completo de gestão financeira com suporte a múltiplos provedores de pagamento.

### Funcionalidades

✅ **Multi-tenant**: Cada clínica tem suas próprias credenciais e dados isolados
✅ **Pagamentos PIX** via Gerencianet
✅ **Pagamentos PIX/Boleto** via Asaas
✅ **Pagamentos manuais** (Cartão, Dinheiro)
✅ **Webhooks** para confirmação automática de pagamentos
✅ **Dashboard Financeiro** com métricas em tempo real
✅ **Criptografia** de credenciais sensíveis

### Endpoints Implementados

#### Clínicas
- `POST /api/clinicas` - Criar clínica
- `GET /api/clinicas/{id}` - Buscar clínica
- `PUT /api/clinicas/{id}` - Atualizar clínica

#### Pagamentos
- `GET /api/pagamentos` - Listar pagamentos (com filtros)
- `GET /api/pagamentos/{id}` - Detalhes do pagamento
- `POST /api/pagamentos` - Registrar pagamento manual
- `POST /api/pagamentos/pix/gerencianet` - Gerar PIX Gerencianet
- `POST /api/pagamentos/asaas` - Criar cobrança Asaas (PIX/Boleto)

#### Webhooks
- `POST /api/pagamentos/webhook/gerencianet` - Webhook Gerencianet
- `POST /api/pagamentos/webhook/asaas` - Webhook Asaas

#### Dashboard Financeiro
- `GET /api/dashboard/financeiro` - Métricas financeiras completas

### Arquivos Criados

```
backend/app/
├── models.py (+ Clinica, Pagamento, WebhookLog)
├── schemas.py (+ schemas financeiros)
├── dependencies.py (multi-tenant)
├── utils/
│   └── encryption.py
├── services/
│   ├── gerencianet_service.py
│   ├── asaas_service.py
│   └── factory.py
├── routers/
│   ├── clinicas.py
│   ├── pagamentos.py
│   └── webhooks.py
└── migrations/
    └── add_financeiro.sql
```

### Configuração

1. **Gerar chave de criptografia:**
```bash
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

2. **Adicionar ao `.env`:**
```env
PAYMENT_ENCRYPTION_KEY=<chave_gerada>

# Gerencianet (opcional - pode configurar por clínica)
GERENCIANET_CLIENT_ID=
GERENCIANET_CLIENT_SECRET=
GERENCIANET_PIX_KEY=
```

3. **Executar migração:**
```bash
# Via SQL direto
sqlite3 database/estetica.db < backend/migrations/add_financeiro.sql

# Ou deixar SQLAlchemy criar as tabelas automaticamente
```

### Uso

#### Exemplo: Criar Clínica
```bash
curl -X POST http://localhost:8000/api/clinicas \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Clínica Beleza",
    "cnpj": "12345678000190",
    "telefone": "(11) 98765-4321",
    "email": "contato@clinicabeleza.com",
    "gerencianet_client_id": "Client_Id_123",
    "gerencianet_client_secret": "Client_Secret_456",
    "gerencianet_pix_key": "12345678000190"
  }'
```

#### Exemplo: Gerar PIX
```bash
curl -X POST http://localhost:8000/api/pagamentos/pix/gerencianet \
  -H "Content-Type: application/json" \
  -H "X-Clinica-Id: 1" \
  -d '{
    "paciente_id": 5,
    "valor": 250.00,
    "desconto": 0
  }'
```

---

## 📊 Módulo Dashboard Executivo (Completo)

Dashboard executivo com KPIs, gráficos e relatórios para tomada de decisão.

### Funcionalidades

✅ **Resumo Diário**: Agendamentos, faturamento, no-shows, leads
✅ **Métricas Temporais**: Gráficos de faturamento e agendamentos
✅ **Funil de Conversão**: Leads → Qualificados → Agendados → Realizados
✅ **Rankings**: Top procedimentos e top pacientes
✅ **Análise Comparativa**: Comparação com período anterior
✅ **Relatórios PDF**: Relatório mensal completo
✅ **Exportação Excel**: Agendamentos, Pacientes, Financeiro

### Endpoints Implementados

#### Dashboard Executivo
- `GET /api/dashboard/executivo/resumo-hoje` - KPIs do dia
- `GET /api/dashboard/executivo/metricas?periodo=30` - Métricas para gráficos
- `GET /api/dashboard/executivo/conversao?periodo=30` - Funil de conversão
- `GET /api/dashboard/executivo/top-procedimentos?periodo=30&limit=5` - Ranking procedimentos
- `GET /api/dashboard/executivo/top-pacientes?periodo=30&limit=10` - Top pacientes
- `GET /api/dashboard/executivo/comparativo?periodo=30` - Comparação de períodos

#### Relatórios
- `GET /api/relatorios/mensal/pdf?mes=1&ano=2026` - Relatório mensal PDF
- `GET /api/relatorios/agendamentos/excel` - Exportar agendamentos Excel
- `GET /api/relatorios/pacientes/excel` - Exportar pacientes Excel
- `GET /api/relatorios/financeiro/excel` - Exportar financeiro Excel

### Arquivos Criados

```
backend/app/
├── routers/
│   ├── dashboard_executivo.py
│   └── relatorios.py
└── services/
    └── relatorio_service.py
```

### Métricas Disponíveis

#### Resumo Hoje
```json
{
  "agendamentos_total": 15,
  "agendamentos_realizados": 12,
  "no_shows": 2,
  "faturamento_hoje": 3250.00,
  "novos_leads": 8,
  "taxa_no_show": 13.33
}
```

#### Funil de Conversão
```json
{
  "leads": 150,
  "qualificados": 120,
  "agendados": 90,
  "realizados": 75,
  "taxas": {
    "qualificacao": 80.0,
    "agendamento": 75.0,
    "conversao": 83.33
  }
}
```

#### Comparativo de Períodos
```json
{
  "faturamento": {
    "atual": 45000.00,
    "anterior": 38000.00,
    "variacao": 18.42
  },
  "agendamentos": {
    "atual": 120,
    "anterior": 105,
    "variacao": 14.29
  }
}
```

### Uso dos Relatórios

#### Gerar Relatório PDF
```bash
curl -X GET "http://localhost:8000/api/relatorios/mensal/pdf?mes=1&ano=2026" \
  -H "X-Clinica-Id: 1" \
  --output relatorio_202601.pdf
```

#### Exportar Financeiro Excel
```bash
curl -X GET "http://localhost:8000/api/relatorios/financeiro/excel?data_inicio=2026-01-01&data_fim=2026-01-31" \
  -H "X-Clinica-Id: 1" \
  --output financeiro.xlsx
```

---

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

#### clinicas
```sql
id, nome, cnpj, telefone, email,
gerencianet_client_id_encrypted,
gerencianet_client_secret_encrypted,
gerencianet_pix_cert_path,
gerencianet_pix_key,
asaas_token_encrypted,
created_at
```

#### pagamentos
```sql
id, agendamento_id, paciente_id, clinica_id,
valor, desconto, valor_final,
metodo (CARTAO, PIX, BOLETO, DINHEIRO),
status (PENDENTE, APROVADO, RECUSADO, REEMBOLSADO),
gerencianet_payment_id, gerencianet_txid,
asaas_payment_id, pix_code, boleto_url,
observacoes, created_at, data_pagamento, updated_at
```

#### webhook_logs
```sql
id, provider (gerencianet, asaas),
payload, processed, created_at
```

### Índices Criados
- `idx_paciente_clinica` em pacientes(clinica_id)
- `idx_agendamento_clinica` em agendamentos(clinica_id)
- `idx_pagamento_clinica_status` em pagamentos(clinica_id, status)
- `idx_pagamento_clinica_created` em pagamentos(clinica_id, created_at)
- `idx_pagamento_gn_txid` em pagamentos(gerencianet_txid)
- `idx_pagamento_asaas_id` em pagamentos(asaas_payment_id)

---

## 🚀 Iniciar o Sistema

### 1. Instalar Dependências
```bash
cd backend
pip install -r requirements.txt
```

### 2. Configurar Variáveis de Ambiente
```bash
cp .env.example .env
# Editar .env com suas configurações
```

### 3. Executar Migração
```bash
sqlite3 database/estetica.db < migrations/add_financeiro.sql
```

### 4. Iniciar Servidor
```bash
uvicorn app.main:app --reload --port 8000
```

### 5. Acessar Documentação
```
http://localhost:8000/docs
```

---

## 🔐 Segurança

### Credenciais Criptografadas
- Todas as credenciais de pagamento são criptografadas com **Fernet (symmetric encryption)**
- Chave de criptografia deve ser mantida segura em variável de ambiente
- Certificados .p12 devem ser armazenados fora do webroot

### Multi-Tenancy
- Isolamento total de dados por clínica
- Filtro automático em todas as queries
- Header `X-Clinica-Id` obrigatório (em produção usar JWT)

### Webhooks
- Validação de assinatura (Gerencianet)
- Validação de token (Asaas)
- Log de todos os eventos para auditoria
- Idempotência para evitar processamento duplicado

---

## 📈 Próximos Passos

### Frontend (Recomendado)
1. Criar páginas React/Next.js para:
   - Dashboard executivo com gráficos (Recharts)
   - Gestão de pagamentos
   - Visualização de relatórios
2. Auto-atualização do dashboard a cada 5 minutos
3. Notificações em tempo real (WebSocket)

### Melhorias Futuras
1. Background jobs para reconciliação de pagamentos
2. Notificações por email/SMS
3. Split de pagamento (comissões)
4. Assinaturas recorrentes
5. Integração com contabilidade

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Consulte a documentação da API: `http://localhost:8000/docs`
2. Verifique os logs de webhook em `webhook_logs`
3. Teste endpoints com Swagger UI integrado

**Versão**: 2.0.0
**Última Atualização**: 2026-01-14
