from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, date
from .. import models, schemas
from ..database import get_db

router = APIRouter()

@router.post("/agendamentos", response_model=schemas.AgendamentoResponse)
def create_agendamento(agendamento: schemas.AgendamentoCreate, db: Session = Depends(get_db)):
    # Verificar se paciente existe
    paciente = db.query(models.Paciente).filter(models.Paciente.id == agendamento.paciente_id).first()
    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente não encontrado")

    # Verificar se procedimento existe
    procedimento = db.query(models.Procedimento).filter(models.Procedimento.id == agendamento.procedimento_id).first()
    if not procedimento:
        raise HTTPException(status_code=404, detail="Procedimento não encontrado")

    db_agendamento = models.Agendamento(**agendamento.dict())
    db.add(db_agendamento)
    db.commit()
    db.refresh(db_agendamento)
    return db_agendamento

@router.get("/agendamentos", response_model=List[schemas.AgendamentoResponse])
def list_agendamentos(
    data: Optional[str] = None,
    profissional: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Agendamento)

    if data:
        try:
            # Converter string para date e filtrar por dia
            data_obj = datetime.strptime(data, "%Y-%m-%d").date()
            query = query.filter(
                db.func.date(models.Agendamento.data) == data_obj
            )
        except ValueError:
            raise HTTPException(status_code=400, detail="Formato de data inválido. Use YYYY-MM-DD")

    if profissional:
        query = query.filter(models.Agendamento.profissional == profissional)

    return query.all()

@router.put("/agendamentos/{agendamento_id}/confirmar", response_model=schemas.AgendamentoResponse)
def confirmar_agendamento(agendamento_id: int, db: Session = Depends(get_db)):
    agendamento = db.query(models.Agendamento).filter(models.Agendamento.id == agendamento_id).first()
    if not agendamento:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")

    agendamento.confirmado = True
    agendamento.status = "confirmado"
    db.commit()
    db.refresh(agendamento)
    return agendamento

@router.put("/agendamentos/{agendamento_id}/cancelar", response_model=schemas.AgendamentoResponse)
def cancelar_agendamento(agendamento_id: int, db: Session = Depends(get_db)):
    agendamento = db.query(models.Agendamento).filter(models.Agendamento.id == agendamento_id).first()
    if not agendamento:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")

    agendamento.status = "cancelado"
    db.commit()
    db.refresh(agendamento)
    return agendamento
