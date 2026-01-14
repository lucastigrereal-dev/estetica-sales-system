#!/bin/bash
set -e

# ================================================
# CRM TIGRE - Script de Deploy Automatizado
# ================================================

echo "🚀 Iniciando deploy do CRM Tigre..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se está na pasta correta
if [ ! -f "docker-compose.yml" ]; then
    echo -e "${RED}❌ Erro: docker-compose.yml não encontrado!${NC}"
    echo "Execute este script na pasta raiz do projeto."
    exit 1
fi

# Verificar se .env existe
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Arquivo .env não encontrado!${NC}"
    echo "Copiando .env.example para .env..."
    cp .env.example .env
    echo -e "${YELLOW}⚠️  IMPORTANTE: Edite o arquivo .env com suas credenciais antes de continuar!${NC}"
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

# Verificar modo de deploy
DEPLOY_MODE=${1:-update}

case $DEPLOY_MODE in
    first)
        echo -e "${YELLOW}📦 Modo: PRIMEIRO DEPLOY${NC}"
        confirm "Este é o primeiro deploy. Isso irá criar todo o sistema do zero. Continuar?"

        echo "1️⃣  Parando containers antigos (se existirem)..."
        docker-compose down -v || true

        echo "2️⃣  Construindo imagens Docker..."
        docker-compose build --no-cache

        echo "3️⃣  Subindo banco de dados e Redis..."
        docker-compose up -d postgres redis

        echo "4️⃣  Aguardando banco de dados inicializar (30s)..."
        sleep 30

        echo "5️⃣  Rodando migrations..."
        docker-compose run --rm backend npm run db:migrate

        echo "6️⃣  Rodando seeds (dados iniciais)..."
        docker-compose run --rm backend npm run db:seed || echo "Sem seeds configurados"

        echo "7️⃣  Subindo todos os serviços..."
        docker-compose up -d

        echo -e "${GREEN}✅ Primeiro deploy concluído!${NC}"
        ;;

    update)
        echo -e "${YELLOW}🔄 Modo: ATUALIZAÇÃO${NC}"
        confirm "Isso irá atualizar o sistema. Haverá alguns segundos de downtime. Continuar?"

        echo "1️⃣  Criando backup antes da atualização..."
        ./scripts/backup.sh || echo "Aviso: Backup falhou, mas continuando..."

        echo "2️⃣  Baixando última versão do código..."
        git pull origin main || echo "Aviso: Git pull falhou ou não configurado"

        echo "3️⃣  Construindo novas imagens..."
        docker-compose build

        echo "4️⃣  Parando containers antigos..."
        docker-compose down

        echo "5️⃣  Rodando migrations..."
        docker-compose run --rm backend npm run db:migrate

        echo "6️⃣  Subindo novos containers..."
        docker-compose up -d

        echo -e "${GREEN}✅ Atualização concluída!${NC}"
        ;;

    rollback)
        echo -e "${RED}⏮️  Modo: ROLLBACK${NC}"
        confirm "Isso irá restaurar o backup mais recente. Continuar?"

        echo "1️⃣  Parando containers..."
        docker-compose down

        echo "2️⃣  Restaurando backup..."
        ./scripts/restore.sh

        echo "3️⃣  Subindo containers..."
        docker-compose up -d

        echo -e "${GREEN}✅ Rollback concluído!${NC}"
        ;;

    restart)
        echo -e "${YELLOW}🔄 Modo: RESTART${NC}"

        echo "1️⃣  Reiniciando containers..."
        docker-compose restart

        echo -e "${GREEN}✅ Containers reiniciados!${NC}"
        ;;

    *)
        echo "Uso: $0 {first|update|rollback|restart}"
        echo ""
        echo "Modos:"
        echo "  first     - Primeiro deploy (cria tudo do zero)"
        echo "  update    - Atualizar sistema (default)"
        echo "  rollback  - Restaurar backup mais recente"
        echo "  restart   - Apenas reiniciar containers"
        exit 1
        ;;
esac

# Mostrar status
echo ""
echo "📊 Status dos containers:"
docker-compose ps

# Mostrar logs
echo ""
echo "📝 Últimas 20 linhas de log:"
docker-compose logs --tail=20

# Verificar health
echo ""
echo "🏥 Health check:"
sleep 5
curl -f http://localhost:4000/health || echo "⚠️  Backend não respondeu no health check"

echo ""
echo -e "${GREEN}🎉 Deploy finalizado!${NC}"
echo ""
echo "URLs:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:4000"
echo "  API Docs: http://localhost:4000/api-docs"
echo ""
echo "Comandos úteis:"
echo "  docker-compose logs -f          # Ver logs em tempo real"
echo "  docker-compose ps               # Status dos containers"
echo "  docker-compose down             # Parar tudo"
echo "  ./scripts/backup.sh             # Criar backup"
echo ""
