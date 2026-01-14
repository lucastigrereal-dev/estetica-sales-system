from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from typing import List, Optional
from datetime import datetime, date
from .. import models, schemas
from ..database import get_db
from ..dependencies import get_current_clinica_id, get_current_clinica
from ..services.factory import get_gerencianet_service, get_asaas_service

router = APIRouter()

@router.get("/pagamentos", response_model=List[schemas.PagamentoResponse])
def list_pagamentos(
    status: Optional[str] = None,
    metodo: Optional[str] = None,
    data_inicio: Optional[date] = None,
    data_fim: Optional[date] = None,
    paciente_id: Optional[int] = None,
    limit: int = Query(50, le=100),
    offset: int = 0,
    clinica_id: int = Depends(get_current_clinica_id),
    db: Session = Depends(get_db)
):
    """Lista pagamentos com filtros"""
    query = db.query(models.Pagamento).filter(models.Pagamento.clinica_id == clinica_id)

    if status:
        query = query.filter(models.Pagamento.status == status)
    if metodo:
        query = query.filter(models.Pagamento.metodo == metodo)
    if paciente_id:
        query = query.filter(models.Pagamento.paciente_id == paciente_id)
    if data_inicio:
        query = query.filter(models.Pagamento.created_at >= data_inicio)
    if data_fim:
        query = query.filter(models.Pagamento.created_at <= data_fim)

    return query.order_by(models.Pagamento.created_at.desc()).offset(offset).limit(limit).all()

@router.get("/pagamentos/{id}", response_model=schemas.PagamentoResponse)
def get_pagamento(
    id: int,
    clinica_id: int = Depends(get_current_clinica_id),
    db: Session = Depends(get_db)
):
    """Detalhes de um pagamento"""
    pagamento = db.query(models.Pagamento).filter(
        models.Pagamento.id == id,
        models.Pagamento.clinica_id == clinica_id
    ).first()

    if not pagamento:
        raise HTTPException(status_code=404, detail="Pagamento não encontrado")

    return pagamento

@router.post("/pagamentos", response_model=schemas.PagamentoResponse)
def create_pagamento(
    pagamento: schemas.PagamentoCreate,
    clinica_id: int = Depends(get_current_clinica_id),
    db: Session = Depends(get_db)
):
    """Registra pagamento manual (cartão, dinheiro)"""
    # Verificar se paciente existe e pertence à clínica
    paciente = db.query(models.Paciente).filter(
        models.Paciente.id == pagamento.paciente_id,
        models.Paciente.clinica_id == clinica_id
    ).first()

    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente não encontrado")

    # Calcular valor final
    valor_final = pagamento.valor - pagamento.desconto

    # Criar pagamento
    db_pagamento = models.Pagamento(
        **pagamento.dict(),
        clinica_id=clinica_id,
        valor_final=valor_final,
        status="APROVADO",  # Pagamento manual já é aprovado
        data_pagamento=datetime.utcnow()
    )

    db.add(db_pagamento)
    db.commit()
    db.refresh(db_pagamento)

    return db_pagamento

@router.post("/pagamentos/pix/gerencianet")
async def create_pix_gerencianet(
    data: schemas.PagamentoPixGerencianetCreate,
    clinica: models.Clinica = Depends(get_current_clinica),
    db: Session = Depends(get_db)
):
    """Gera cobrança PIX via Gerencianet"""
    # Verificar paciente
    paciente = db.query(models.Paciente).filter(
        models.Paciente.id == data.paciente_id,
        models.Paciente.clinica_id == clinica.id
    ).first()

    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente não encontrado")

    # Criar pagamento com status PENDENTE
    valor_final = data.valor - data.desconto
    db_pagamento = models.Pagamento(
        agendamento_id=data.agendamento_id,
        paciente_id=data.paciente_id,
        clinica_id=clinica.id,
        valor=data.valor,
        desconto=data.desconto,
        valor_final=valor_final,
        metodo="PIX",
        status="PENDENTE"
    )
    db.add(db_pagamento)
    db.commit()
    db.refresh(db_pagamento)

    try:
        # Inicializar serviço Gerencianet
        gn_service = get_gerencianet_service(clinica)

        # Criar cobrança
        descricao = f"Pagamento #{db_pagamento.id}"
        charge = await gn_service.create_pix_charge(
            valor=valor_final,
            descricao=descricao,
            expiracao_segundos=3600
        )

        # Gerar QR Code
        qrcode = await gn_service.generate_qr_code(charge["loc"]["id"])

        # Atualizar pagamento com dados Gerencianet
        db_pagamento.gerencianet_payment_id = charge["loc"]["id"]
        db_pagamento.gerencianet_txid = charge["txid"]
        db_pagamento.pix_code = qrcode["qrcode"]
        db.commit()

        return {
            "payment_id": db_pagamento.id,
            "pix_code": qrcode["qrcode"],
            "qr_code_base64": qrcode.get("imagemQrcode", ""),
            "loc_id": charge["loc"]["id"],
            "expiracao": 3600
        }

    except Exception as e:
        # Marcar pagamento como recusado
        db_pagamento.status = "RECUSADO"
        db_pagamento.observacoes = f"Erro ao gerar PIX: {str(e)}"
        db.commit()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/pagamentos/asaas")
async def create_pagamento_asaas(
    data: schemas.PagamentoAsaasCreate,
    clinica: models.Clinica = Depends(get_current_clinica),
    db: Session = Depends(get_db)
):
    """Cria cobrança via Asaas (PIX ou Boleto)"""
    # Verificar paciente
    paciente = db.query(models.Paciente).filter(
        models.Paciente.id == data.paciente_id,
        models.Paciente.clinica_id == clinica.id
    ).first()

    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente não encontrado")

    # Validar due_date para boleto
    if data.tipo == "BOLETO" and not data.due_date:
        raise HTTPException(status_code=400, detail="due_date é obrigatório para boleto")

    # Criar pagamento
    valor_final = data.valor - data.desconto
    metodo = "PIX" if data.tipo == "PIX" else "BOLETO"

    db_pagamento = models.Pagamento(
        agendamento_id=data.agendamento_id,
        paciente_id=data.paciente_id,
        clinica_id=clinica.id,
        valor=data.valor,
        desconto=data.desconto,
        valor_final=valor_final,
        metodo=metodo,
        status="PENDENTE"
    )
    db.add(db_pagamento)
    db.commit()
    db.refresh(db_pagamento)

    try:
        # Inicializar serviço Asaas
        asaas_service = get_asaas_service(clinica)

        # Criar/buscar cliente (usar telefone como CPF provisório se não tiver)
        cpf_cnpj = paciente.telefone.replace("(", "").replace(")", "").replace("-", "").replace(" ", "")
        customer = await asaas_service.create_customer(
            name=paciente.nome,
            cpf_cnpj=cpf_cnpj,
            email=paciente.email,
            phone=paciente.telefone
        )

        # Criar cobrança
        due_date_str = data.due_date or datetime.now().strftime("%Y-%m-%d")
        payment = await asaas_service.create_payment(
            customer_id=customer["id"],
            value=valor_final,
            due_date=due_date_str,
            billing_type=data.tipo,
            description=f"Pagamento #{db_pagamento.id}",
            external_reference=str(db_pagamento.id)
        )

        # Atualizar pagamento
        db_pagamento.asaas_payment_id = payment["id"]
        db_pagamento.boleto_url = payment.get("invoiceUrl")

        # Se for PIX, buscar QR Code
        pix_code = None
        if data.tipo == "PIX":
            pix_data = await asaas_service.get_pix_qrcode(payment["id"])
            db_pagamento.pix_code = pix_data.get("payload")
            pix_code = pix_data.get("payload")

        db.commit()

        return {
            "payment_id": db_pagamento.id,
            "asaas_payment_id": payment["id"],
            "invoice_url": payment.get("invoiceUrl"),
            "pix_code": pix_code,
            "boleto_barcode": payment.get("identificationField")
        }

    except Exception as e:
        db_pagamento.status = "RECUSADO"
        db_pagamento.observacoes = f"Erro Asaas: {str(e)}"
        db.commit()
        raise HTTPException(status_code=500, detail=str(e))
