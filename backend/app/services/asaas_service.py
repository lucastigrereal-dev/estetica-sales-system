"""
Serviço de Integração com Asaas

Implementa chamadas à API da Asaas para gestão de clientes e cobranças (PIX, Boleto).
"""

import httpx
from typing import Optional, Dict, List
from datetime import datetime


class AsaasService:
    """
    Cliente para API da Asaas.

    Gerencia clientes, pagamentos e cobranças via PIX e Boleto.
    """

    BASE_URL = "https://www.asaas.com/api/v3"
    SANDBOX_URL = "https://sandbox.asaas.com/api/v3"

    def __init__(self, api_token: str, sandbox: bool = False):
        """
        Inicializa o serviço Asaas.

        Args:
            api_token: Token de acesso da API
            sandbox: Se True, usa ambiente de homologação
        """
        self.api_token = api_token
        self.base_url = self.SANDBOX_URL if sandbox else self.BASE_URL

    def _get_headers(self) -> Dict:
        """Headers padrão para requisições."""
        return {
            "access_token": self.api_token,
            "Content-Type": "application/json"
        }

    async def create_customer(
        self,
        name: str,
        cpf_cnpj: str,
        email: Optional[str] = None,
        phone: Optional[str] = None,
        postal_code: Optional[str] = None
    ) -> Dict:
        """
        Cria ou busca cliente no Asaas.

        Args:
            name: Nome do cliente
            cpf_cnpj: CPF ou CNPJ (apenas números)
            email: Email do cliente
            phone: Telefone do cliente
            postal_code: CEP

        Returns:
            Dict com dados do cliente criado/existente

        Raises:
            httpx.HTTPError: Se falhar na criação
        """
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/customers",
                    headers=self._get_headers(),
                    json={
                        "name": name,
                        "cpfCnpj": cpf_cnpj,
                        "email": email,
                        "phone": phone,
                        "postalCode": postal_code
                    },
                    timeout=30.0
                )
                response.raise_for_status()
                return response.json()
        except httpx.HTTPError as e:
            # Se cliente já existe, buscar pelo CPF/CNPJ
            if "already exists" in str(e).lower():
                return await self.get_customer_by_cpf_cnpj(cpf_cnpj)
            raise Exception(f"Erro ao criar cliente Asaas: {str(e)}")

    async def get_customer_by_cpf_cnpj(self, cpf_cnpj: str) -> Optional[Dict]:
        """
        Busca cliente pelo CPF/CNPJ.

        Args:
            cpf_cnpj: CPF ou CNPJ (apenas números)

        Returns:
            Dict com dados do cliente ou None se não encontrado
        """
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/customers",
                    headers=self._get_headers(),
                    params={"cpfCnpj": cpf_cnpj},
                    timeout=30.0
                )
                response.raise_for_status()
                data = response.json()
                if data.get("data"):
                    return data["data"][0]
                return None
        except httpx.HTTPError as e:
            raise Exception(f"Erro ao buscar cliente: {str(e)}")

    async def create_payment(
        self,
        customer_id: str,
        value: float,
        due_date: str,
        billing_type: str = "PIX",
        description: Optional[str] = None,
        external_reference: Optional[str] = None
    ) -> Dict:
        """
        Cria uma cobrança no Asaas.

        Args:
            customer_id: ID do cliente no Asaas
            value: Valor da cobrança
            due_date: Data de vencimento (YYYY-MM-DD)
            billing_type: Tipo de cobrança (PIX, BOLETO, CREDIT_CARD)
            description: Descrição da cobrança
            external_reference: Referência externa (ex: ID do pagamento local)

        Returns:
            Dict com dados da cobrança criada

        Raises:
            httpx.HTTPError: Se falhar na criação
        """
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/payments",
                    headers=self._get_headers(),
                    json={
                        "customer": customer_id,
                        "value": value,
                        "dueDate": due_date,
                        "billingType": billing_type,
                        "description": description,
                        "externalReference": external_reference
                    },
                    timeout=30.0
                )
                response.raise_for_status()
                return response.json()
        except httpx.HTTPError as e:
            raise Exception(f"Erro ao criar cobrança Asaas: {str(e)}")

    async def get_pix_qrcode(self, payment_id: str) -> Dict:
        """
        Obtém QR Code PIX de uma cobrança.

        Args:
            payment_id: ID da cobrança no Asaas

        Returns:
            Dict com encodedImage (base64), payload e expirationDate

        Raises:
            httpx.HTTPError: Se falhar na consulta
        """
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/payments/{payment_id}/pixQrCode",
                    headers=self._get_headers(),
                    timeout=30.0
                )
                response.raise_for_status()
                return response.json()
        except httpx.HTTPError as e:
            raise Exception(f"Erro ao obter QR Code PIX: {str(e)}")

    async def get_payment(self, payment_id: str) -> Dict:
        """
        Consulta detalhes de uma cobrança.

        Args:
            payment_id: ID da cobrança no Asaas

        Returns:
            Dict com dados completos da cobrança

        Raises:
            httpx.HTTPError: Se falhar na consulta
        """
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/payments/{payment_id}",
                    headers=self._get_headers(),
                    timeout=30.0
                )
                response.raise_for_status()
                return response.json()
        except httpx.HTTPError as e:
            raise Exception(f"Erro ao consultar cobrança: {str(e)}")

    async def list_payments(
        self,
        customer_id: Optional[str] = None,
        status: Optional[str] = None,
        date_created_ge: Optional[str] = None,
        date_created_le: Optional[str] = None,
        limit: int = 10,
        offset: int = 0
    ) -> Dict:
        """
        Lista cobranças com filtros.

        Args:
            customer_id: Filtrar por cliente
            status: Filtrar por status (PENDING, RECEIVED, CONFIRMED, etc.)
            date_created_ge: Data de criação maior ou igual (YYYY-MM-DD)
            date_created_le: Data de criação menor ou igual (YYYY-MM-DD)
            limit: Limite de resultados
            offset: Offset para paginação

        Returns:
            Dict com array de cobranças e dados de paginação

        Raises:
            httpx.HTTPError: Se falhar na consulta
        """
        params = {
            "limit": limit,
            "offset": offset
        }
        if customer_id:
            params["customer"] = customer_id
        if status:
            params["status"] = status
        if date_created_ge:
            params["dateCreated[ge]"] = date_created_ge
        if date_created_le:
            params["dateCreated[le]"] = date_created_le

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/payments",
                    headers=self._get_headers(),
                    params=params,
                    timeout=30.0
                )
                response.raise_for_status()
                return response.json()
        except httpx.HTTPError as e:
            raise Exception(f"Erro ao listar cobranças: {str(e)}")
