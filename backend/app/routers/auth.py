from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from typing import Optional
import os

from ..database import get_db
from ..models import User, Clinica
from ..schemas import UserCreate, UserResponse, Token, TokenData, UserLogin

router = APIRouter()

# Configurações JWT
SECRET_KEY = os.getenv("SECRET_KEY", "seu-secret-key-super-seguro-mude-em-producao")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 horas

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica se a senha corresponde ao hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Gera hash da senha"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Cria token JWT"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    """Obtém usuário atual do token JWT"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciais inválidas",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception

    if not user.ativo:
        raise HTTPException(status_code=400, detail="Usuário inativo")

    return user

def require_role(*roles: str):
    """Decorator para verificar permissões"""
    def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Acesso negado. Requer role: {', '.join(roles)}"
            )
        return current_user
    return role_checker

@router.post("/auth/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Registra novo usuário no sistema
    """
    # Verifica se email já existe
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email já cadastrado")

    # Verifica se clínica existe
    clinica = db.query(Clinica).filter(Clinica.id == user_data.clinica_id).first()
    if not clinica:
        raise HTTPException(status_code=404, detail="Clínica não encontrada")

    # Cria usuário
    hashed_password = get_password_hash(user_data.password)
    user = User(
        email=user_data.email,
        password_hash=hashed_password,
        nome=user_data.nome,
        role=user_data.role,
        clinica_id=user_data.clinica_id
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user

@router.post("/auth/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Login com email e senha. Retorna token JWT.

    - **username**: Email do usuário
    - **password**: Senha
    """
    # Busca usuário por email
    user = db.query(User).filter(User.email == form_data.username).first()

    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.ativo:
        raise HTTPException(status_code=400, detail="Usuário inativo")

    # Cria token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={
            "sub": str(user.id),
            "email": user.email,
            "clinica_id": user.clinica_id,
            "role": user.role
        },
        expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "nome": user.nome,
            "role": user.role,
            "clinica_id": user.clinica_id
        }
    }

@router.post("/auth/login/json", response_model=Token)
def login_json(credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Login com email e senha via JSON.

    - **email**: Email do usuário
    - **password**: Senha
    """
    # Busca usuário por email
    user = db.query(User).filter(User.email == credentials.email).first()

    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.ativo:
        raise HTTPException(status_code=400, detail="Usuário inativo")

    # Cria token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={
            "sub": str(user.id),
            "email": user.email,
            "clinica_id": user.clinica_id,
            "role": user.role
        },
        expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "nome": user.nome,
            "role": user.role,
            "clinica_id": user.clinica_id
        }
    }

@router.get("/auth/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """
    Retorna dados do usuário logado
    """
    return current_user

@router.get("/auth/users", response_model=list[UserResponse])
def list_users(
    current_user: User = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    """
    Lista todos os usuários da clínica (apenas admin)
    """
    users = db.query(User).filter(User.clinica_id == current_user.clinica_id).all()
    return users

@router.put("/auth/users/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    updates: dict,
    current_user: User = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    """
    Atualiza usuário (apenas admin)
    """
    user = db.query(User).filter(
        User.id == user_id,
        User.clinica_id == current_user.clinica_id
    ).first()

    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    # Atualiza campos permitidos
    if "nome" in updates:
        user.nome = updates["nome"]
    if "role" in updates:
        user.role = updates["role"]
    if "ativo" in updates:
        user.ativo = updates["ativo"]
    if "password" in updates:
        user.password_hash = get_password_hash(updates["password"])

    db.commit()
    db.refresh(user)

    return user
