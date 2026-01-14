# 🚀 CRM Tigre - Guia de Deploy em Produção

Guia completo para deploy do CRM Tigre em produção com Docker, Nginx, PostgreSQL e Redis.

---

## 📋 Índice

- [Pré-requisitos](#-pré-requisitos)
- [Arquitetura](#-arquitetura)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Deploy](#-deploy)
- [Backup e Restore](#-backup-e-restore)
- [Monitoramento](#-monitoramento)
- [Troubleshooting](#-troubleshooting)

---

## 🔧 Pré-requisitos

### Servidor

- **Sistema Operacional**: Ubuntu 20.04+ ou Debian 11+
- **RAM**: Mínimo 2GB (4GB recomendado)
- **Disco**: Mínimo 10GB de espaço livre
- **CPU**: 2 cores ou mais
- **Rede**: Porta 80 e 443 abertas

### Software

```bash
# Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Git
sudo apt-get update
sudo apt-get install -y git
```

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────┐
│           Internet (Port 80/443)            │
└────────────────┬────────────────────────────┘
                 │
        ┌────────▼─────────┐
        │   Nginx (Frontend)│
        │   Port: 80/443    │
        └────────┬──────────┘
                 │
        ┌────────▼─────────┐
        │   FastAPI Backend │
        │   Port: 8000      │
        └───┬─────────┬─────┘
            │         │
    ┌───────▼──┐  ┌──▼──────┐
    │PostgreSQL│  │  Redis  │
    │Port: 5432│  │Port:6379│
    └──────────┘  └─────────┘
```

---

## 📦 Instalação

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/estetica-sales-system.git
cd estetica-sales-system
```

### 2. Configure Variáveis de Ambiente

#### 2.1. Arquivo `.env` (Docker Compose)

```bash
cp .env.example .env
nano .env
```

Edite as seguintes variáveis:

```env
# PostgreSQL
POSTGRES_USER=crm_user
POSTGRES_PASSWORD=SEU_PASSWORD_FORTE_AQUI
POSTGRES_DB=crm_tigre

# Redis
REDIS_PASSWORD=SEU_REDIS_PASSWORD_AQUI

# Backend URL
REACT_APP_BACKEND_URL=https://api.seudominio.com

# n8n
N8N_USER=admin
N8N_PASSWORD=SEU_N8N_PASSWORD_AQUI
N8N_WEBHOOK_URL=https://n8n.seudominio.com
```

#### 2.2. Arquivo `backend/.env.production`

```bash
cp backend/.env.example backend/.env.production
nano backend/.env.production
```

**Variáveis Críticas**:

```env
# Gerar chave de criptografia
PAYMENT_ENCRYPTION_KEY=$(python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())")

# Secret keys
SECRET_KEY=gere_um_hash_aleatorio_aqui
JWT_SECRET_KEY=gere_outro_hash_aleatorio_aqui

# Database (usar valores do .env)
DATABASE_URL=postgresql://crm_user:SEU_PASSWORD@postgres:5432/crm_tigre

# CORS (seu domínio)
CORS_ORIGINS=https://seudominio.com,https://www.seudominio.com

# Email SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASSWORD=sua-senha-de-app

# Gerencianet (opcional)
GERENCIANET_CLIENT_ID=seu_client_id
GERENCIANET_CLIENT_SECRET=seu_client_secret
GERENCIANET_PIX_KEY=sua_chave_pix

# Asaas (opcional)
ASAAS_API_KEY=sua_api_key
```

### 3. SSL Certificates (HTTPS)

#### Opção A: Let's Encrypt (Recomendado)

```bash
# Instalar Certbot
sudo apt-get install certbot python3-certbot-nginx

# Gerar certificados
sudo certbot certonly --standalone -d seudominio.com -d www.seudominio.com

# Copiar certificados
sudo cp /etc/letsencrypt/live/seudominio.com/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/seudominio.com/privkey.pem nginx/ssl/
```

#### Opção B: Certificado Auto-assinado (Desenvolvimento)

```bash
mkdir -p nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/privkey.pem \
  -out nginx/ssl/fullchain.pem
```

### 4. Certificados Gerencianet

Se usar PIX via Gerencianet:

```bash
mkdir -p backend/certs
# Copie seu arquivo .p12 para backend/certs/
cp seu_certificado.p12 backend/certs/
```

---

## 🚀 Deploy

### Deploy Automático (Recomendado)

```bash
# Tornar script executável
chmod +x scripts/deploy.sh

# Executar deploy
./scripts/deploy.sh
```

O script irá:
1. ✅ Verificar pré-requisitos
2. ✅ Fazer backup do banco atual
3. ✅ Puxar código atualizado
4. ✅ Build das imagens Docker
5. ✅ Iniciar containers
6. ✅ Executar migrações
7. ✅ Verificar health checks

### Deploy Manual

```bash
# 1. Build das imagens
docker-compose build --no-cache

# 2. Iniciar serviços
docker-compose up -d

# 3. Verificar status
docker-compose ps

# 4. Ver logs
docker-compose logs -f
```

### Verificar Deployment

```bash
# Health check backend
curl -f http://localhost:8000/health

# Health check frontend
curl -f http://localhost:80

# Ver logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

---

## 💾 Backup e Restore

### Backup Automático

```bash
# Executar backup completo
./scripts/backup.sh

# Backups são salvos em: ./backups/
# - postgres-TIMESTAMP.sql.gz
# - redis-TIMESTAMP.rdb.gz
# - uploads-TIMESTAMP.tar.gz
# - full-backup-TIMESTAMP.tar.gz
```

### Backup Agendado (Cron)

```bash
# Editar crontab
crontab -e

# Adicionar linha (backup diário às 3h)
0 3 * * * cd /caminho/para/estetica-sales-system && ./scripts/backup.sh >> logs/cron-backup.log 2>&1
```

### Restore

```bash
# Listar backups disponíveis
./scripts/restore.sh

# Restaurar backup completo
./scripts/restore.sh full backups/full-backup-20250114-120000.tar.gz

# Restaurar apenas banco de dados
./scripts/restore.sh postgres backups/postgres-20250114-120000.sql.gz

# Restaurar apenas Redis
./scripts/restore.sh redis backups/redis-20250114-120000.rdb.gz

# Restaurar apenas uploads
./scripts/restore.sh uploads backups/uploads-20250114-120000.tar.gz
```

---

## 📊 Monitoramento

### Status dos Containers

```bash
# Ver status
docker-compose ps

# Ver recursos (CPU, RAM, Network)
docker stats

# Health checks
docker-compose exec backend curl -f http://localhost:8000/health
```

### Logs

```bash
# Todos os serviços
docker-compose logs -f

# Backend apenas
docker-compose logs -f backend

# Frontend apenas
docker-compose logs -f frontend

# PostgreSQL
docker-compose logs -f postgres

# Últimas 100 linhas
docker-compose logs --tail=100 backend
```

### Métricas de Performance

```bash
# Uso de disco
docker system df

# Containers rodando
docker ps

# Volumes
docker volume ls

# Networks
docker network ls
```

---

## 🔐 Segurança

### Firewall (UFW)

```bash
# Instalar UFW
sudo apt-get install ufw

# Permitir SSH
sudo ufw allow 22/tcp

# Permitir HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Ativar firewall
sudo ufw enable

# Verificar status
sudo ufw status
```

### Atualizações de Segurança

```bash
# Atualizar sistema
sudo apt-get update
sudo apt-get upgrade -y

# Atualizar Docker images
docker-compose pull
docker-compose up -d
```

### Hardening

1. **Mudar senhas padrão** em `.env` e `.env.production`
2. **Limitar acesso SSH** (usar chaves SSH)
3. **Configurar fail2ban** para proteger contra brute force
4. **Monitorar logs** regularmente
5. **Backups automáticos** diários

---

## 🔧 Troubleshooting

### Container não inicia

```bash
# Ver logs do container
docker-compose logs <service_name>

# Exemplo
docker-compose logs backend

# Reiniciar serviço específico
docker-compose restart backend
```

### Erro de conexão com banco

```bash
# Verificar se PostgreSQL está rodando
docker-compose ps postgres

# Ver logs do PostgreSQL
docker-compose logs postgres

# Testar conexão
docker-compose exec postgres psql -U crm_user -d crm_tigre -c "SELECT 1;"
```

### Frontend não carrega

```bash
# Verificar Nginx
docker-compose logs frontend

# Testar configuração Nginx
docker-compose exec frontend nginx -t

# Reiniciar Nginx
docker-compose restart frontend
```

### API retorna erro 500

```bash
# Ver logs detalhados
docker-compose logs -f backend

# Entrar no container
docker-compose exec backend bash

# Verificar variáveis de ambiente
docker-compose exec backend env | grep DATABASE_URL
```

### Problemas com SSL

```bash
# Verificar certificados
ls -la nginx/ssl/

# Testar SSL
openssl s_client -connect seudominio.com:443 -servername seudominio.com

# Renovar Let's Encrypt
sudo certbot renew
```

### Espaço em disco cheio

```bash
# Limpar logs antigos
docker-compose exec backend find /app/logs -name "*.log" -mtime +30 -delete

# Limpar imagens Docker não utilizadas
docker system prune -a

# Limpar backups antigos (mais de 30 dias)
find ./backups -name "*.gz" -mtime +30 -delete
```

---

## 📈 Escalabilidade

### Aumentar Workers do Backend

Edite `backend/Dockerfile.prod`:

```dockerfile
# Mudar de --workers 4 para --workers 8
CMD ["gunicorn", "app.main:app", \
     "--workers", "8", \
     ...
```

### Adicionar Redis Replicação

```yaml
# docker-compose.yml
redis-replica:
  image: redis:7-alpine
  command: redis-server --replicaof redis 6379
```

### Load Balancer

Para múltiplos backends, use Nginx upstream:

```nginx
upstream backend_servers {
    server backend1:8000;
    server backend2:8000;
    server backend3:8000;
}
```

---

## 🔄 Atualização

### Atualizar para nova versão

```bash
# 1. Fazer backup
./scripts/backup.sh

# 2. Parar containers
docker-compose stop

# 3. Puxar código atualizado
git pull origin main

# 4. Rebuild e restart
docker-compose up -d --build

# 5. Verificar migração do banco
docker-compose exec backend python -c "from app.database import engine, Base; Base.metadata.create_all(bind=engine)"
```

---

## 📞 Suporte

- **Issues**: https://github.com/seu-usuario/estetica-sales-system/issues
- **Email**: suporte@crmtigre.com
- **Docs**: https://docs.crmtigre.com

---

**Última atualização**: 14 de janeiro de 2026
**Versão**: 2.0.0
