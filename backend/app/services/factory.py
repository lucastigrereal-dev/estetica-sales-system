"""
Factory para criação de Services de Pagamento

Carrega credenciais da clínica e instancia os services apropriados.
"""

from typing import Optional
from ..models import Clinica
from ..utils.encryption import encryption_service
from .gerencianet_service import GerencianetService
from .asaas_service import AsaasService
import os


def get_gerencianet_service(clinica: Clinica, sandbox: bool = False) -> GerencianetService:
    """
    Cria instância de GerencianetService para uma clínica.

    Args:
        clinica: Objeto Clinica com credenciais criptografadas
        sandbox: Se True, usa ambiente de homologação

    Returns:
        GerencianetService configurado

    Raises:
        ValueError: Se credenciais não estiverem configuradas
    """
    # Verificar se credenciais estão configuradas
    if not clinica.gerencianet_client_id_encrypted or not clinica.gerencianet_client_secret_encrypted:
        raise ValueError(
            f"Clínica {clinica.nome} não possui credenciais Gerencianet configuradas."
        )

    if not clinica.gerencianet_pix_cert_path:
        raise ValueError(
            f"Clínica {clinica.nome} não possui certificado Gerencianet configurado."
        )

    if not clinica.gerencianet_pix_key:
        raise ValueError(
            f"Clínica {clinica.nome} não possui chave PIX Gerencianet configurada."
        )

    # Descriptografar credenciais
    if encryption_service is None:
        raise ValueError("Encryption service não está configurado. Configure PAYMENT_ENCRYPTION_KEY.")

    try:
        client_id = encryption_service.decrypt(clinica.gerencianet_client_id_encrypted)
        client_secret = encryption_service.decrypt(clinica.gerencianet_client_secret_encrypted)
    except Exception as e:
        raise ValueError(f"Erro ao descriptografar credenciais Gerencianet: {str(e)}")

    # Verificar se certificado existe
    if not os.path.exists(clinica.gerencianet_pix_cert_path):
        raise ValueError(
            f"Certificado Gerencianet não encontrado: {clinica.gerencianet_pix_cert_path}"
        )

    return GerencianetService(
        client_id=client_id,
        client_secret=client_secret,
        cert_path=clinica.gerencianet_pix_cert_path,
        pix_key=clinica.gerencianet_pix_key,
        sandbox=sandbox
    )


def get_asaas_service(clinica: Clinica, sandbox: bool = False) -> AsaasService:
    """
    Cria instância de AsaasService para uma clínica.

    Args:
        clinica: Objeto Clinica com credenciais criptografadas
        sandbox: Se True, usa ambiente de homologação

    Returns:
        AsaasService configurado

    Raises:
        ValueError: Se credenciais não estiverem configuradas
    """
    # Verificar se credenciais estão configuradas
    if not clinica.asaas_token_encrypted:
        raise ValueError(
            f"Clínica {clinica.nome} não possui token Asaas configurado."
        )

    # Descriptografar token
    if encryption_service is None:
        raise ValueError("Encryption service não está configurado. Configure PAYMENT_ENCRYPTION_KEY.")

    try:
        api_token = encryption_service.decrypt(clinica.asaas_token_encrypted)
    except Exception as e:
        raise ValueError(f"Erro ao descriptografar token Asaas: {str(e)}")

    return AsaasService(
        api_token=api_token,
        sandbox=sandbox
    )
