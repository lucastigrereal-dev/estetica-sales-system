#!/usr/bin/env python3
"""
Script para preparar campanha de WhatsApp a partir de leads

Uso:
    python prepare_campaign.py --input exports/leads_20240115.xlsx --lote 50
"""
import argparse
import logging
import re
from pathlib import Path
from typing import List, Dict, Set

import pandas as pd

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


def validar_telefone_brasileiro(telefone: str) -> bool:
    """
    Valida se o telefone é brasileiro válido

    Args:
        telefone: Telefone limpo (apenas números)

    Returns:
        True se válido
    """
    if not telefone:
        return False

    # Remover código do país (55) se presente
    if telefone.startswith('55'):
        telefone = telefone[2:]

    # Telefone brasileiro deve ter 10 ou 11 dígitos (DDD + número)
    if len(telefone) not in [10, 11]:
        return False

    # DDD deve estar entre 11 e 99
    ddd = int(telefone[:2])
    if ddd < 11 or ddd > 99:
        return False

    # Primeiro dígito do número deve ser 2-9
    primeiro_digito = int(telefone[2])
    if primeiro_digito < 2:
        return False

    return True


def formatar_telefone_whatsapp(telefone: str) -> str:
    """
    Formata telefone para WhatsApp (com código do país)

    Args:
        telefone: Telefone limpo

    Returns:
        Telefone formatado para WhatsApp (55XXXXXXXXXXX)
    """
    # Remover código do país se já existir
    if telefone.startswith('55'):
        telefone = telefone[2:]

    # Adicionar código do país
    return f"55{telefone}"


def preparar_campanha(input_file: str, tamanho_lote: int):
    """
    Prepara campanha dividindo leads em lotes

    Args:
        input_file: Arquivo Excel de entrada
        tamanho_lote: Quantidade de leads por lote
    """
    logger.info("=" * 50)
    logger.info("PREPARAÇÃO DE CAMPANHA")
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

        logger.info(f"Total de registros no arquivo: {len(df)}")

        # Verificar colunas necessárias
        required_columns = ['nome', 'telefone']
        missing_columns = [col for col in required_columns if col not in df.columns]

        if missing_columns:
            logger.error(f"Colunas obrigatórias ausentes: {missing_columns}")
            logger.info(f"Colunas disponíveis: {list(df.columns)}")
            return

        # Processar telefones
        logger.info("\nProcessando telefones...")
        df['telefone_limpo'] = df['telefone'].apply(limpar_telefone)
        df['telefone_valido'] = df['telefone_limpo'].apply(validar_telefone_brasileiro)

        # Filtrar apenas válidos
        df_validos = df[df['telefone_valido']].copy()
        logger.info(f"Telefones válidos: {len(df_validos)}")
        logger.info(f"Telefones inválidos: {len(df) - len(df_validos)}")

        if df_validos.empty:
            logger.warning("Nenhum telefone válido encontrado!")
            return

        # Formatar para WhatsApp
        df_validos['whatsapp'] = df_validos['telefone_limpo'].apply(formatar_telefone_whatsapp)

        # Remover duplicados
        logger.info("\nRemovendo duplicados...")
        antes = len(df_validos)
        df_validos = df_validos.drop_duplicates(subset=['whatsapp'])
        depois = len(df_validos)
        duplicados_removidos = antes - depois

        logger.info(f"Duplicados removidos: {duplicados_removidos}")
        logger.info(f"Registros únicos: {depois}")

        # Selecionar colunas para exportação
        colunas_exportar = ['nome', 'whatsapp']

        # Adicionar colunas opcionais se existirem
        if 'email' in df_validos.columns:
            colunas_exportar.append('email')
        if 'tags' in df_validos.columns:
            colunas_exportar.append('tags')

        df_export = df_validos[colunas_exportar].copy()

        # Dividir em lotes
        logger.info(f"\nDividindo em lotes de {tamanho_lote}...")
        total_lotes = (len(df_export) + tamanho_lote - 1) // tamanho_lote

        # Criar pasta exports se não existir
        exports_dir = input_path.parent
        exports_dir.mkdir(exist_ok=True)

        # Salvar lotes
        for i in range(total_lotes):
            inicio = i * tamanho_lote
            fim = min((i + 1) * tamanho_lote, len(df_export))

            lote = df_export.iloc[inicio:fim]
            numero_lote = f"{i + 1:02d}"

            filename = f"lote_{numero_lote}.xlsx"
            filepath = exports_dir / filename

            lote.to_excel(filepath, index=False, sheet_name='Lote')

            logger.info(f"Lote {numero_lote}: {len(lote)} registros -> {filepath}")

        # Gerar resumo
        logger.info(f"\n{'=' * 50}")
        logger.info("RESUMO DA PREPARAÇÃO")
        logger.info(f"{'=' * 50}")
        logger.info(f"Registros no arquivo original: {len(df)}")
        logger.info(f"Telefones válidos: {len(df_validos)}")
        logger.info(f"Telefones inválidos: {len(df) - len(df_validos)}")
        logger.info(f"Duplicados removidos: {duplicados_removidos}")
        logger.info(f"Total final: {len(df_export)}")
        logger.info(f"Total de lotes: {total_lotes}")
        logger.info(f"Tamanho do lote: {tamanho_lote}")
        logger.info(f"{'=' * 50}\n")

        # Mostrar alguns telefones inválidos para debug
        if len(df) - len(df_validos) > 0:
            logger.info("\nExemplos de telefones inválidos:")
            df_invalidos = df[~df['telefone_valido']]
            for idx, row in df_invalidos.head(5).iterrows():
                logger.info(f"  - {row['nome']}: {row['telefone']} -> {row['telefone_limpo']}")

    except Exception as e:
        logger.error(f"\nErro ao preparar campanha: {str(e)}")
        raise


def main():
    """Função principal"""
    parser = argparse.ArgumentParser(
        description='Prepara campanha de WhatsApp dividindo em lotes'
    )

    parser.add_argument(
        '--input',
        type=str,
        required=True,
        help='Arquivo Excel de entrada com os leads'
    )

    parser.add_argument(
        '--lote',
        type=int,
        default=50,
        help='Quantidade de leads por lote (default: 50)'
    )

    args = parser.parse_args()

    preparar_campanha(args.input, args.lote)


if __name__ == '__main__':
    main()
