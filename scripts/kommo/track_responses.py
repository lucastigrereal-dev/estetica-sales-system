#!/usr/bin/env python3
"""
Script para rastrear respostas de campanhas de WhatsApp

Uso:
    python track_responses.py --input responses/lote_01_respostas.csv
    python track_responses.py --watch  # Monitora continuamente
"""
import argparse
import logging
import time
import re
from pathlib import Path
from typing import Set, List, Dict
from datetime import datetime

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

    # Remover código do país se presente
    if telefone_limpo.startswith('55'):
        telefone_limpo = telefone_limpo[2:]

    return telefone_limpo


def detectar_formato_arquivo(df: pd.DataFrame) -> str:
    """
    Detecta o formato do arquivo de respostas

    Args:
        df: DataFrame carregado

    Returns:
        Tipo de formato detectado
    """
    colunas = [col.lower() for col in df.columns]

    # WaSender típico
    if 'telefone' in colunas or 'phone' in colunas or 'numero' in colunas:
        return 'wasender'

    # Evolution API típico
    if 'remoteJid' in df.columns or 'from' in df.columns:
        return 'evolution'

    # N8N típico
    if 'data' in df.columns or 'body' in df.columns:
        return 'n8n'

    return 'desconhecido'


def extrair_telefones_wasender(df: pd.DataFrame) -> Set[str]:
    """
    Extrai telefones de formato WaSender

    Args:
        df: DataFrame do arquivo

    Returns:
        Set de telefones
    """
    telefones = set()

    # Tentar colunas comuns
    colunas_telefone = ['telefone', 'phone', 'numero', 'number', 'whatsapp']

    for col in df.columns:
        if col.lower() in colunas_telefone:
            for tel in df[col].dropna():
                tel_limpo = limpar_telefone(tel)
                if tel_limpo:
                    telefones.add(tel_limpo)
            break

    return telefones


def extrair_telefones_evolution(df: pd.DataFrame) -> Set[str]:
    """
    Extrai telefones de formato Evolution API

    Args:
        df: DataFrame do arquivo

    Returns:
        Set de telefones
    """
    telefones = set()

    # Evolution API usa remoteJid ou from
    if 'remoteJid' in df.columns:
        for jid in df['remoteJid'].dropna():
            # Formato: 5511999999999@s.whatsapp.net
            tel = str(jid).split('@')[0]
            tel_limpo = limpar_telefone(tel)
            if tel_limpo:
                telefones.add(tel_limpo)

    elif 'from' in df.columns:
        for from_field in df['from'].dropna():
            tel = str(from_field).split('@')[0]
            tel_limpo = limpar_telefone(tel)
            if tel_limpo:
                telefones.add(tel_limpo)

    return telefones


def extrair_telefones_n8n(df: pd.DataFrame) -> Set[str]:
    """
    Extrai telefones de formato N8N

    Args:
        df: DataFrame do arquivo

    Returns:
        Set de telefones
    """
    telefones = set()

    # N8N pode ter estruturas variadas
    for col in df.columns:
        if 'phone' in col.lower() or 'telefone' in col.lower() or 'numero' in col.lower():
            for tel in df[col].dropna():
                tel_limpo = limpar_telefone(tel)
                if tel_limpo:
                    telefones.add(tel_limpo)

    return telefones


def processar_arquivo(filepath: Path) -> Set[str]:
    """
    Processa um arquivo e extrai telefones que responderam

    Args:
        filepath: Caminho do arquivo

    Returns:
        Set de telefones
    """
    logger.info(f"Processando arquivo: {filepath.name}")

    try:
        # Detectar extensão
        if filepath.suffix == '.csv':
            df = pd.read_csv(filepath)
        elif filepath.suffix in ['.xlsx', '.xls']:
            df = pd.read_excel(filepath)
        else:
            logger.warning(f"Formato não suportado: {filepath.suffix}")
            return set()

        if df.empty:
            logger.warning(f"Arquivo vazio: {filepath.name}")
            return set()

        # Detectar formato
        formato = detectar_formato_arquivo(df)
        logger.info(f"Formato detectado: {formato}")

        # Extrair telefones baseado no formato
        if formato == 'wasender':
            telefones = extrair_telefones_wasender(df)
        elif formato == 'evolution':
            telefones = extrair_telefones_evolution(df)
        elif formato == 'n8n':
            telefones = extrair_telefones_n8n(df)
        else:
            # Tentar extrair de qualquer coluna que pareça telefone
            telefones = extrair_telefones_wasender(df)

        logger.info(f"Encontrados {len(telefones)} telefones em {filepath.name}")
        return telefones

    except Exception as e:
        logger.error(f"Erro ao processar {filepath.name}: {str(e)}")
        return set()


def monitorar_responses(responses_dir: Path, output_file: Path):
    """
    Monitora pasta de respostas continuamente

    Args:
        responses_dir: Pasta com arquivos de resposta
        output_file: Arquivo de saída
    """
    logger.info("=" * 50)
    logger.info("MONITORAMENTO DE RESPOSTAS (CONTÍNUO)")
    logger.info("=" * 50)
    logger.info(f"Pasta monitorada: {responses_dir}")
    logger.info(f"Arquivo de saída: {output_file}")
    logger.info("Pressione Ctrl+C para parar\n")

    arquivos_processados = set()
    todos_telefones = set()

    try:
        while True:
            # Buscar novos arquivos
            arquivos = list(responses_dir.glob('*.csv')) + list(responses_dir.glob('*.xlsx'))

            novos_arquivos = [f for f in arquivos if f not in arquivos_processados]

            if novos_arquivos:
                logger.info(f"\n{len(novos_arquivos)} novo(s) arquivo(s) detectado(s)!")

                for arquivo in novos_arquivos:
                    telefones = processar_arquivo(arquivo)
                    todos_telefones.update(telefones)
                    arquivos_processados.add(arquivo)

                # Salvar arquivo atualizado
                salvar_telefones(todos_telefones, output_file)

            # Aguardar 30 segundos antes de verificar novamente
            time.sleep(30)

    except KeyboardInterrupt:
        logger.info("\n\nMonitoramento interrompido pelo usuário")
        salvar_telefones(todos_telefones, output_file)


def processar_arquivo_unico(input_file: Path, output_file: Path):
    """
    Processa um único arquivo de respostas

    Args:
        input_file: Arquivo de entrada
        output_file: Arquivo de saída
    """
    logger.info("=" * 50)
    logger.info("PROCESSAMENTO DE RESPOSTAS")
    logger.info("=" * 50)

    if not input_file.exists():
        logger.error(f"Arquivo não encontrado: {input_file}")
        return

    telefones = processar_arquivo(input_file)

    if telefones:
        salvar_telefones(telefones, output_file)
    else:
        logger.warning("Nenhum telefone encontrado!")


def salvar_telefones(telefones: Set[str], output_file: Path):
    """
    Salva telefones que responderam em Excel

    Args:
        telefones: Set de telefones
        output_file: Arquivo de saída
    """
    if not telefones:
        logger.warning("Nenhum telefone para salvar")
        return

    # Criar DataFrame
    df = pd.DataFrame({
        'telefone': sorted(list(telefones)),
        'whatsapp': ['55' + tel for tel in sorted(list(telefones))],
        'data_resposta': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    })

    # Salvar Excel
    output_file.parent.mkdir(exist_ok=True)
    df.to_excel(output_file, index=False, sheet_name='Responderam')

    logger.info(f"\n{'=' * 50}")
    logger.info("ARQUIVO ATUALIZADO")
    logger.info(f"{'=' * 50}")
    logger.info(f"Total de telefones: {len(telefones)}")
    logger.info(f"Arquivo: {output_file}")
    logger.info(f"{'=' * 50}\n")


def main():
    """Função principal"""
    parser = argparse.ArgumentParser(
        description='Rastreia respostas de campanhas de WhatsApp'
    )

    parser.add_argument(
        '--watch',
        action='store_true',
        help='Monitorar pasta responses/ continuamente'
    )

    parser.add_argument(
        '--input',
        type=str,
        help='Arquivo específico para processar'
    )

    args = parser.parse_args()

    # Determinar pasta base
    base_dir = Path(__file__).parent.parent.parent
    responses_dir = base_dir / 'responses'
    output_file = responses_dir / 'responderam.xlsx'

    # Criar pasta se não existir
    responses_dir.mkdir(exist_ok=True)

    if args.watch:
        # Modo monitoramento contínuo
        monitorar_responses(responses_dir, output_file)
    elif args.input:
        # Processar arquivo específico
        input_file = Path(args.input)
        processar_arquivo_unico(input_file, output_file)
    else:
        # Processar todos os arquivos na pasta responses
        logger.info("Processando todos os arquivos em responses/...")
        todos_telefones = set()

        arquivos = list(responses_dir.glob('*.csv')) + list(responses_dir.glob('*.xlsx'))
        arquivos = [f for f in arquivos if f.name != 'responderam.xlsx']

        if not arquivos:
            logger.warning(f"Nenhum arquivo encontrado em {responses_dir}")
            return

        for arquivo in arquivos:
            telefones = processar_arquivo(arquivo)
            todos_telefones.update(telefones)

        salvar_telefones(todos_telefones, output_file)


if __name__ == '__main__':
    main()
