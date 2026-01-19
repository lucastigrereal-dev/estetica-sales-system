# 🧪 TESTE RÁPIDO - FASE 3: LEMBRETES + NPS

**Como validar a implementação em 5 minutos**

---

## 📋 PASSO 0: Obter Token

```bash
# 1. Fazer login para obter token
TOKEN=$(curl -s -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@rodovansky.com.br",
    "password": "Tigre@2026"
  }' | jq -r '.token')

echo "Token obtido: $TOKEN"
```

---

## ✅ TESTE 1: Dashboard de Lembretes

```bash
curl -X GET "http://localhost:4000/lembretes/dashboard" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq
```

**Resposta Esperada:**
```json
{
  "sucesso": true,
  "dados": {
    "hoje": {
      "totalEnviados": 0,
      "totalFalhas": 0,
      "taxaEntrega": "0%",
      "respondidos": 0,
      "taxaResposta": "0%"
    },
    "proximos24h": 0,
    "errosRecentes": []
  }
}
```

---

## ✅ TESTE 2: Estatísticas

```bash
curl -X GET "http://localhost:4000/lembretes/stats" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq
```

**Resposta Esperada:**
```json
{
  "sucesso": true,
  "stats": {
    "periodoAnalise": "30 últimos dias",
    "totalGeral": 0,
    "totalEnviados": 0,
    "totalFalhas": 0,
    "taxaEntrega": "0%",
    "porTipo": {},
    "timestamp": "2026-01-19T20:30:00.000Z"
  }
}
```

---

## ✅ TESTE 3: Resultado NPS

```bash
curl -X GET "http://localhost:4000/lembretes/nps/resultado" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq
```

**Resposta Esperada (0 pesquisas):**
```json
{
  "sucesso": true,
  "nps": {
    "scoreMedio": 0,
    "npsScore": 0,
    "totalRespostas": 0,
    "promotores": 0,
    "passivos": 0,
    "detratores": 0,
    "distribuicao": {
      "promotores": "0",
      "passivos": "0",
      "detratores": "0"
    },
    "feedbacks": {
      "promotores": [],
      "passivos": [],
      "detratores": []
    }
  }
}
```

---

## ✅ TESTE 4: Verificar Tabela no DB

```bash
# Dentro do container MySQL
docker exec -it crm-tigre-db mysql -u root -proot -D crm_tigre -e "
  DESCRIBE LembreteLogs;
"
```

**Esperado:** Tabela com 16 colunas criada ✅

---

## ✅ TESTE 5: Verificar Cron Jobs nos Logs

```bash
# Ver se os jobs estão rodando
docker logs crm-tigre-backend 2>&1 | grep -i "lembrete" | tail -10
```

**Esperado:**
```
🚀 ========== INICIANDO JOBS DE LEMBRETE ==========
✅ Job LEMBRETE 24H registrado: 0 9 * * * (09:00 diariamente)
✅ Job LEMBRETE 2H registrado: */30 * * * * (a cada 30 minutos)
✅ Job NPS SURVEY registrado: 0 20 * * * (20:00 diariamente)
✅ Job REATIVAÇÃO registrado: 0 10 * * 1 (10:00 às segundas-feiras)
✅ Todos os 4 jobs de lembrete foram registrados com sucesso!
```

---

## 🔄 TESTE 6: Simular Lembrete Manual

```bash
# Trigger manual do job de 24h (para testes)
# Nota: Requer que a função seja exposta ou use scheduler externo

# Alternativa: Criar um agendamento de teste e verificar se LembreteLog é criado
docker exec -it crm-tigre-db mysql -u root -proot -D crm_tigre -e "
  SELECT id, tipo, status, tentativas FROM LembreteLogs LIMIT 5;
"
```

---

## 📊 TESTE 7: Forçar Erro (Teste Retry)

```bash
# Criar lembrete com erroMensagem (para testar retry)
docker exec -it crm-tigre-db mysql -u root -proot -D crm_tigre -e "
  INSERT INTO LembreteLogs
  (companyId, pacienteId, tipo, numeroWhatsapp, mensagem, status, tentativas, erroMensagem, createdAt, updatedAt)
  VALUES
  (3, 1, 'LEMBRETE_24H', '11999999999', 'Teste de lembrete', 'FALHA', 1, 'Erro simulado', NOW(), NOW());
"

# Depois testar reenvio
curl -X POST "http://localhost:4000/lembretes/reenviar/1" \
  -H "Authorization: Bearer $TOKEN" | jq
```

---

## 🚀 TESTE 8: Checkup Completo (Script)

```bash
#!/bin/bash

echo "🧪 TESTE COMPLETO - FASE 3"
echo "================================"
echo ""

# 1. Obter token
echo "1️⃣ Obtendo token..."
TOKEN=$(curl -s -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@rodovansky.com.br",
    "password": "Tigre@2026"
  }' | jq -r '.token')

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  echo "❌ Erro ao obter token"
  exit 1
fi
echo "✅ Token obtido"

# 2. Testar Dashboard
echo ""
echo "2️⃣ Testando dashboard..."
DASHBOARD=$(curl -s -X GET "http://localhost:4000/lembretes/dashboard" \
  -H "Authorization: Bearer $TOKEN")

if echo "$DASHBOARD" | jq -e '.sucesso' > /dev/null; then
  echo "✅ Dashboard funcionando"
else
  echo "❌ Dashboard falhou"
fi

# 3. Testar Stats
echo ""
echo "3️⃣ Testando stats..."
STATS=$(curl -s -X GET "http://localhost:4000/lembretes/stats" \
  -H "Authorization: Bearer $TOKEN")

if echo "$STATS" | jq -e '.sucesso' > /dev/null; then
  echo "✅ Stats funcionando"
else
  echo "❌ Stats falhou"
fi

# 4. Testar NPS
echo ""
echo "4️⃣ Testando NPS..."
NPS=$(curl -s -X GET "http://localhost:4000/lembretes/nps/resultado" \
  -H "Authorization: Bearer $TOKEN")

if echo "$NPS" | jq -e '.sucesso' > /dev/null; then
  echo "✅ NPS funcionando"
else
  echo "❌ NPS falhou"
fi

# 5. Verificar tabela
echo ""
echo "5️⃣ Verificando tabela LembreteLogs..."
TABLE_EXISTS=$(docker exec crm-tigre-db mysql -u root -proot -D crm_tigre -e "SHOW TABLES LIKE 'LembreteLogs'" 2>&1)

if [[ $TABLE_EXISTS == *"LembreteLogs"* ]]; then
  echo "✅ Tabela LembreteLogs existe"
else
  echo "❌ Tabela LembreteLogs não encontrada"
fi

# 6. Verificar jobs
echo ""
echo "6️⃣ Verificando cron jobs..."
JOBS=$(docker logs crm-tigre-backend 2>&1 | grep -i "lembrete" | wc -l)

if [ $JOBS -gt 0 ]; then
  echo "✅ Cron jobs iniciados ($JOBS linhas encontradas)"
else
  echo "❌ Cron jobs não encontrados"
fi

echo ""
echo "================================"
echo "✅ TESTE COMPLETO FINALIZADO!"
```

**Salvar como `teste_fase3.sh` e executar:**
```bash
chmod +x teste_fase3.sh
./teste_fase3.sh
```

---

## 📋 CHECKLIST DE TESTE

- [ ] Dashboard retorna sucesso (200)
- [ ] Stats retorna sucesso (200)
- [ ] NPS retorna sucesso (200)
- [ ] Tabela LembreteLogs existe
- [ ] Cron jobs estão no log de startup
- [ ] Nenhum erro 500 nos endpoints
- [ ] Estrutura JSON válida em todas as respostas

---

## 🐛 POSSÍVEIS ERROS

### Erro 1: "Route not found" (404)

```
❌ GET /lembretes/dashboard returns 404
```

**Solução:**
1. Verificar se rotas foram registradas em `routes/index.ts`
2. Reiniciar backend: `docker restart crm-tigre-backend`
3. Verificar logs: `docker logs crm-tigre-backend`

### Erro 2: "Unauthorized" (401)

```
❌ GET /lembretes/dashboard returns 401
```

**Solução:**
1. Verificar se token é válido
2. Fazer login novamente
3. Passar token correto no header: `Authorization: Bearer [TOKEN]`

### Erro 3: "Internal server error" (500)

```
❌ GET /lembretes/dashboard returns 500
```

**Solução:**
1. Verificar logs: `docker logs crm-tigre-backend | tail -50`
2. Verificar se tabela LembreteLogs existe
3. Verificar conexão com banco
4. Executar migração: `docker exec crm-tigre-backend npm run db:migrate`

### Erro 4: "Table not found"

```
❌ SELECT * FROM LembreteLogs; returns error
```

**Solução:**
1. Executar migração: `npm run db:migrate`
2. Verificar se arquivo de migração existe
3. Verificar logs de migração

---

## ⚡ TESTE RÁPIDO (1 MINUTO)

```bash
# Copiar e colar tudo de uma vez:

TOKEN=$(curl -s -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@rodovansky.com.br","password":"Tigre@2026"}' | jq -r '.token')

echo "=== DASHBOARD ===" && \
curl -s http://localhost:4000/lembretes/dashboard \
  -H "Authorization: Bearer $TOKEN" | jq .

echo "" && echo "=== STATS ===" && \
curl -s http://localhost:4000/lembretes/stats \
  -H "Authorization: Bearer $TOKEN" | jq .

echo "" && echo "=== NPS ===" && \
curl -s http://localhost:4000/lembretes/nps/resultado \
  -H "Authorization: Bearer $TOKEN" | jq .
```

---

## 📞 REFERÊNCIA DE ENDPOINTS

| Endpoint | Método | Auth | Teste |
|----------|--------|------|-------|
| `/lembretes/dashboard` | GET | ✅ | ✅ |
| `/lembretes/stats` | GET | ✅ | ✅ |
| `/lembretes/nps/resultado` | GET | ✅ | ✅ |
| `/lembretes/status/:id` | GET | ✅ | ⏳ |
| `/lembretes/reenviar/:id` | POST | ✅ | ⏳ |

---

**Pronto para testar! 🚀**

Execute os testes acima para validar que a FASE 3 está funcionando corretamente.
