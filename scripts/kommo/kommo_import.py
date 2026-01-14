#!/usr/bin/env python3
"""
Script para importar respostas de volta para a Kommo (adicionar tags)

Uso:
    python kommo_import.py --input responses/responderam.xlsx --tag Respondeu_WaSender
"""
import argparse
import logging
import sys
import re
from pathlib import Path
from typing import List, Dict

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


def limpar_telefone(telefone: str) -> str:
    """
    Limpa e padroniza número de telefone

    Args:
        telefone: Número de telefone bruto

    Returns:
        Telefone limpo (apenas números)
    """
    if pd.isna(telefone):
        return ''

    # Converter para string
    telefone = str(telefone)

    # Remover caracteres não numéricos
    telefone_limpo = re.sub(r'\D', '', telefone)

    return telefone_limpo


def importar_respostas(input_file: str, tag_name: str):
    """
    Importa respostas para Kommo adicionando tags aos leads

    Args:
        input_file: Arquivo Excel com telefones que responderam
        tag_name: Nome da tag para adicionar
    """
    logger.info("=" * 50)
    logger.info("IMPORTAÇÃO DE RESPOSTAS PARA KOMMO")
    logger.info("=" * 50)

    try:
        # Verificar se arquivo existe
        input_path = Path(input_file)
        if not input_path.exists():
            logger.error(f"Arquivo não encontrado: {input_file}")
            return

        # Ler Excel
        logger.info(f"\nLendo arquivo: {input_file}")
        df = pd.read_excel(input_file)

        logger.info(f"Total de registros: {len(df)}")

        # Verificar colunas
        colunas_telefone = ['telefone', 'phone', 'whatsapp', 'numero']
        coluna_tel = None

        for col in df.columns:
            if col.lower() in colunas_telefone:
                coluna_tel = col
                break

        if not coluna_tel:
            logger.error(f"Nenhuma coluna de telefone encontrada!")
            logger.info(f"Colunas disponíveis: {list(df.columns)}")
            return

        logger.info(f"Usando coluna de telefone: {coluna_tel}")

        # Inicializar cliente Kommo
        logger.info("\nConectando à Kommo...")
        client = KommoClient()

        # Estatísticas
        stats = {
            'total': len(df),
            'processados': 0,
            'encontrados': 0,
            'tag_adicionada': 0,
            'tag_existente': 0,
            'nao_encontrados': 0,
            'erros': 0
        }

        # Processar cada telefone
        logger.info(f"\nProcessando {len(df)} telefones...")
        logger.info(f"Tag a adicionar: '{tag_name}'\n")

        for idx, row in df.iterrows():
            telefone = limpar_telefone(row[coluna_tel])
            stats['processados'] += 1

            if not telefone:
                logger.warning(f"[{stats['processados']}/{stats['total']}] Telefone vazio, pulando...")
                stats['erros'] += 1
                continue

            logger.info(f"[{stats['processados']}/{stats['total']}] Processando: {telefone}")

            try:
                # Buscar lead por telefone
                lead = client.get_lead_by_phone(telefone)

                if not lead:
                    logger.warning(f"  Lead não encontrado na Kommo")
                    stats['nao_encontrados'] += 1
                    continue

                stats['encontrados'] += 1
                lead_id = lead['id']
                lead_name = lead.get('name', 'Sem nome')

                logger.info(f"  Lead encontrado: {lead_name} (ID: {lead_id})")

                # Verificar se tag já existe
                tags = lead.get('_embedded', {}).get('tags', [])
                tag_exists = any(tag['name'] == tag_name for tag in tags)

                if tag_exists:
                    logger.info(f"  Tag '{tag_name}' já existe no lead")
                    stats['tag_existente'] += 1
                    continue

                # Adicionar tag
                success = client.add_tag_to_lead(lead_id, tag_name)

                if success:
                    logger.info(f"  Tag '{tag_name}' adicionada com sucesso!")
                    stats['tag_adicionada'] += 1
                else:
                    logger.error(f"  Falha ao adicionar tag")
                    stats['erros'] += 1

            except Exception as e:
                logger.error(f"  Erro ao processar: {str(e)}")
                stats['erros'] += 1

            # Pequeno delay para não sobrecarregar a API
            import time
            time.sleep(0.5)

        # Gerar relatório final
        logger.info(f"\n{'=' * 50}")
        logger.info("RELATÓRIO FINAL")
        logger.info(f"{'=' * 50}")
        logger.info(f"Total de registros: {stats['total']}")
        logger.info(f"Processados: {stats['processados']}")
        logger.info(f"Leads encontrados: {stats['encontrados']}")
        logger.info(f"Tags adicionadas: {stats['tag_adicionada']}")
        logger.info(f"Tags já existentes: {stats['tag_existente']}")
        logger.info(f"Leads não encontrados: {stats['nao_encontrados']}")
        logger.info(f"Erros: {stats['erros']}")
        logger.info(f"{'=' * 50}\n")

        # Salvar log detalhado
        log_file = input_path.parent / f"import_log_{input_path.stem}.txt"
        with open(log_file, 'w', encoding='utf-8') as f:
            f.write(f"Importação realizada em: {pd.Timestamp.now()}\n")
            f.write(f"Arquivo de entrada: {input_file}\n")
            f.write(f"Tag adicionada: {tag_name}\n\n")
            f.write(f"ESTATÍSTICAS:\n")
            for key, value in stats.items():
                f.write(f"{key}: {value}\n")

        logger.info(f"Log detalhado salvo em: {log_file}")

    except Exception as e:
        logger.error(f"\nErro ao importar respostas: {str(e)}")
        raise


def main():
    """Função principal"""
    parser = argparse.ArgumentParser(
        description='Importa respostas para Kommo adicionando tags aos leads'
    )

    parser.add_argument(
        '--input',
        type=str,
        required=True,
        help='Arquivo Excel com telefones que responderam'
    )

    parser.add_argument(
        '--tag',
        type=str,
        default='Respondeu_WaSender',
        help='Nome da tag para adicionar (default: Respondeu_WaSender)'
    )

    args = parser.parse_args()

    importar_respostas(args.input, args.tag)


if __name__ == '__main__':
    main()
