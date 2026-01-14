# 🔒 Configuração de Segurança - CRM Tigre

## Middlewares de Segurança Implementados

### 📁 Arquivos Criados

1. **`src/middleware/rateLimiter.ts`** - Rate limiting com Redis
2. **`src/middleware/security.ts`** - Helmet, CORS, sanitização

---

## 🚀 Como Integrar no Backend

### 1. Instalar Dependências

```bash
cd saaskdmcodigo/backend
npm install express-rate-limit rate-limit-redis helmet cors express-validator ioredis
```

### 2. Modificar `src/app.ts` ou `src/server.ts`

Adicionar após os imports:

```typescript
import { helmetConfig, corsConfig, sanitizeInput, requestLogger } from "./middleware/security";
import { generalLimiter, authLimiter, webhookLimiter, annaLimiter } from "./middleware/rateLimiter";
```

Adicionar antes das rotas:

```typescript
// Segurança
app.use(helmetConfig);
app.use(corsConfig);
app.use(sanitizeInput);
app.use(requestLogger);

// Rate limiting geral
app.use(generalLimiter);
```

### 3. Aplicar Rate Limiters Específicos

**Login/Auth:**
```typescript
// Em src/routes/authRoutes.ts
import { authLimiter } from "../middleware/rateLimiter";

authRoutes.post("/login", authLimiter, AuthController.store);
authRoutes.post("/signup", authLimiter, AuthController.createUser);
```

**WhatsApp Webhook:**
```typescript
// Em src/routes/WebHookMetaRoutes.ts
import { webhookLimiter } from "../middleware/rateLimiter";

webhookRoutes.post("/", webhookLimiter, WebHookMetaController.index);
```

**Anna IA:**
```typescript
// Em src/routes/annaRoutes.ts
import { annaLimiter } from "../middleware/rateLimiter";

annaRoutes.get("/anna/analysis/:ticketId", isAuth, annaLimiter, AnnaController.getAnalysis);
annaRoutes.get("/anna/dashboard", isAuth, annaLimiter, AnnaController.getDashboard);
```

---

## 🛡️ Funcionalidades de Segurança

### Rate Limiting (Redis)

| Endpoint | Limite | Janela |
|----------|--------|--------|
| API Geral | 100 req | 15 min |
| Login/Auth | 5 tentativas | 15 min |
| APIs Públicas | 30 req | 1 min |
| Webhooks | 300 req | 1 min |
| Anna IA | 10 análises | 1 min |

### Helmet - Security Headers

✅ Content Security Policy (CSP)
✅ X-Frame-Options: SAMEORIGIN
✅ X-Content-Type-Options: nosniff
✅ X-XSS-Protection: 1; mode=block
✅ HSTS (31536000 segundos = 1 ano)

### CORS

- Origens permitidas configuráveis via `FRONTEND_URL`
- Credentials: true (cookies permitidos)
- Preflight cache: 24h

### Sanitização de Inputs

✅ Remove tags `<script>`
✅ Remove `javascript:` protocol
✅ Remove event handlers (`onclick`, `onerror`, etc)
✅ Aplica recursivamente em body, query, params

### Request Logger

- Loga todas as requisições com:
  - Método, URL, status
  - Duração (ms)
  - IP, User-Agent
  - Timestamp

---

## 📊 Monitoramento de Segurança

### Ver Logs de Rate Limiting (Redis)

```bash
# Acessar Redis
docker-compose exec redis redis-cli -a ${REDIS_PASSWORD}

# Ver todas as keys de rate limit
KEYS rl:*

# Ver detalhes de um IP
GET rl:127.0.0.1
```

### Ver Tentativas de Login Falhas

```bash
# Backend logs
docker-compose logs backend | grep -i "login\|unauthorized\|forbidden"
```

### Alertas de Segurança

Configurar alertas para:
- Mais de 10 tentativas de login falhas do mesmo IP
- Rate limit atingido > 100x por dia
- Requisições com payloads suspeitos

---

## 🔧 Testes de Segurança

### Testar Rate Limiting

```bash
# Testar limite de login (5 tentativas)
for i in {1..10}; do
  curl -X POST https://api.crm.suaclinica.com/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"teste@exemplo.com","password":"senha123"}'
done

# Deve retornar 429 após 5 tentativas
```

### Testar CORS

```bash
# Origem permitida
curl -H "Origin: https://crm.suaclinica.com" \
  -H "Access-Control-Request-Method: POST" \
  -X OPTIONS \
  https://api.crm.suaclinica.com/health

# Origem não permitida (deve falhar)
curl -H "Origin: https://malicious-site.com" \
  -H "Access-Control-Request-Method: POST" \
  -X OPTIONS \
  https://api.crm.suaclinica.com/health
```

### Testar Sanitização

```bash
# Tentar XSS
curl -X POST https://api.crm.suaclinica.com/tickets \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"<script>alert(1)</script>"}'

# Script deve ser removido
```

---

## ⚠️ Checklist de Produção

- [ ] Rate limiting habilitado em todas as rotas críticas
- [ ] CORS configurado apenas para domínios conhecidos
- [ ] Helmet habilitado com CSP estrito
- [ ] Sanitização de inputs ativa
- [ ] Request logging configurado (JSON)
- [ ] Monitoramento de tentativas de login falhas
- [ ] Alertas configurados (Sentry, PagerDuty, etc)
- [ ] Redis com senha forte
- [ ] Certificados SSL válidos
- [ ] Firewall configurado (UFW)
- [ ] Fail2ban instalado
- [ ] SSH com key-based auth (sem senha)

---

## 🆘 Troubleshooting

### Rate Limit Bloqueando Usuários Legítimos

**Solução 1: Aumentar limites**
```typescript
// src/middleware/rateLimiter.ts
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200, // Aumentar de 100 para 200
  // ...
});
```

**Solução 2: Whitelist de IPs**
```typescript
// Adicionar no rateLimiter.ts
const ipWhitelist = ["123.456.789.0"]; // IP do monitoramento

export const generalLimiter = rateLimit({
  // ...
  skip: (req) => ipWhitelist.includes(req.ip)
});
```

### CORS Bloqueando Frontend

**Verificar origem no .env:**
```bash
FRONTEND_URL=https://crm.suaclinica.com
```

**Adicionar origem manualmente:**
```typescript
// src/middleware/security.ts
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://crm.suaclinica.com", // Adicionar aqui
  "https://www.crm.suaclinica.com"
];
```

### Redis Não Conecta

```bash
# Verificar se Redis está rodando
docker-compose ps redis

# Verificar senha
docker-compose logs redis | grep password

# Testar conexão
docker-compose exec backend node -e "
const Redis = require('ioredis');
const client = new Redis({
  host: 'redis',
  port: 6379,
  password: process.env.IO_REDIS_PASSWORD
});
client.ping().then(console.log);
"
```

---

## 📚 Referências

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Helmet.js](https://helmetjs.github.io/)
- [Rate Limit Redis](https://github.com/wyattjoh/rate-limit-redis)

---

**⚠️ IMPORTANTE**: Segurança é um processo contínuo. Revisar e atualizar regularmente!
