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
    created_at: datetime

    class Config:
        from_attributes = True

# Paciente Schemas
class PacienteCreate(BaseModel):
    nome: str
    telefone: str
    email: Optional[str] = None
    lead_id: Optional[int] = None

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
