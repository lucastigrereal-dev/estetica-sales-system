from fastapi import APIRouter, Depends, Query, HTTPException
from fastapi.responses import FileResponse, StreamingResponse
from sqlalchemy.orm import Session
from datetime import date, datetime
from typing import Optional
import io
from .. import models
from ..database import get_db
from ..dependencies import get_current_clinica_id
from ..services.relatorio_service import RelatorioService

router = APIRouter()

@router.get("/relatorios/mensal/pdf")
async def gerar_relatorio_mensal(
    mes: int = Query(..., ge=1, le=12),
    ano: int = Query(..., ge=2020, le=2030),
    clinica_id: int = Depends(get_current_clinica_id),
    db: Session = Depends(get_db)
):
    """Gera relatório mensal em PDF"""
    try:
        clinica = db.query(models.Clinica).filter(models.Clinica.id == clinica_id).first()
        if not clinica:
            raise HTTPException(status_code=404, detail="Clínica não encontrada")

        service = RelatorioService(db, clinica_id)
        pdf_buffer = await service.gerar_relatorio_mensal_pdf(mes, ano, clinica.nome)

        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=relatorio_{ano}_{mes:02d}.pdf"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/relatorios/agendamentos/excel")
async def exportar_agendamentos(
    data_inicio: Optional[date] = None,
    data_fim: Optional[date] = None,
    status: Optional[str] = None,
    clinica_id: int = Depends(get_current_clinica_id),
    db: Session = Depends(get_db)
):
    """Exporta agendamentos para Excel"""
    try:
        service = RelatorioService(db, clinica_id)
        excel_buffer = await service.exportar_agendamentos_excel(data_inicio, data_fim, status)

        return StreamingResponse(
            excel_buffer,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={
                "Content-Disposition": f"attachment; filename=agendamentos_{datetime.now().strftime('%Y%m%d')}.xlsx"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/relatorios/pacientes/excel")
async def exportar_pacientes(
    nome: Optional[str] = None,
    clinica_id: int = Depends(get_current_clinica_id),
    db: Session = Depends(get_db)
):
    """Exporta pacientes para Excel"""
    try:
        service = RelatorioService(db, clinica_id)
        excel_buffer = await service.exportar_pacientes_excel(nome)

        return StreamingResponse(
            excel_buffer,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={
                "Content-Disposition": f"attachment; filename=pacientes_{datetime.now().strftime('%Y%m%d')}.xlsx"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/relatorios/financeiro/excel")
async def exportar_financeiro(
    data_inicio: Optional[date] = None,
    data_fim: Optional[date] = None,
    status: Optional[str] = None,
    metodo: Optional[str] = None,
    clinica_id: int = Depends(get_current_clinica_id),
    db: Session = Depends(get_db)
):
    """Exporta dados financeiros para Excel"""
    try:
        service = RelatorioService(db, clinica_id)
        excel_buffer = await service.exportar_financeiro_excel(data_inicio, data_fim, status, metodo)

        return StreamingResponse(
            excel_buffer,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={
                "Content-Disposition": f"attachment; filename=financeiro_{datetime.now().strftime('%Y%m%d')}.xlsx"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
