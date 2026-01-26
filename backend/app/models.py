from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Text, Index, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base
import enum

class Clinica(Base):
    __tablename__ = "clinicas"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(200), nullable=False)
    cnpj = Column(String(14), unique=True, nullable=False)
    telefone = Column(String(20), nullable=False)
    email = Column(String(100), nullable=False)

    # Credenciais criptografadas
    gerencianet_client_id_encrypted = Column(String, nullable=True)
    gerencianet_client_secret_encrypted = Column(String, nullable=True)
    gerencianet_pix_cert_path = Column(String, nullable=True)
    gerencianet_pix_key = Column(String, nullable=True)
    asaas_token_encrypted = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relacionamentos
    pacientes = relationship("Paciente", back_populates="clinica")
    agendamentos = relationship("Agendamento", back_populates="clinica")
    pagamentos = relationship("Pagamento", back_populates="clinica")
    users = relationship("User", back_populates="clinica")

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    ATENDENTE = "atendente"
    MEDICO = "medico"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    nome = Column(String(200), nullable=False)
    role = Column(String(50), nullable=False, default=UserRole.ATENDENTE.value)
    clinica_id = Column(Integer, ForeignKey("clinicas.id"), nullable=False)
    ativo = Column(Boolean, default=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relacionamento
    clinica = relationship("Clinica", back_populates="users")

    __table_args__ = (
        Index('idx_user_email', 'email'),
        Index('idx_user_clinica', 'clinica_id'),
    )

class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    telefone = Column(String, nullable=False)
    email = Column(String)
    origem = Column(String)  # Ex: "instagram", "whatsapp", "indicacao"
    interesse = Column(String)  # Procedimento de interesse
    status = Column(String, default="novo")  # "novo", "contatado", "agendado", "convertido"

    # Lead Scoring
    score = Column(Integer, default=0)  # Pontuação 0-100
    temperature = Column(String, default="cold")  # "hot", "warm", "cold"

    # Tracking
    replied_to_campaign = Column(Boolean, default=False)
    opened_messages = Column(Integer, default=0)
    requested_appointment = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relacionamento
    paciente = relationship("Paciente", back_populates="lead", uselist=False)

class Paciente(Base):
    __tablename__ = "pacientes"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    telefone = Column(String, nullable=False)
    email = Column(String)
    lead_id = Column(Integer, ForeignKey("leads.id"))
    clinica_id = Column(Integer, ForeignKey("clinicas.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relacionamentos
    lead = relationship("Lead", back_populates="paciente")
    clinica = relationship("Clinica", back_populates="pacientes")
    agendamentos = relationship("Agendamento", back_populates="paciente")
    pagamentos = relationship("Pagamento", back_populates="paciente")

__table_args__ = (
    Index('idx_paciente_clinica', 'clinica_id'),
)

class Procedimento(Base):
    __tablename__ = "procedimentos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    preco = Column(Float, nullable=False)
    duracao_min = Column(Integer, nullable=False)

    # Relacionamento
    agendamentos = relationship("Agendamento", back_populates="procedimento")

class Agendamento(Base):
    __tablename__ = "agendamentos"

    id = Column(Integer, primary_key=True, index=True)
    paciente_id = Column(Integer, ForeignKey("pacientes.id"), nullable=False)
    procedimento_id = Column(Integer, ForeignKey("procedimentos.id"), nullable=False)
    clinica_id = Column(Integer, ForeignKey("clinicas.id"), nullable=False)
    data = Column(DateTime, nullable=False)
    profissional = Column(String)
    status = Column(String, default="pendente")  # "pendente", "confirmado", "cancelado", "realizado"
    confirmado = Column(Boolean, default=False)

    # Relacionamentos
    paciente = relationship("Paciente", back_populates="agendamentos")
    procedimento = relationship("Procedimento", back_populates="agendamentos")
    clinica = relationship("Clinica", back_populates="agendamentos")
    pagamentos = relationship("Pagamento", back_populates="agendamento")

__table_args__ = (
    Index('idx_agendamento_clinica', 'clinica_id'),
)

class Pagamento(Base):
    __tablename__ = "pagamentos"

    id = Column(Integer, primary_key=True, index=True)
    agendamento_id = Column(Integer, ForeignKey("agendamentos.id"), nullable=True)
    paciente_id = Column(Integer, ForeignKey("pacientes.id"), nullable=False)
    clinica_id = Column(Integer, ForeignKey("clinicas.id"), nullable=False)

    # Valores
    valor = Column(Float, nullable=False)
    desconto = Column(Float, default=0.0)
    valor_final = Column(Float, nullable=False)

    # Método e Status
    metodo = Column(String, nullable=False)  # CARTAO, PIX, BOLETO, DINHEIRO
    status = Column(String, nullable=False, default="PENDENTE")  # PENDENTE, APROVADO, RECUSADO, REEMBOLSADO

    # Provider-specific fields
    gerencianet_payment_id = Column(String, unique=True, nullable=True)
    gerencianet_txid = Column(String, unique=True, nullable=True)
    asaas_payment_id = Column(String, unique=True, nullable=True)
    pix_code = Column(Text, nullable=True)
    boleto_url = Column(String, nullable=True)

    observacoes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    data_pagamento = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relacionamentos
    agendamento = relationship("Agendamento", back_populates="pagamentos")
    paciente = relationship("Paciente", back_populates="pagamentos")
    clinica = relationship("Clinica", back_populates="pagamentos")

__table_args__ = (
    Index('idx_pagamento_clinica_status', 'clinica_id', 'status'),
    Index('idx_pagamento_clinica_created', 'clinica_id', 'created_at'),
    Index('idx_pagamento_gn_txid', 'gerencianet_txid'),
    Index('idx_pagamento_asaas_id', 'asaas_payment_id'),
)

class WebhookLog(Base):
    __tablename__ = "webhook_logs"

    id = Column(Integer, primary_key=True, index=True)
    provider = Column(String, nullable=False)  # gerencianet, asaas
    payload = Column(Text, nullable=False)
    processed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
