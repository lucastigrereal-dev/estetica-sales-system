"""
Serviço de Integração com Gerencianet PIX

Implementa chamadas à API de PIX da Gerencianet para criação de cobranças,
geração de QR codes e consulta de pagamentos.
"""

import httpx
from typing import Optional, Dict
from datetime import datetime, timedelta
import os


class GerencianetService:
    """
    Cliente para API PIX da Gerencianet.

    Gerencia autenticação OAuth2 com certificado e operações de PIX.
    """

    BASE_URL = "https://api-pix.gerencianet.com.br/v2"
    AUTH_URL = "https://api-pix.gerencianet.com.br/oauth/token"
    SANDBOX_BASE_URL = "https://api-pix-h.gerencianet.com.br/v2"
    SANDBOX_AUTH_URL = "https://api-pix-h.gerencianet.com.br/oauth/token"

    def __init__(
        self,
        client_id: str,
        client_secret: str,
        cert_path: str,
        pix_key: str,
        sandbox: bool = False
    ):
        """
        Inicializa o serviço Gerencianet.

        Args:
            client_id: Client ID da aplicação
            client_secret: Client Secret da aplicação
            cert_path: Caminho para o arquivo .p12 de certificado
            pix_key: Chave PIX da conta (CPF, CNPJ, email, etc.)
            sandbox: Se True, usa ambiente de homologação
        """
        self.client_id = client_id
        self.client_secret = client_secret
        self.cert_path = cert_path
        self.pix_key = pix_key
        self.sandbox = sandbox

        # Selecionar URLs baseado no ambiente
        if sandbox:
            self.base_url = self.SANDBOX_BASE_URL
            self.auth_url = self.SANDBOX_AUTH_URL
        else:
            self.base_url = self.BASE_URL
            self.auth_url = self.AUTH_URL

        # Cache do token de acesso
        self._access_token: Optional[str] = None
        self._token_expires_at: Optional[datetime] = None

    async def _get_access_token(self) -> str:
        """
        Obtém token de acesso OAuth2.

        Usa cache se token ainda for válido.
        Requer certificado (.p12) para autenticação.

        Returns:
            Token de acesso válido

        Raises:
            httpx.HTTPError: Se falhar na autenticação
        """
        # Retornar token em cache se ainda válido
        if self._access_token and self._token_expires_at:
            if datetime.utcnow() < self._token_expires_at:
                return self._access_token

        # Solicitar novo token
        try:
            async with httpx.AsyncClient(verify=self.cert_path) as client:
                response = await client.post(
                    self.auth_url,
                    auth=(self.client_id, self.client_secret),
                    json={"grant_type": "client_credentials"},
                    timeout=30.0
                )
                response.raise_for_status()
                data = response.json()

                self._access_token = data["access_token"]
                expires_in = data.get("expires_in", 3600)  # Default 1h
                self._token_expires_at = datetime.utcnow() + timedelta(seconds=expires_in - 60)  # 60s de margem

                return self._access_token
        except httpx.HTTPError as e:
            raise Exception(f"Erro ao obter token Gerencianet: {str(e)}")

    async def create_pix_charge(
        self,
        valor: float,
        descricao: str,
        expiracao_segundos: int = 3600
    ) -> Dict:
        """
        Cria uma cobrança PIX imediata.

        Args:
            valor: Valor da cobrança em reais
            descricao: Descrição da cobrança (ex: "Pagamento #123")
            expiracao_segundos: Tempo até expiração (default: 1 hora)

        Returns:
            Dict com dados da cobrança criada, incluindo txid e loc.id

        Raises:
            httpx.HTTPError: Se falhar na criação
        """
        token = await self._get_access_token()

        body = {
            "calendario": {"expiracao": expiracao_segundos},
            "valor": {"original": f"{valor:.2f}"},
            "chave": self.pix_key,
            "solicitacaoPagador": descricao
        }

        try:
            async with httpx.AsyncClient(verify=self.cert_path) as client:
                response = await client.post(
                    f"{self.base_url}/cob",
                    headers={"Authorization": f"Bearer {token}"},
                    json=body,
                    timeout=30.0
                )
                response.raise_for_status()
                return response.json()
        except httpx.HTTPError as e:
            raise Exception(f"Erro ao criar cobrança PIX: {str(e)}")

    async def generate_qr_code(self, loc_id: str) -> Dict:
        """
        Gera QR Code para uma cobrança.

        Args:
            loc_id: ID da location retornado na criação da cobrança

        Returns:
            Dict com qrcode (base64), imagemQrcode (base64), linkVisualizacao

        Raises:
            httpx.HTTPError: Se falhar na geração
        """
        token = await self._get_access_token()

        try:
            async with httpx.AsyncClient(verify=self.cert_path) as client:
                response = await client.get(
                    f"{self.base_url}/loc/{loc_id}/qrcode",
                    headers={"Authorization": f"Bearer {token}"},
                    timeout=30.0
                )
                response.raise_for_status()
                return response.json()
        except httpx.HTTPError as e:
            raise Exception(f"Erro ao gerar QR Code: {str(e)}")

    async def get_charge_details(self, txid: str) -> Dict:
        """
        Consulta detalhes de uma cobrança pelo txid.

        Args:
            txid: Transaction ID da cobrança

        Returns:
            Dict com dados completos da cobrança, incluindo status

        Raises:
            httpx.HTTPError: Se falhar na consulta
        """
        token = await self._get_access_token()

        try:
            async with httpx.AsyncClient(verify=self.cert_path) as client:
                response = await client.get(
                    f"{self.base_url}/cob/{txid}",
                    headers={"Authorization": f"Bearer {token}"},
                    timeout=30.0
                )
                response.raise_for_status()
                return response.json()
        except httpx.HTTPError as e:
            raise Exception(f"Erro ao consultar cobrança: {str(e)}")

    async def configure_webhook(self, chave: str, webhook_url: str) -> Dict:
        """
        Configura webhook para receber notificações de PIX.

        Args:
            chave: Chave PIX para vincular o webhook
            webhook_url: URL que receberá os webhooks

        Returns:
            Dict com confirmação da configuração

        Raises:
            httpx.HTTPError: Se falhar na configuração
        """
        token = await self._get_access_token()

        body = {"webhookUrl": webhook_url}

        try:
            async with httpx.AsyncClient(verify=self.cert_path) as client:
                response = await client.put(
                    f"{self.base_url}/webhook/{chave}",
                    headers={"Authorization": f"Bearer {token}"},
                    json=body,
                    timeout=30.0
                )
                response.raise_for_status()
                return response.json()
        except httpx.HTTPError as e:
            raise Exception(f"Erro ao configurar webhook: {str(e)}")
