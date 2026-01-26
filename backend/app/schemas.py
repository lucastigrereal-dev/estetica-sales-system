from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# Lead Schemas
class LeadCreate(BaseModel):
    nome: str
    telefone: str
    email: Optional[str] = None
    origem: Optional[str] = None
    interesse: Optional[str] = None

class LeadUpdate(BaseModel):
    nome: Optional[str] = None
    telefone: Optional[str] = None
    email: Optional[str] = None
    origem: Optional[str] = None
    interesse: Optional[str] = None
    status: Optional[str] = None

class LeadResponse(BaseModel):
    id: int
    nome: str
    telefone: str
    email: Optional[str]
    origem: Optional[str]
    interesse: Optional[str]
    status: str
    score: Optional[int] = 0
    temperature: Optional[str] = "cold"
    replied_to_campaign: Optional[bool] = False
    opened_messages: Optional[int] = 0
    requested_appointment: Optional[bool] = False
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Paciente Schemas
class PacienteCreate(BaseModel):
    nome: str
    telefone: str
    email: Optional[str] = None
    lead_id: Optional[int] = None
    clinica_id: int

class PacienteUpdate(BaseModel):
    nome: Optional[str] = None
    telefone: Optional[str] = None
    email: Optional[str] = None

class PacienteResponse(BaseModel):
    id: int
    nome: str
    telefone: str
    email: Optional[str]
    lead_id: Optional[int]
    clinica_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Procedimento Schemas
class ProcedimentoCreate(BaseModel):
    nome: str
    preco: float
    duracao_min: int

class ProcedimentoUpdate(BaseModel):
    nome: Optional[str] = None
    preco: Optional[float] = None
    duracao_min: Optional[int] = None

class ProcedimentoResponse(BaseModel):
    id: int
    nome: str
    preco: float
    duracao_min: int

    class Config:
        from_attributes = True

# Agendamento Schemas
class AgendamentoCreate(BaseModel):
    paciente_id: int
    procedimento_id: int
    clinica_id: int
    data: datetime
    profissional: Optional[str] = None

class AgendamentoUpdate(BaseModel):
    data: Optional[datetime] = None
    profissional: Optional[str] = None
    status: Optional[str] = None
    confirmado: Optional[bool] = None

class AgendamentoResponse(BaseModel):
    id: int
    paciente_id: int
    procedimento_id: int
    clinica_id: int
    data: datetime
    profissional: Optional[str]
    status: str
    confirmado: bool

    class Config:
        from_attributes = True

# Dashboard Schema
class DashboardStats(BaseModel):
    leads_hoje: int
    agendamentos_hoje: int
    taxa_conversao: float

# ========================================
# Módulo Financeiro - Schemas
# ========================================

from enum import Enum
from typing import Dict

# Enums
class MetodoPagamento(str, Enum):
    CARTAO = "CARTAO"
    PIX = "PIX"
    BOLETO = "BOLETO"
    DINHEIRO = "DINHEIRO"

class StatusPagamento(str, Enum):
    PENDENTE = "PENDENTE"
    APROVADO = "APROVADO"
    RECUSADO = "RECUSADO"
    REEMBOLSADO = "REEMBOLSADO"

# Clinica Schemas
class ClinicaCreate(BaseModel):
    nome: str
    cnpj: str
    telefone: str
    email: str
    gerencianet_client_id: Optional[str] = None
    gerencianet_client_secret: Optional[str] = None
    gerencianet_pix_cert_path: Optional[str] = None
    gerencianet_pix_key: Optional[str] = None
    asaas_token: Optional[str] = None

class ClinicaUpdate(BaseModel):
    nome: Optional[str] = None
    telefone: Optional[str] = None
    email: Optional[str] = None
    gerencianet_client_id: Optional[str] = None
    gerencianet_client_secret: Optional[str] = None
    gerencianet_pix_cert_path: Optional[str] = None
    gerencianet_pix_key: Optional[str] = None
    asaas_token: Optional[str] = None

class ClinicaResponse(BaseModel):
    id: int
    nome: str
    cnpj: str
    telefone: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True

# Pagamento Schemas
class PagamentoCreate(BaseModel):
    agendamento_id: Optional[int] = None
    paciente_id: int
    valor: float
    desconto: float = 0.0
    metodo: MetodoPagamento
    observacoes: Optional[str] = None

class PagamentoPixGerencianetCreate(BaseModel):
    agendamento_id: Optional[int] = None
    paciente_id: int
    valor: float
    desconto: float = 0.0

class PagamentoAsaasCreate(BaseModel):
    agendamento_id: Optional[int] = None
    paciente_id: int
    valor: float
    desconto: float = 0.0
    tipo: str  # "PIX" ou "BOLETO"
    due_date: Optional[str] = None  # YYYY-MM-DD (obrigatório para boleto)

class PagamentoResponse(BaseModel):
    id: int
    agendamento_id: Optional[int]
    paciente_id: int
    clinica_id: int
    valor: float
    desconto: float
    valor_final: float
    metodo: MetodoPagamento
    status: StatusPagamento
    gerencianet_payment_id: Optional[str]
    gerencianet_txid: Optional[str]
    asaas_payment_id: Optional[str]
    pix_code: Optional[str]
    boleto_url: Optional[str]
    observacoes: Optional[str]
    created_at: datetime
    data_pagamento: Optional[datetime]

    # Nested objects (optional)
    paciente: Optional[PacienteResponse] = None
    agendamento: Optional[AgendamentoResponse] = None

    class Config:
        from_attributes = True

# Dashboard Financeiro Schema
class DashboardFinanceiroResponse(BaseModel):
    receita_total: float
    receita_hoje: float
    receita_semana: float
    receita_mes: float
    pagamentos_pendentes_count: int
    pagamentos_pendentes_valor: float
    pagamentos_aprovados_count: int
    receita_por_metodo: Dict[str, float]
    taxa_conversao_pagamento: float

# ========================================
# Autenticação - Schemas
# ========================================

class UserCreate(BaseModel):
    email: str
    password: str
    nome: str
    role: str = "atendente"  # admin, atendente, medico
    clinica_id: int

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    nome: str
    role: str
    clinica_id: int
    ativo: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: Optional[dict] = None

class TokenData(BaseModel):
    email: Optional[str] = None
