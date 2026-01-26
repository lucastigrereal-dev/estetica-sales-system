from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from ..database import get_db
from ..models import Lead
from ..schemas import LeadResponse
from ..services.lead_scoring import lead_scoring_service
from .auth import get_current_user
from ..models import User

router = APIRouter()


@router.get("/leads/hot", response_model=list[LeadResponse])
def get_hot_leads(
    limit: int = Query(50, ge=1, le=200),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retorna leads quentes (score >= 70)
    """
    leads = lead_scoring_service.get_hot_leads(db, limit)
    return leads


@router.get("/leads/by-temperature/{temperature}", response_model=list[LeadResponse])
def get_leads_by_temperature(
    temperature: str,
    limit: int = Query(50, ge=1, le=200),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retorna leads por temperatura (hot, warm, cold)
    """
    if temperature not in ["hot", "warm", "cold"]:
        raise HTTPException(status_code=400, detail="Temperatura inválida. Use: hot, warm ou cold")

    leads = lead_scoring_service.get_leads_by_temperature(db, temperature, limit)
    return leads


@router.get("/leads/{lead_id}/score")
def get_lead_score(
    lead_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retorna score e breakdown detalhado de um lead
    """
    lead = db.query(Lead).filter(Lead.id == lead_id).first()

    if not lead:
        raise HTTPException(status_code=404, detail="Lead não encontrado")

    breakdown = lead_scoring_service.get_scoring_breakdown(lead)

    return {
        "lead_id": lead.id,
        "nome": lead.nome,
        "score": lead.score,
        "temperature": lead.temperature,
        "status": lead.status,
        "breakdown": breakdown
    }


@router.post("/leads/{lead_id}/recalculate-score")
def recalculate_lead_score(
    lead_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Recalcula score de um lead específico
    """
    lead = db.query(Lead).filter(Lead.id == lead_id).first()

    if not lead:
        raise HTTPException(status_code=404, detail="Lead não encontrado")

    updated_lead = lead_scoring_service.update_lead_score(lead, db)

    return {
        "lead_id": updated_lead.id,
        "nome": updated_lead.nome,
        "score": updated_lead.score,
        "temperature": updated_lead.temperature,
        "message": "Score recalculado com sucesso"
    }


@router.post("/leads/bulk-recalculate-scores")
def bulk_recalculate_scores(
    status: Optional[str] = Query(None, description="Filtrar por status"),
    limit: Optional[int] = Query(None, ge=1, le=1000, description="Limite de leads"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Recalcula scores de múltiplos leads

    Útil para recalcular todos os leads após ajuste nos pesos
    """
    stats = lead_scoring_service.bulk_recalculate_scores(
        db,
        status_filter=status,
        limit=limit
    )

    return {
        "message": "Scores recalculados com sucesso",
        "statistics": stats
    }


@router.get("/leads/scoring-stats")
def get_scoring_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retorna estatísticas de scoring de todos os leads
    """
    total_leads = db.query(Lead).count()
    hot_leads = db.query(Lead).filter(Lead.temperature == "hot").count()
    warm_leads = db.query(Lead).filter(Lead.temperature == "warm").count()
    cold_leads = db.query(Lead).filter(Lead.temperature == "cold").count()

    # Score médio por status
    avg_by_status = {}
    for status in ["novo", "contatado", "interessado", "agendado", "convertido", "perdido"]:
        leads_status = db.query(Lead).filter(Lead.status == status).all()
        if leads_status:
            avg_score = sum(l.score or 0 for l in leads_status) / len(leads_status)
            avg_by_status[status] = round(avg_score, 2)
        else:
            avg_by_status[status] = 0

    return {
        "total_leads": total_leads,
        "by_temperature": {
            "hot": hot_leads,
            "warm": warm_leads,
            "cold": cold_leads
        },
        "percentages": {
            "hot": round((hot_leads / total_leads * 100) if total_leads > 0 else 0, 2),
            "warm": round((warm_leads / total_leads * 100) if total_leads > 0 else 0, 2),
            "cold": round((cold_leads / total_leads * 100) if total_leads > 0 else 0, 2)
        },
        "average_score_by_status": avg_by_status
    }


@router.put("/leads/{lead_id}/mark-opened-message")
def mark_message_opened(
    lead_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Marca que lead abriu uma mensagem (incrementa contador e recalcula score)
    """
    lead = db.query(Lead).filter(Lead.id == lead_id).first()

    if not lead:
        raise HTTPException(status_code=404, detail="Lead não encontrado")

    lead.opened_messages += 1

    # Recalcula score
    updated_lead = lead_scoring_service.update_lead_score(lead, db)

    return {
        "lead_id": updated_lead.id,
        "opened_messages": updated_lead.opened_messages,
        "score": updated_lead.score,
        "temperature": updated_lead.temperature
    }


@router.put("/leads/{lead_id}/mark-replied-campaign")
def mark_replied_to_campaign(
    lead_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Marca que lead respondeu a uma campanha (recalcula score)
    """
    lead = db.query(Lead).filter(Lead.id == lead_id).first()

    if not lead:
        raise HTTPException(status_code=404, detail="Lead não encontrado")

    lead.replied_to_campaign = True

    # Recalcula score
    updated_lead = lead_scoring_service.update_lead_score(lead, db)

    return {
        "lead_id": updated_lead.id,
        "replied_to_campaign": True,
        "score": updated_lead.score,
        "temperature": updated_lead.temperature
    }


@router.put("/leads/{lead_id}/mark-requested-appointment")
def mark_requested_appointment(
    lead_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Marca que lead solicitou agendamento (recalcula score)
    """
    lead = db.query(Lead).filter(Lead.id == lead_id).first()

    if not lead:
        raise HTTPException(status_code=404, detail="Lead não encontrado")

    lead.requested_appointment = True

    # Se ainda não está agendado, muda status
    if lead.status not in ["agendado", "convertido"]:
        lead.status = "agendado"

    # Recalcula score
    updated_lead = lead_scoring_service.update_lead_score(lead, db)

    return {
        "lead_id": updated_lead.id,
        "requested_appointment": True,
        "status": updated_lead.status,
        "score": updated_lead.score,
        "temperature": updated_lead.temperature
    }
