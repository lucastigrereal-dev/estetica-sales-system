#!/usr/bin/env python3
"""
Script para exportar leads da Kommo para Excel

Uso:
    python kommo_export.py --status sem_resposta --limit 500
"""
import argparse
import logging
import sys
import re
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Any

import pandas as pd

# Adicionar path do projeto
sys.path.append(str(Path(__file__).parent.parent.parent))

from scripts.kommo.config import KommoClient

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def validar_telefone(telefone: str) -> bool:
    """
    Valida se o telefone é válido (contém números)

    Args:
        telefone: Número de telefone

    Returns:
        True se válido
    """
    if not telefone:
        return False

    # Remove caracteres não numéricos
    numeros = re.sub(r'\D', '', telefone)

    # Verifica se tem pelo menos 10 dígitos (DDD + número)
    return len(numeros) >= 10


def extrair_telefone_lead(lead: Dict[str, Any]) -> str:
    """
    Extrai o primeiro telefone válido do lead

    Args:
        lead: Dados do lead

    Returns:
        Telefone ou string vazia
    """
    # Buscar nos custom fields
    custom_fields = lead.get('custom_fields_values', [])

    for field in custom_fields:
        # Campo de telefone geralmente tem field_code 'PHONE'
        if field.get('field_code') == 'PHONE':
            values = field.get('values', [])
            if values:
                telefone = values[0].get('value', '')
                if validar_telefone(telefone):
                    return telefone

    # Buscar nos contatos vinculados
    contacts = lead.get('_embedded', {}).get('contacts', [])
    for contact in contacts:
        custom_fields = contact.get('custom_fields_values', [])
        for field in custom_fields:
            if field.get('field_code') == 'PHONE':
                values = field.get('values', [])
                if values:
                    telefone = values[0].get('value', '')
                    if validar_telefone(telefone):
                        return telefone

    return ''


def extrair_email_lead(lead: Dict[str, Any]) -> str:
    """
    Extrai o primeiro email do lead

    Args:
        lead: Dados do lead

    Returns:
        Email ou string vazia
    """
    # Buscar nos custom fields
    custom_fields = lead.get('custom_fields_values', [])

    for field in custom_fields:
        if field.get('field_code') == 'EMAIL':
            values = field.get('values', [])
            if values:
                return values[0].get('value', '')

    # Buscar nos contatos vinculados
    contacts = lead.get('_embedded', {}).get('contacts', [])
    for contact in contacts:
        custom_fields = contact.get('custom_fields_values', [])
        for field in custom_fields:
            if field.get('field_code') == 'EMAIL':
                values = field.get('values', [])
                if values:
                    return values[0].get('value', '')

    return ''


def extrair_tags_lead(lead: Dict[str, Any]) -> str:
    """
    Extrai tags do lead

    Args:
        lead: Dados do lead

    Returns:
        Tags separadas por vírgula
    """
    tags = lead.get('_embedded', {}).get('tags', [])
    if tags:
        return ', '.join([tag['name'] for tag in tags])
    return ''


def processar_lead(lead: Dict[str, Any]) -> Dict[str, Any]:
    """
    Processa um lead e extrai informações relevantes

    Args:
        lead: Dados do lead da API

    Returns:
        Dicionário com dados processados
    """
    return {
        'id': lead.get('id', ''),
        'nome': lead.get('name', ''),
        'telefone': extrair_telefone_lead(lead),
        'email': extrair_email_lead(lead),
        'tags': extrair_tags_lead(lead),
        'data_criacao': datetime.fromtimestamp(lead.get('created_at', 0)).strftime('%Y-%m-%d %H:%M:%S') if lead.get('created_at') else ''
    }


def exportar_leads(status: str, limit: int):
    """
    Exporta leads da Kommo para Excel

    Args:
        status: Status dos leads para filtrar
        limit: Quantidade máxima de leads
    """
    logger.info("=" * 50)
    logger.info("EXPORTAÇÃO DE LEADS DA KOMMO")
    logger.info("=" * 50)

    try:
        # Inicializar cliente Kommo
        client = KommoClient()

        # Buscar status disponíveis
        logger.info("\nBuscando status do pipeline...")
        statuses = client.get_pipeline_statuses()

        # Encontrar status_id pelo nome
        status_id = None
        for sid, sname in statuses.items():
            if sname.lower() == status.lower() or status.lower() in sname.lower():
                status_id = sid
                logger.info(f"Status encontrado: {sname} (ID: {sid})")
                break

        if not status_id and status != 'todos':
            logger.warning(f"Status '{status}' não encontrado. Status disponíveis:")
            for sid, sname in statuses.items():
                logger.info(f"  - {sname} (ID: {sid})")
            logger.info("\nBuscando todos os leads...")

        # Buscar leads
        logger.info(f"\nBuscando até {limit} leads...")
        all_leads = []
        page = 1
        per_page = min(250, limit)  # Kommo permite máximo 250 por página

        while len(all_leads) < limit:
            leads = client.get_leads(
                status_id=status_id,
                limit=per_page,
                page=page
            )

            if not leads:
                break

            all_leads.extend(leads)
            logger.info(f"Página {page}: {len(leads)} leads ({len(all_leads)} total)")

            if len(leads) < per_page:
                break

            page += 1

        # Limitar ao número solicitado
        all_leads = all_leads[:limit]

        logger.info(f"\nTotal de leads obtidos: {len(all_leads)}")

        # Processar leads
        logger.info("\nProcessando leads...")
        leads_processados = []

        for lead in all_leads:
            lead_data = processar_lead(lead)

            # Filtrar apenas com telefone válido
            if lead_data['telefone']:
                leads_processados.append(lead_data)

        logger.info(f"Leads com telefone válido: {len(leads_processados)}")

        if not leads_processados:
            logger.warning("Nenhum lead com telefone válido encontrado!")
            return

        # Criar DataFrame
        df = pd.DataFrame(leads_processados)

        # Reordenar colunas
        df = df[['nome', 'telefone', 'email', 'tags', 'data_criacao', 'id']]

        # Criar pasta exports se não existir
        exports_dir = Path(__file__).parent.parent.parent / 'exports'
        exports_dir.mkdir(exist_ok=True)

        # Gerar nome do arquivo
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"leads_{timestamp}.xlsx"
        filepath = exports_dir / filename

        # Salvar Excel
        df.to_excel(filepath, index=False, sheet_name='Leads')

        logger.info(f"\n{'=' * 50}")
        logger.info("EXPORTAÇÃO CONCLUÍDA COM SUCESSO!")
        logger.info(f"{'=' * 50}")
        logger.info(f"Total de leads exportados: {len(leads_processados)}")
        logger.info(f"Arquivo salvo em: {filepath}")
        logger.info(f"{'=' * 50}\n")

    except Exception as e:
        logger.error(f"\nErro ao exportar leads: {str(e)}")
        raise


def main():
    """Função principal"""
    parser = argparse.ArgumentParser(
        description='Exporta leads da Kommo para Excel'
    )

    parser.add_argument(
        '--status',
        type=str,
        default='sem_resposta',
        help='Status dos leads para filtrar (default: sem_resposta)'
    )

    parser.add_argument(
        '--limit',
        type=int,
        default=500,
        help='Quantidade máxima de leads (default: 500)'
    )

    args = parser.parse_args()

    exportar_leads(args.status, args.limit)


if __name__ == '__main__':
    main()
