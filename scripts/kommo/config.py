"""
Configuração e cliente para API Kommo (amoCRM)
"""
import os
import logging
import requests
from typing import Optional, Dict, List, Any
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class KommoConfig:
    """Configurações da API Kommo"""

    def __init__(self):
        self.subdomain = os.getenv('KOMMO_SUBDOMAIN')
        self.api_key = os.getenv('KOMMO_API_KEY')
        self.pipeline_id = os.getenv('KOMMO_PIPELINE_ID')

        if not self.subdomain or not self.api_key:
            raise ValueError(
                "KOMMO_SUBDOMAIN e KOMMO_API_KEY devem estar definidos no arquivo .env"
            )

        self.base_url = f"https://{self.subdomain}.kommo.com/api/v4"

    def get_headers(self) -> Dict[str, str]:
        """Retorna headers para requisições"""
        return {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }


class KommoClient:
    """Cliente para interagir com a API Kommo"""

    def __init__(self):
        self.config = KommoConfig()
        self.base_url = self.config.base_url
        self.headers = self.config.get_headers()
        logger.info(f"KommoClient inicializado para {self.config.subdomain}")

    def _make_request(
        self,
        method: str,
        endpoint: str,
        params: Optional[Dict] = None,
        json: Optional[Dict] = None
    ) -> Dict[str, Any]:
        """
        Faz requisição à API Kommo

        Args:
            method: Método HTTP (GET, POST, PATCH)
            endpoint: Endpoint da API (ex: /leads)
            params: Parâmetros query string
            json: Dados JSON para POST/PATCH

        Returns:
            Resposta JSON da API
        """
        url = f"{self.base_url}{endpoint}"

        try:
            response = requests.request(
                method=method,
                url=url,
                headers=self.headers,
                params=params,
                json=json,
                timeout=30
            )
            response.raise_for_status()
            return response.json()

        except requests.exceptions.HTTPError as e:
            logger.error(f"Erro HTTP {response.status_code}: {response.text}")
            raise
        except requests.exceptions.RequestException as e:
            logger.error(f"Erro na requisição: {str(e)}")
            raise

    def get_leads(
        self,
        status_id: Optional[int] = None,
        limit: int = 250,
        page: int = 1
    ) -> List[Dict[str, Any]]:
        """
        Busca leads da Kommo

        Args:
            status_id: ID do status para filtrar
            limit: Quantidade de leads por página (máx 250)
            page: Número da página

        Returns:
            Lista de leads
        """
        params = {
            'limit': min(limit, 250),
            'page': page,
            'with': 'contacts'
        }

        if status_id:
            params['filter[statuses][0][status_id]'] = status_id

        logger.info(f"Buscando leads (página {page}, limit {limit})")
        response = self._make_request('GET', '/leads', params=params)

        leads = response.get('_embedded', {}).get('leads', [])
        logger.info(f"Encontrados {len(leads)} leads")

        return leads

    def get_lead_by_phone(self, phone: str) -> Optional[Dict[str, Any]]:
        """
        Busca lead por telefone

        Args:
            phone: Número de telefone

        Returns:
            Lead encontrado ou None
        """
        params = {
            'query': phone,
            'with': 'contacts'
        }

        logger.info(f"Buscando lead por telefone: {phone}")
        response = self._make_request('GET', '/leads', params=params)

        leads = response.get('_embedded', {}).get('leads', [])

        if leads:
            logger.info(f"Lead encontrado: ID {leads[0]['id']}")
            return leads[0]

        logger.warning(f"Nenhum lead encontrado para: {phone}")
        return None

    def add_tag_to_lead(self, lead_id: int, tag_name: str) -> bool:
        """
        Adiciona tag a um lead

        Args:
            lead_id: ID do lead
            tag_name: Nome da tag

        Returns:
            True se sucesso
        """
        try:
            # Buscar lead atual
            lead = self._make_request('GET', f'/leads/{lead_id}')

            # Obter tags atuais
            current_tags = lead.get('_embedded', {}).get('tags', [])

            # Adicionar nova tag se não existir
            tag_exists = any(tag['name'] == tag_name for tag in current_tags)

            if tag_exists:
                logger.info(f"Tag '{tag_name}' já existe no lead {lead_id}")
                return True

            # Atualizar lead com nova tag
            data = {
                '_embedded': {
                    'tags': [{'name': tag_name}]
                }
            }

            self._make_request('PATCH', f'/leads/{lead_id}', json=data)
            logger.info(f"Tag '{tag_name}' adicionada ao lead {lead_id}")
            return True

        except Exception as e:
            logger.error(f"Erro ao adicionar tag ao lead {lead_id}: {str(e)}")
            return False

    def get_pipelines(self) -> List[Dict[str, Any]]:
        """
        Busca todos os funis (pipelines)

        Returns:
            Lista de pipelines
        """
        logger.info("Buscando pipelines")
        response = self._make_request('GET', '/leads/pipelines')

        pipelines = response.get('_embedded', {}).get('pipelines', [])
        logger.info(f"Encontrados {len(pipelines)} pipelines")

        return pipelines

    def get_pipeline_statuses(self, pipeline_id: Optional[int] = None) -> Dict[int, str]:
        """
        Busca status de um pipeline

        Args:
            pipeline_id: ID do pipeline (usa da config se não fornecido)

        Returns:
            Dicionário {status_id: status_name}
        """
        if not pipeline_id:
            pipeline_id = self.config.pipeline_id

        if not pipeline_id:
            raise ValueError("pipeline_id não fornecido e KOMMO_PIPELINE_ID não configurado")

        logger.info(f"Buscando status do pipeline {pipeline_id}")
        response = self._make_request('GET', f'/leads/pipelines/{pipeline_id}')

        statuses = {}
        embedded_statuses = response.get('_embedded', {}).get('statuses', [])

        for status in embedded_statuses:
            statuses[status['id']] = status['name']

        logger.info(f"Encontrados {len(statuses)} status")
        return statuses
