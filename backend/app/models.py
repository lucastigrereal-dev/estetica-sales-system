from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    telefone = Column(String, nullable=False)
    email = Column(String)
    origem = Column(String)  # Ex: "instagram", "whatsapp", "indicacao"
    interesse = Column(String)  # Procedimento de interesse
    status = Column(String, default="novo")  # "novo", "contatado", "agendado", "convertido"
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relacionamento
    paciente = relationship("Paciente", back_populates="lead", uselist=False)

class Paciente(Base):
    __tablename__ = "pacientes"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    telefone = Column(String, nullable=False)
    email = Column(String)
    lead_id = Column(Integer, ForeignKey("leads.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relacionamentos
    lead = relationship("Lead", back_populates="paciente")
    agendamentos = relationship("Agendamento", back_populates="paciente")

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
    data = Column(DateTime, nullable=False)
    profissional = Column(String)
    status = Column(String, default="pendente")  # "pendente", "confirmado", "cancelado", "realizado"
    confirmado = Column(Boolean, default=False)

    # Relacionamentos
    paciente = relationship("Paciente", back_populates="agendamentos")
    procedimento = relationship("Procedimento", back_populates="agendamentos")
