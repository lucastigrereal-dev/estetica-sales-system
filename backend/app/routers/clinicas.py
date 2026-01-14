from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db
from ..utils.encryption import encryption_service

router = APIRouter()

@router.post("/clinicas", response_model=schemas.ClinicaResponse)
def create_clinica(
    clinica: schemas.ClinicaCreate,
    db: Session = Depends(get_db)
):
    """Cria nova clínica"""
    # Verificar CNPJ duplicado
    existing = db.query(models.Clinica).filter(models.Clinica.cnpj == clinica.cnpj).first()
    if existing:
        raise HTTPException(status_code=400, detail="CNPJ já cadastrado")

    # Criptografar credenciais
    db_clinica = models.Clinica(
        nome=clinica.nome,
        cnpj=clinica.cnpj,
        telefone=clinica.telefone,
        email=clinica.email,
        gerencianet_client_id_encrypted=encryption_service.encrypt(clinica.gerencianet_client_id) if clinica.gerencianet_client_id else None,
        gerencianet_client_secret_encrypted=encryption_service.encrypt(clinica.gerencianet_client_secret) if clinica.gerencianet_client_secret else None,
        gerencianet_pix_cert_path=clinica.gerencianet_pix_cert_path,
        gerencianet_pix_key=clinica.gerencianet_pix_key,
        asaas_token_encrypted=encryption_service.encrypt(clinica.asaas_token) if clinica.asaas_token else None
    )

    db.add(db_clinica)
    db.commit()
    db.refresh(db_clinica)

    return db_clinica

@router.get("/clinicas/{id}", response_model=schemas.ClinicaResponse)
def get_clinica(id: int, db: Session = Depends(get_db)):
    """Busca clínica por ID"""
    clinica = db.query(models.Clinica).filter(models.Clinica.id == id).first()
    if not clinica:
        raise HTTPException(status_code=404, detail="Clínica não encontrada")
    return clinica

@router.put("/clinicas/{id}", response_model=schemas.ClinicaResponse)
def update_clinica(
    id: int,
    clinica_update: schemas.ClinicaUpdate,
    db: Session = Depends(get_db)
):
    """Atualiza clínica"""
    db_clinica = db.query(models.Clinica).filter(models.Clinica.id == id).first()
    if not db_clinica:
        raise HTTPException(status_code=404, detail="Clínica não encontrada")

    # Atualizar campos
    update_data = clinica_update.dict(exclude_unset=True)

    # Criptografar credenciais se fornecidas
    if "gerencianet_client_id" in update_data and update_data["gerencianet_client_id"]:
        db_clinica.gerencianet_client_id_encrypted = encryption_service.encrypt(update_data["gerencianet_client_id"])
    if "gerencianet_client_secret" in update_data and update_data["gerencianet_client_secret"]:
        db_clinica.gerencianet_client_secret_encrypted = encryption_service.encrypt(update_data["gerencianet_client_secret"])
    if "asaas_token" in update_data and update_data["asaas_token"]:
        db_clinica.asaas_token_encrypted = encryption_service.encrypt(update_data["asaas_token"])

    # Atualizar outros campos
    for field in ["nome", "telefone", "email", "gerencianet_pix_cert_path", "gerencianet_pix_key"]:
        if field in update_data:
            setattr(db_clinica, field, update_data[field])

    db.commit()
    db.refresh(db_clinica)

    return db_clinica
