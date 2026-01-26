"""
Script para criar o primeiro usuário admin

Uso:
    python create_admin.py
"""

import sys
import os

# Adiciona o diretório pai ao path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal, engine
from app.models import User, Clinica, Base
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_admin_user():
    """Cria usuário admin e clínica inicial"""

    # Cria tabelas
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        # Verifica se já existe admin
        existing_admin = db.query(User).filter(User.role == "admin").first()
        if existing_admin:
            print("❌ Já existe um usuário admin no sistema!")
            print(f"   Email: {existing_admin.email}")
            return

        # Verifica se existe clínica
        clinica = db.query(Clinica).first()
        if not clinica:
            print("\n📋 Criando clínica padrão...")
            clinica = Clinica(
                nome="Clínica Estética Premium",
                cnpj="12345678000190",
                telefone="11987654321",
                email="contato@clinica.com"
            )
            db.add(clinica)
            db.commit()
            db.refresh(clinica)
            print(f"✅ Clínica criada: {clinica.nome} (ID: {clinica.id})")

        # Coleta dados do admin
        print("\n👤 Criar primeiro usuário ADMIN\n")

        email = input("Email do admin: ").strip()
        if not email:
            print("❌ Email não pode ser vazio!")
            return

        nome = input("Nome completo: ").strip()
        if not nome:
            print("❌ Nome não pode ser vazio!")
            return

        senha = input("Senha (mínimo 8 caracteres): ").strip()
        if len(senha) < 8:
            print("❌ Senha deve ter no mínimo 8 caracteres!")
            return

        # Cria usuário
        print("\n🔐 Criando usuário admin...")
        password_hash = pwd_context.hash(senha)

        admin = User(
            email=email,
            password_hash=password_hash,
            nome=nome,
            role="admin",
            clinica_id=clinica.id,
            ativo=True
        )

        db.add(admin)
        db.commit()
        db.refresh(admin)

        print("\n✅ Usuário admin criado com sucesso!")
        print(f"\n📧 Email: {admin.email}")
        print(f"👤 Nome: {admin.nome}")
        print(f"🏥 Clínica: {clinica.nome}")
        print(f"🔑 Role: {admin.role}")
        print(f"\n🚀 Agora você pode fazer login em /api/auth/login")
        print(f"📖 Documentação: http://localhost:8000/docs")

    except Exception as e:
        print(f"\n❌ Erro ao criar usuário: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("=" * 60)
    print("  CRIAR USUÁRIO ADMIN - ESTÉTICA SALES SYSTEM")
    print("=" * 60)
    create_admin_user()
