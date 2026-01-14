from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import models, schemas
from ..database import get_db

router = APIRouter()

@router.post("/leads", response_model=schemas.LeadResponse)
def create_lead(lead: schemas.LeadCreate, db: Session = Depends(get_db)):
    db_lead = models.Lead(**lead.dict())
    db.add(db_lead)
    db.commit()
    db.refresh(db_lead)
    return db_lead

@router.get("/leads", response_model=List[schemas.LeadResponse])
def list_leads(
    status: Optional[str] = None,
    origem: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Lead)

    if status:
        query = query.filter(models.Lead.status == status)
    if origem:
        query = query.filter(models.Lead.origem == origem)

    return query.all()

@router.get("/leads/{lead_id}", response_model=schemas.LeadResponse)
def get_lead(lead_id: int, db: Session = Depends(get_db)):
    lead = db.query(models.Lead).filter(models.Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead não encontrado")
    return lead

@router.put("/leads/{lead_id}/status", response_model=schemas.LeadResponse)
def update_lead_status(lead_id: int, status: str, db: Session = Depends(get_db)):
    lead = db.query(models.Lead).filter(models.Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead não encontrado")

    lead.status = status
    db.commit()
    db.refresh(lead)
    return lead

@router.post("/leads/{lead_id}/convert", response_model=schemas.PacienteResponse)
def convert_lead_to_paciente(lead_id: int, db: Session = Depends(get_db)):
    lead = db.query(models.Lead).filter(models.Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead não encontrado")

    # Verificar se já foi convertido
    if lead.paciente:
        raise HTTPException(status_code=400, detail="Lead já foi convertido em paciente")

    # Criar paciente a partir do lead
    paciente = models.Paciente(
        nome=lead.nome,
        telefone=lead.telefone,
        email=lead.email,
        lead_id=lead.id
    )
    db.add(paciente)

    # Atualizar status do lead
    lead.status = "convertido"

    db.commit()
    db.refresh(paciente)
    return paciente
