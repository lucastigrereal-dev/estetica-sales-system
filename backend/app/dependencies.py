"""
Dependências FastAPI para Multi-Tenancy e Autenticação

Fornece dependency injection para extração de clinica_id
e validação de acesso aos recursos.
"""

from fastapi import Header, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import Optional
from .database import get_db
from .models import Clinica


async def get_current_clinica_id(
    x_clinica_id: Optional[int] = Header(None, description="ID da clínica (multi-tenant)")
) -> int:
    """
    Extrai o clinica_id do header HTTP.

    Em produção, este ID deve vir de um JWT token após autenticação.
    Por enquanto, aceita do header X-Clinica-Id para simplificar desenvolvimento.

    Args:
        x_clinica_id: ID da clínica no header

    Returns:
        ID da clínica autenticada

    Raises:
        HTTPException: Se clinica_id não for fornecido ou for inválido
    """
    if not x_clinica_id or x_clinica_id <= 0:
        raise HTTPException(
            status_code=401,
            detail="Clínica não autenticada. Forneça o header X-Clinica-Id."
        )
    return x_clinica_id


async def get_current_clinica(
    clinica_id: int = Depends(get_current_clinica_id),
    db: Session = Depends(get_db)
) -> Clinica:
    """
    Busca a clínica atual do banco de dados.

    Args:
        clinica_id: ID da clínica (injetado por get_current_clinica_id)
        db: Sessão do banco de dados

    Returns:
        Objeto Clinica completo

    Raises:
        HTTPException: Se clínica não existir no banco
    """
    clinica = db.query(Clinica).filter(Clinica.id == clinica_id).first()

    if not clinica:
        raise HTTPException(
            status_code=404,
            detail=f"Clínica com ID {clinica_id} não encontrada."
        )

    return clinica


def verify_clinica_ownership(resource_clinica_id: int, current_clinica_id: int):
    """
    Verifica se um recurso pertence à clínica atual.

    Útil para validar acesso a recursos específicos (pagamentos, pacientes, etc.)

    Args:
        resource_clinica_id: ID da clínica dona do recurso
        current_clinica_id: ID da clínica atual autenticada

    Raises:
        HTTPException: Se as clínicas não corresponderem (acesso negado)
    """
    if resource_clinica_id != current_clinica_id:
        raise HTTPException(
            status_code=403,
            detail="Acesso negado. Este recurso pertence a outra clínica."
        )
