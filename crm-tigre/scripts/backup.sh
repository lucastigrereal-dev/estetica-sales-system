#!/bin/bash
set -e

# ================================================
# CRM TIGRE - Script de Backup
# ================================================

echo "💾 Iniciando backup do CRM Tigre..."

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configurações
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="crm_tigre_backup_${TIMESTAMP}"

# Carregar variáveis do .env
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "⚠️  Arquivo .env não encontrado, usando valores padrão"
    POSTGRES_USER="crm_tigre"
    POSTGRES_DB="crm_tigre"
fi

# Criar diretório de backup
mkdir -p "${BACKUP_DIR}"

echo "1️⃣  Criando backup do banco de dados PostgreSQL..."

# Backup do banco usando docker exec
docker exec crm-tigre-postgres pg_dump \
    -U ${POSTGRES_USER:-crm_tigre} \
    -d ${POSTGRES_DB:-crm_tigre} \
    --format=custom \
    --compress=9 \
    --file="/tmp/${BACKUP_NAME}.dump"

# Copiar backup do container para o host
docker cp crm-tigre-postgres:/tmp/${BACKUP_NAME}.dump "${BACKUP_DIR}/${BACKUP_NAME}.dump"

# Remover backup temporário do container
docker exec crm-tigre-postgres rm /tmp/${BACKUP_NAME}.dump

echo "2️⃣  Criando backup dos uploads..."

# Backup do volume de uploads
docker run --rm \
    --volumes-from crm-tigre-backend \
    -v "$(pwd)/${BACKUP_DIR}:/backup" \
    alpine \
    tar czf "/backup/${BACKUP_NAME}_uploads.tar.gz" /app/public/uploads 2>/dev/null || true

echo "3️⃣  Criando backup do Redis (opcional)..."

# Backup do Redis (save RDB)
docker exec crm-tigre-redis redis-cli --pass ${REDIS_PASSWORD:-changeme} BGSAVE || true
sleep 2
docker cp crm-tigre-redis:/data/dump.rdb "${BACKUP_DIR}/${BACKUP_NAME}_redis.rdb" || true

echo "4️⃣  Criando arquivo de metadados..."

# Criar arquivo de metadados
cat > "${BACKUP_DIR}/${BACKUP_NAME}_metadata.txt" << EOF
CRM TIGRE - Backup Metadata
===========================
Data: $(date)
Timestamp: ${TIMESTAMP}
Database: ${POSTGRES_DB:-crm_tigre}
User: ${POSTGRES_USER:-crm_tigre}

Arquivos incluídos:
- ${BACKUP_NAME}.dump (PostgreSQL)
- ${BACKUP_NAME}_uploads.tar.gz (Uploads)
- ${BACKUP_NAME}_redis.rdb (Redis - opcional)

Para restaurar:
./scripts/restore.sh ${BACKUP_NAME}
EOF

echo "5️⃣  Calculando tamanhos..."

DB_SIZE=$(du -h "${BACKUP_DIR}/${BACKUP_NAME}.dump" | cut -f1)
UPLOADS_SIZE=$(du -h "${BACKUP_DIR}/${BACKUP_NAME}_uploads.tar.gz" 2>/dev/null | cut -f1 || echo "0")

echo ""
echo -e "${GREEN}✅ Backup concluído com sucesso!${NC}"
echo ""
echo "📦 Arquivos criados:"
echo "  - Banco de dados: ${BACKUP_NAME}.dump (${DB_SIZE})"
echo "  - Uploads:        ${BACKUP_NAME}_uploads.tar.gz (${UPLOADS_SIZE})"
echo "  - Metadados:      ${BACKUP_NAME}_metadata.txt"
echo ""
echo "📁 Local: ${BACKUP_DIR}/"
echo ""

# Limpar backups antigos (manter últimos 7)
echo "6️⃣  Limpando backups antigos (mantendo últimos 7)..."

cd "${BACKUP_DIR}"
ls -t crm_tigre_backup_*.dump 2>/dev/null | tail -n +8 | xargs -r rm -f
ls -t crm_tigre_backup_*_uploads.tar.gz 2>/dev/null | tail -n +8 | xargs -r rm -f
ls -t crm_tigre_backup_*_redis.rdb 2>/dev/null | tail -n +8 | xargs -r rm -f
ls -t crm_tigre_backup_*_metadata.txt 2>/dev/null | tail -n +8 | xargs -r rm -f
cd - > /dev/null

echo -e "${GREEN}✅ Limpeza concluída!${NC}"
echo ""
echo "💡 Dica: Configure backup automático no crontab:"
echo "   0 2 * * * cd /path/to/crm-tigre && ./scripts/backup.sh >> /var/log/crm-backup.log 2>&1"
echo ""
