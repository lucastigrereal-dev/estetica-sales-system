from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, date
from .. import models, schemas
from ..database import get_db

router = APIRouter()

@router.get("/dashboard/stats", response_model=schemas.DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    hoje = date.today()

    # Contar leads criados hoje
    leads_hoje = db.query(models.Lead).filter(
        func.date(models.Lead.created_at) == hoje
    ).count()

    # Contar agendamentos para hoje
    agendamentos_hoje = db.query(models.Agendamento).filter(
        func.date(models.Agendamento.data) == hoje
    ).count()

    # Calcular taxa de conversão (leads convertidos / total de leads)
    total_leads = db.query(models.Lead).count()
    leads_convertidos = db.query(models.Lead).filter(
        models.Lead.status == "convertido"
    ).count()

    taxa_conversao = 0.0
    if total_leads > 0:
        taxa_conversao = (leads_convertidos / total_leads) * 100

    return schemas.DashboardStats(
        leads_hoje=leads_hoje,
        agendamentos_hoje=agendamentos_hoje,
        taxa_conversao=round(taxa_conversao, 2)
    )
