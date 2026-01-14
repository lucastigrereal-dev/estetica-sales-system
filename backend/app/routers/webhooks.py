from fastapi import APIRouter, Depends, HTTPException, Request, Header
from sqlalchemy.orm import Session
from datetime import datetime
from .. import models
from ..database import get_db
from ..services.factory import get_gerencianet_service

router = APIRouter()

@router.post("/pagamentos/webhook/gerencianet")
async def webhook_gerencianet(
    request: Request,
    db: Session = Depends(get_db)
):
    """Processa webhook Gerencianet"""
    try:
        body = await request.json()

        # Log do webhook
        log = models.WebhookLog(
            provider="gerencianet",
            payload=str(body),
            processed=False
        )
        db.add(log)
        db.commit()

        # Verificar evento de teste
        if body.get("evento") == "teste_webhook":
            log.processed = True
            db.commit()
            return {"ok": True}

        # Processar pagamentos PIX
        if "pix" in body:
            for pix in body["pix"]:
                txid = pix.get("txid")
                if not txid:
                    continue

                # Buscar pagamento pelo txid
                pagamento = db.query(models.Pagamento).filter(
                    models.Pagamento.gerencianet_txid == txid
                ).first()

                if not pagamento:
                    continue

                # Buscar clínica para obter service
                clinica = db.query(models.Clinica).filter(
                    models.Clinica.id == pagamento.clinica_id
                ).first()

                if not clinica:
                    continue

                try:
                    # Consultar detalhes da cobrança
                    gn_service = get_gerencianet_service(clinica)
                    details = await gn_service.get_charge_details(txid)

                    # Se pagamento foi confirmado, atualizar
                    if details.get("status") == "CONCLUIDA":
                        if pagamento.status != "APROVADO":
                            pagamento.status = "APROVADO"
                            pagamento.data_pagamento = datetime.utcnow()
                            db.commit()

                except Exception as e:
                    print(f"Erro ao processar webhook: {str(e)}")
                    continue

        log.processed = True
        db.commit()

        return {"ok": True}

    except Exception as e:
        print(f"Erro webhook Gerencianet: {str(e)}")
        return {"ok": False, "error": str(e)}

@router.post("/pagamentos/webhook/asaas")
async def webhook_asaas(
    request: Request,
    asaas_access_token: str = Header(None),
    db: Session = Depends(get_db)
):
    """Processa webhook Asaas"""
    try:
        body = await request.json()

        # Log do webhook
        log = models.WebhookLog(
            provider="asaas",
            payload=str(body),
            processed=False
        )
        db.add(log)
        db.commit()

        # Extrair dados do evento
        event = body.get("event")
        payment_data = body.get("payment", {})
        payment_id = payment_data.get("id")

        if not payment_id:
            log.processed = True
            db.commit()
            return {"ok": True}

        # Buscar pagamento
        pagamento = db.query(models.Pagamento).filter(
            models.Pagamento.asaas_payment_id == payment_id
        ).first()

        if not pagamento:
            log.processed = True
            db.commit()
            return {"ok": True}

        # Mapear eventos para status
        status_map = {
            "PAYMENT_RECEIVED": "APROVADO",
            "PAYMENT_CONFIRMED": "APROVADO",
            "PAYMENT_OVERDUE": "PENDENTE",
            "PAYMENT_DELETED": "RECUSADO",
            "PAYMENT_REFUNDED": "REEMBOLSADO",
            "PAYMENT_REFUND_IN_PROGRESS": "REEMBOLSADO"
        }

        new_status = status_map.get(event)
        if new_status and pagamento.status != new_status:
            pagamento.status = new_status
            if new_status == "APROVADO":
                pagamento.data_pagamento = datetime.utcnow()
            db.commit()

        log.processed = True
        db.commit()

        return {"ok": True}

    except Exception as e:
        print(f"Erro webhook Asaas: {str(e)}")
        return {"ok": False, "error": str(e)}
