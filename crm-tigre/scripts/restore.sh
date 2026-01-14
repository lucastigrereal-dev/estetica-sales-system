#!/bin/bash
set -e

# ================================================
# CRM TIGRE - Script de Restore
# ================================================

echo "♻️  Iniciando restauração do CRM Tigre..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configurações
BACKUP_DIR="./backups"

# Carregar variáveis do .env
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo -e "${RED}❌ Arquivo .env não encontrado!${NC}"
    exit 1
fi

# Função para confirmar ação
confirm() {
    read -p "$1 (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Operação cancelada."
        exit 1
    fi
}

# Verificar se backup foi especificado
BACKUP_NAME=$1

if [ -z "$BACKUP_NAME" ]; then
    echo "📋 Backups disponíveis:"
    echo ""
    ls -lht "${BACKUP_DIR}"/crm_tigre_backup_*_metadata.txt 2>/dev/null | head -10 || echo "Nenhum backup encontrado"
    echo ""
    echo "Uso: $0 [BACKUP_NAME]"
    echo "Exemplo: $0 crm_tigre_backup_20240115_143022"
    echo ""
    echo "Ou deixe vazio para restaurar o backup mais recente:"
    read -p "Pressione ENTER para restaurar o mais recente ou Ctrl+C para cancelar..."

    # Pegar backup mais recente
    BACKUP_NAME=$(ls -t "${BACKUP_DIR}"/crm_tigre_backup_*.dump 2>/dev/null | head -1 | xargs basename | sed 's/\.dump$//')

    if [ -z "$BACKUP_NAME" ]; then
        echo -e "${RED}❌ Nenhum backup encontrado!${NC}"
        exit 1
    fi
fi

# Verificar se arquivos de backup existem
BACKUP_DB="${BACKUP_DIR}/${BACKUP_NAME}.dump"
BACKUP_UPLOADS="${BACKUP_DIR}/${BACKUP_NAME}_uploads.tar.gz"
BACKUP_REDIS="${BACKUP_DIR}/${BACKUP_NAME}_redis.rdb"

if [ ! -f "$BACKUP_DB" ]; then
    echo -e "${RED}❌ Backup não encontrado: ${BACKUP_DB}${NC}"
    exit 1
fi

echo -e "${YELLOW}Backup selecionado: ${BACKUP_NAME}${NC}"
echo ""

# Mostrar metadados se existirem
if [ -f "${BACKUP_DIR}/${BACKUP_NAME}_metadata.txt" ]; then
    cat "${BACKUP_DIR}/${BACKUP_NAME}_metadata.txt"
    echo ""
fi

confirm "⚠️  ATENÇÃO: Isso irá SUBSTITUIR todos os dados atuais! Continuar?"

echo "1️⃣  Parando backend para evitar conexões..."
docker-compose stop backend frontend || true

echo "2️⃣  Restaurando banco de dados PostgreSQL..."

# Copiar backup para o container
docker cp "${BACKUP_DB}" crm-tigre-postgres:/tmp/restore.dump

# Dropar conexões ativas
docker exec crm-tigre-postgres psql \
    -U ${POSTGRES_USER:-crm_tigre} \
    -d postgres \
    -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${POSTGRES_DB:-crm_tigre}' AND pid <> pg_backend_pid();" || true

# Dropar e recriar banco
docker exec crm-tigre-postgres psql \
    -U ${POSTGRES_USER:-crm_tigre} \
    -d postgres \
    -c "DROP DATABASE IF EXISTS ${POSTGRES_DB:-crm_tigre};"

docker exec crm-tigre-postgres psql \
    -U ${POSTGRES_USER:-crm_tigre} \
    -d postgres \
    -c "CREATE DATABASE ${POSTGRES_DB:-crm_tigre};"

# Restaurar backup
docker exec crm-tigre-postgres pg_restore \
    -U ${POSTGRES_USER:-crm_tigre} \
    -d ${POSTGRES_DB:-crm_tigre} \
    --verbose \
    --no-owner \
    --no-privileges \
    /tmp/restore.dump || echo "Alguns avisos são normais durante restore"

# Remover arquivo temporário
docker exec crm-tigre-postgres rm /tmp/restore.dump

echo -e "${GREEN}✅ Banco de dados restaurado!${NC}"

# Restaurar uploads
if [ -f "$BACKUP_UPLOADS" ]; then
    echo "3️⃣  Restaurando uploads..."

    docker run --rm \
        --volumes-from crm-tigre-backend \
        -v "$(pwd)/${BACKUP_DIR}:/backup" \
        alpine \
        sh -c "rm -rf /app/public/uploads/* && tar xzf /backup/${BACKUP_NAME}_uploads.tar.gz -C /"

    echo -e "${GREEN}✅ Uploads restaurados!${NC}"
else
    echo -e "${YELLOW}⚠️  Backup de uploads não encontrado, pulando...${NC}"
fi

# Restaurar Redis
if [ -f "$BACKUP_REDIS" ]; then
    echo "4️⃣  Restaurando Redis..."

    docker-compose stop redis
    docker cp "${BACKUP_REDIS}" crm-tigre-redis:/data/dump.rdb
    docker-compose start redis

    echo -e "${GREEN}✅ Redis restaurado!${NC}"
else
    echo -e "${YELLOW}⚠️  Backup de Redis não encontrado, pulando...${NC}"
fi

echo "5️⃣  Reiniciando todos os serviços..."
docker-compose up -d

echo "6️⃣  Aguardando serviços iniciarem (30s)..."
sleep 30

# Verificar health
echo "7️⃣  Verificando health..."
curl -f http://localhost:4000/health || echo "⚠️  Backend ainda não respondeu"

echo ""
echo -e "${GREEN}✅ Restauração concluída com sucesso!${NC}"
echo ""
echo "📊 Status dos containers:"
docker-compose ps
echo ""
echo "💡 Dica: Verifique os logs se algo não estiver funcionando:"
echo "   docker-compose logs -f backend"
echo ""
