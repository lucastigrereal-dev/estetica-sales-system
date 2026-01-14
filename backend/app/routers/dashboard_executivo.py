from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, extract
from datetime import datetime, date, timedelta
from typing import List, Optional
from .. import models
from ..database import get_db
from ..dependencies import get_current_clinica_id

router = APIRouter()

@router.get("/dashboard/executivo/resumo-hoje")
def resumo_hoje(
    clinica_id: int = Depends(get_current_clinica_id),
    db: Session = Depends(get_db)
):
    """KPIs do dia atual"""
    hoje = date.today()

    # Agendamentos hoje
    agendamentos = db.query(models.Agendamento).filter(
        models.Agendamento.clinica_id == clinica_id,
        func.date(models.Agendamento.data) == hoje
    ).all()

    agendamentos_total = len(agendamentos)
    agendamentos_realizados = len([a for a in agendamentos if a.status == "realizado"])
    agendamentos_cancelados = len([a for a in agendamentos if a.status == "cancelado"])
    no_shows = agendamentos_total - agendamentos_realizados - agendamentos_cancelados

    # Faturamento hoje
    faturamento_hoje = db.query(func.sum(models.Pagamento.valor_final)).filter(
        models.Pagamento.clinica_id == clinica_id,
        models.Pagamento.status == "APROVADO",
        func.date(models.Pagamento.data_pagamento) == hoje
    ).scalar() or 0.0

    # Novos leads hoje
    novos_leads = db.query(models.Lead).filter(
        func.date(models.Lead.created_at) == hoje
    ).count()

    return {
        "agendamentos_total": agendamentos_total,
        "agendamentos_realizados": agendamentos_realizados,
        "no_shows": no_shows,
        "faturamento_hoje": float(faturamento_hoje),
        "novos_leads": novos_leads,
        "taxa_no_show": round((no_shows / agendamentos_total * 100) if agendamentos_total > 0 else 0, 2)
    }

@router.get("/dashboard/executivo/metricas")
def metricas(
    periodo: int = Query(30, description="Número de dias"),
    clinica_id: int = Depends(get_current_clinica_id),
    db: Session = Depends(get_db)
):
    """Métricas diárias para gráficos"""
    data_inicio = date.today() - timedelta(days=periodo)

    # Faturamento por dia
    faturamento_query = db.query(
        func.date(models.Pagamento.data_pagamento).label('data'),
        func.sum(models.Pagamento.valor_final).label('valor')
    ).filter(
        models.Pagamento.clinica_id == clinica_id,
        models.Pagamento.status == "APROVADO",
        models.Pagamento.data_pagamento >= data_inicio
    ).group_by(func.date(models.Pagamento.data_pagamento)).all()

    faturamento = [{"data": str(f.data), "valor": float(f.valor)} for f in faturamento_query]

    # Agendamentos por dia
    agendamentos_query = db.query(
        func.date(models.Agendamento.data).label('data'),
        func.count(models.Agendamento.id).label('count')
    ).filter(
        models.Agendamento.clinica_id == clinica_id,
        models.Agendamento.data >= data_inicio
    ).group_by(func.date(models.Agendamento.data)).all()

    agendamentos = [{"data": str(a.data), "count": a.count} for a in agendamentos_query]

    return {
        "faturamento": faturamento,
        "agendamentos": agendamentos
    }

@router.get("/dashboard/executivo/conversao")
def conversao(
    periodo: int = Query(30, description="Número de dias"),
    clinica_id: int = Depends(get_current_clinica_id),
    db: Session = Depends(get_db)
):
    """Funil de conversão"""
    data_inicio = date.today() - timedelta(days=periodo)

    # Total de leads
    leads = db.query(models.Lead).filter(
        models.Lead.created_at >= data_inicio
    ).count()

    # Leads contatados
    qualificados = db.query(models.Lead).filter(
        models.Lead.created_at >= data_inicio,
        models.Lead.status.in_(["contatado", "agendado", "convertido"])
    ).count()

    # Leads agendados
    agendados = db.query(models.Lead).filter(
        models.Lead.created_at >= data_inicio,
        models.Lead.status.in_(["agendado", "convertido"])
    ).count()

    # Leads convertidos (com agendamento realizado)
    convertidos = db.query(models.Lead).filter(
        models.Lead.created_at >= data_inicio,
        models.Lead.status == "convertido"
    ).count()

    return {
        "leads": leads,
        "qualificados": qualificados,
        "agendados": agendados,
        "realizados": convertidos,
        "taxas": {
            "qualificacao": round((qualificados / leads * 100) if leads > 0 else 0, 2),
            "agendamento": round((agendados / qualificados * 100) if qualificados > 0 else 0, 2),
            "conversao": round((convertidos / agendados * 100) if agendados > 0 else 0, 2)
        }
    }

@router.get("/dashboard/executivo/top-procedimentos")
def top_procedimentos(
    periodo: int = Query(30, description="Número de dias"),
    limit: int = Query(5, description="Top N procedimentos"),
    clinica_id: int = Depends(get_current_clinica_id),
    db: Session = Depends(get_db)
):
    """Ranking de procedimentos mais realizados"""
    data_inicio = date.today() - timedelta(days=periodo)

    resultados = db.query(
        models.Procedimento.nome,
        func.count(models.Agendamento.id).label('quantidade'),
        func.sum(models.Pagamento.valor_final).label('faturamento')
    ).join(
        models.Agendamento, models.Procedimento.id == models.Agendamento.procedimento_id
    ).outerjoin(
        models.Pagamento, models.Agendamento.id == models.Pagamento.agendamento_id
    ).filter(
        models.Agendamento.clinica_id == clinica_id,
        models.Agendamento.data >= data_inicio,
        models.Agendamento.status == "realizado"
    ).group_by(
        models.Procedimento.nome
    ).order_by(
        func.count(models.Agendamento.id).desc()
    ).limit(limit).all()

    return [
        {
            "nome": r.nome,
            "quantidade": r.quantidade,
            "faturamento": float(r.faturamento or 0)
        }
        for r in resultados
    ]

@router.get("/dashboard/executivo/top-pacientes")
def top_pacientes(
    periodo: int = Query(30, description="Número de dias"),
    limit: int = Query(10, description="Top N pacientes"),
    clinica_id: int = Depends(get_current_clinica_id),
    db: Session = Depends(get_db)
):
    """Pacientes que mais gastaram"""
    data_inicio = date.today() - timedelta(days=periodo)

    resultados = db.query(
        models.Paciente.nome,
        models.Paciente.telefone,
        func.sum(models.Pagamento.valor_final).label('total_gasto'),
        func.count(models.Pagamento.id).label('num_pagamentos')
    ).join(
        models.Pagamento, models.Paciente.id == models.Pagamento.paciente_id
    ).filter(
        models.Paciente.clinica_id == clinica_id,
        models.Pagamento.status == "APROVADO",
        models.Pagamento.data_pagamento >= data_inicio
    ).group_by(
        models.Paciente.id, models.Paciente.nome, models.Paciente.telefone
    ).order_by(
        func.sum(models.Pagamento.valor_final).desc()
    ).limit(limit).all()

    return [
        {
            "nome": r.nome,
            "telefone": r.telefone,
            "total_gasto": float(r.total_gasto),
            "num_pagamentos": r.num_pagamentos
        }
        for r in resultados
    ]

@router.get("/dashboard/executivo/comparativo")
def comparativo(
    periodo: int = Query(30, description="Número de dias para comparar"),
    clinica_id: int = Depends(get_current_clinica_id),
    db: Session = Depends(get_db)
):
    """Compara período atual com período anterior"""
    hoje = date.today()
    inicio_atual = hoje - timedelta(days=periodo)
    inicio_anterior = inicio_atual - timedelta(days=periodo)

    # Faturamento
    faturamento_atual = db.query(func.sum(models.Pagamento.valor_final)).filter(
        models.Pagamento.clinica_id == clinica_id,
        models.Pagamento.status == "APROVADO",
        models.Pagamento.data_pagamento >= inicio_atual
    ).scalar() or 0.0

    faturamento_anterior = db.query(func.sum(models.Pagamento.valor_final)).filter(
        models.Pagamento.clinica_id == clinica_id,
        models.Pagamento.status == "APROVADO",
        models.Pagamento.data_pagamento >= inicio_anterior,
        models.Pagamento.data_pagamento < inicio_atual
    ).scalar() or 0.0

    # Agendamentos
    agendamentos_atual = db.query(models.Agendamento).filter(
        models.Agendamento.clinica_id == clinica_id,
        models.Agendamento.data >= inicio_atual
    ).count()

    agendamentos_anterior = db.query(models.Agendamento).filter(
        models.Agendamento.clinica_id == clinica_id,
        models.Agendamento.data >= inicio_anterior,
        models.Agendamento.data < inicio_atual
    ).count()

    # Novos leads
    leads_atual = db.query(models.Lead).filter(
        models.Lead.created_at >= inicio_atual
    ).count()

    leads_anterior = db.query(models.Lead).filter(
        models.Lead.created_at >= inicio_anterior,
        models.Lead.created_at < inicio_atual
    ).count()

    def calc_variacao(atual, anterior):
        if anterior == 0:
            return 100.0 if atual > 0 else 0.0
        return round(((atual - anterior) / anterior) * 100, 2)

    return {
        "faturamento": {
            "atual": float(faturamento_atual),
            "anterior": float(faturamento_anterior),
            "variacao": calc_variacao(faturamento_atual, faturamento_anterior)
        },
        "agendamentos": {
            "atual": agendamentos_atual,
            "anterior": agendamentos_anterior,
            "variacao": calc_variacao(agendamentos_atual, agendamentos_anterior)
        },
        "leads": {
            "atual": leads_atual,
            "anterior": leads_anterior,
            "variacao": calc_variacao(leads_atual, leads_anterior)
        }
    }
