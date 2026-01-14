from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, date, timedelta
from .. import models, schemas
from ..database import get_db
from ..dependencies import get_current_clinica_id

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

@router.get("/dashboard/financeiro", response_model=schemas.DashboardFinanceiroResponse)
def get_dashboard_financeiro(
    clinica_id: int = Depends(get_current_clinica_id),
    db: Session = Depends(get_db)
):
    """Retorna métricas financeiras da clínica"""
    hoje = date.today()
    inicio_semana = hoje - timedelta(days=7)
    inicio_mes = hoje.replace(day=1)

    # Receita total (todos os aprovados)
    receita_total = db.query(func.sum(models.Pagamento.valor_final)).filter(
        models.Pagamento.clinica_id == clinica_id,
        models.Pagamento.status == "APROVADO"
    ).scalar() or 0.0

    # Receita hoje
    receita_hoje = db.query(func.sum(models.Pagamento.valor_final)).filter(
        models.Pagamento.clinica_id == clinica_id,
        models.Pagamento.status == "APROVADO",
        func.date(models.Pagamento.data_pagamento) == hoje
    ).scalar() or 0.0

    # Receita semana
    receita_semana = db.query(func.sum(models.Pagamento.valor_final)).filter(
        models.Pagamento.clinica_id == clinica_id,
        models.Pagamento.status == "APROVADO",
        models.Pagamento.data_pagamento >= inicio_semana
    ).scalar() or 0.0

    # Receita mês
    receita_mes = db.query(func.sum(models.Pagamento.valor_final)).filter(
        models.Pagamento.clinica_id == clinica_id,
        models.Pagamento.status == "APROVADO",
        models.Pagamento.data_pagamento >= inicio_mes
    ).scalar() or 0.0

    # Pagamentos pendentes
    pagamentos_pendentes = db.query(models.Pagamento).filter(
        models.Pagamento.clinica_id == clinica_id,
        models.Pagamento.status == "PENDENTE"
    ).all()

    pagamentos_pendentes_count = len(pagamentos_pendentes)
    pagamentos_pendentes_valor = sum(p.valor_final for p in pagamentos_pendentes)

    # Pagamentos aprovados (count)
    pagamentos_aprovados_count = db.query(models.Pagamento).filter(
        models.Pagamento.clinica_id == clinica_id,
        models.Pagamento.status == "APROVADO"
    ).count()

    # Receita por método
    receita_por_metodo = {}
    for metodo in ["CARTAO", "PIX", "BOLETO", "DINHEIRO"]:
        valor = db.query(func.sum(models.Pagamento.valor_final)).filter(
            models.Pagamento.clinica_id == clinica_id,
            models.Pagamento.status == "APROVADO",
            models.Pagamento.metodo == metodo
        ).scalar() or 0.0
        receita_por_metodo[metodo] = float(valor)

    # Taxa de conversão de pagamento
    total_pagamentos = db.query(models.Pagamento).filter(
        models.Pagamento.clinica_id == clinica_id
    ).count()

    taxa_conversao_pagamento = 0.0
    if total_pagamentos > 0:
        taxa_conversao_pagamento = (pagamentos_aprovados_count / total_pagamentos) * 100

    return schemas.DashboardFinanceiroResponse(
        receita_total=float(receita_total),
        receita_hoje=float(receita_hoje),
        receita_semana=float(receita_semana),
        receita_mes=float(receita_mes),
        pagamentos_pendentes_count=pagamentos_pendentes_count,
        pagamentos_pendentes_valor=float(pagamentos_pendentes_valor),
        pagamentos_aprovados_count=pagamentos_aprovados_count,
        receita_por_metodo=receita_por_metodo,
        taxa_conversao_pagamento=round(taxa_conversao_pagamento, 2)
    )
