#!/usr/bin/env python3
"""
Script de Setup Inicial - Estética Sales System
Cria clínica e usuário admin automaticamente
"""

import sys
import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext
from datetime import datetime

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def print_header(title):
    print("\n" + "="*60)
    print(f"  {title}")
    print("="*60 + "\n")

def print_success(msg):
    print(f"✅ {msg}")

def print_error(msg):
    print(f"❌ {msg}")

def print_info(msg):
    print(f"ℹ️  {msg}")

def setup_database():
    """Configura banco de dados SQLite para uso local"""
    print_header("CONFIGURAÇÃO DO BANCO DE DADOS")

    # Criar diretório se não existir
    db_dir = os.path.join(os.path.dirname(__file__), "backend", "database")
    os.makedirs(db_dir, exist_ok=True)

    db_path = os.path.join(db_dir, "crm_tigre.db")
    database_url = f"sqlite:///{db_path}"

    print_info(f"Banco de dados: {db_path}")

    # Criar engine
    engine = create_engine(database_url, echo=False)

    # Criar tabelas
    print_info("Criando tabelas...")

    with engine.begin() as conn:
        # Tabela Clinica
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS clinicas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome VARCHAR(200) NOT NULL,
                cnpj VARCHAR(18) UNIQUE,
                telefone VARCHAR(20),
                email VARCHAR(100),
                endereco_completo TEXT,
                gerencianet_client_id TEXT,
                gerencianet_client_secret TEXT,
                gerencianet_certificado TEXT,
                asaas_api_key TEXT,
                sandbox_mode BOOLEAN DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """))

        # Tabela User
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                nome VARCHAR(200) NOT NULL,
                role VARCHAR(20) NOT NULL DEFAULT 'atendente',
                clinica_id INTEGER NOT NULL,
                ativo BOOLEAN DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (clinica_id) REFERENCES clinicas(id)
            )
        """))

        # Tabela Lead
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS leads (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome VARCHAR(200) NOT NULL,
                telefone VARCHAR(20),
                email VARCHAR(100),
                origem VARCHAR(50),
                interesse VARCHAR(200),
                observacoes TEXT,
                status VARCHAR(20) DEFAULT 'novo',
                paciente_id INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (paciente_id) REFERENCES pacientes(id)
            )
        """))

        # Tabela Paciente
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS pacientes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                clinica_id INTEGER NOT NULL,
                nome VARCHAR(200) NOT NULL,
                cpf VARCHAR(14) UNIQUE,
                telefone VARCHAR(20),
                email VARCHAR(100),
                data_nascimento DATE,
                endereco_completo TEXT,
                observacoes TEXT,
                lead_id INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (clinica_id) REFERENCES clinicas(id),
                FOREIGN KEY (lead_id) REFERENCES leads(id)
            )
        """))

        # Tabela Procedimento
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS procedimentos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome VARCHAR(200) NOT NULL,
                descricao TEXT,
                preco DECIMAL(10,2),
                duracao_minutos INTEGER,
                ativo BOOLEAN DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """))

        # Tabela Agendamento
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS agendamentos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                paciente_id INTEGER NOT NULL,
                procedimento_id INTEGER NOT NULL,
                clinica_id INTEGER NOT NULL,
                data_hora TIMESTAMP NOT NULL,
                profissional VARCHAR(200),
                status VARCHAR(20) DEFAULT 'pendente',
                confirmado BOOLEAN DEFAULT 0,
                observacoes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (paciente_id) REFERENCES pacientes(id),
                FOREIGN KEY (procedimento_id) REFERENCES procedimentos(id),
                FOREIGN KEY (clinica_id) REFERENCES clinicas(id)
            )
        """))

        # Tabela Pagamento
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS pagamentos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                paciente_id INTEGER NOT NULL,
                agendamento_id INTEGER,
                clinica_id INTEGER NOT NULL,
                valor_total DECIMAL(10,2) NOT NULL,
                desconto DECIMAL(10,2) DEFAULT 0,
                valor_final DECIMAL(10,2) NOT NULL,
                metodo VARCHAR(20) NOT NULL,
                status VARCHAR(20) DEFAULT 'PENDENTE',
                data_vencimento DATE,
                data_pagamento TIMESTAMP,
                observacoes TEXT,
                gerencianet_txid VARCHAR(100),
                gerencianet_loc_id VARCHAR(100),
                pix_copia_cola TEXT,
                pix_qrcode_base64 TEXT,
                asaas_payment_id VARCHAR(100),
                asaas_customer_id VARCHAR(100),
                boleto_url TEXT,
                pix_qrcode TEXT,
                provider VARCHAR(20),
                webhook_received BOOLEAN DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (paciente_id) REFERENCES pacientes(id),
                FOREIGN KEY (agendamento_id) REFERENCES agendamentos(id),
                FOREIGN KEY (clinica_id) REFERENCES clinicas(id)
            )
        """))

        # Tabela WebhookLog
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS webhook_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                provider VARCHAR(20) NOT NULL,
                event_type VARCHAR(50) NOT NULL,
                payload TEXT,
                processed BOOLEAN DEFAULT 0,
                payment_id INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (payment_id) REFERENCES pagamentos(id)
            )
        """))

    print_success("Tabelas criadas com sucesso!")

    return engine

def create_procedimentos(engine):
    """Cria procedimentos padrão"""
    print_header("CRIANDO PROCEDIMENTOS PADRÃO")

    procedimentos = [
        ("Botox", "Toxina botulínica para rugas", 800.00, 30),
        ("Preenchimento Labial", "Preenchimento com ácido hialurônico", 1200.00, 45),
        ("Harmonização Facial", "Harmonização facial completa", 2500.00, 90),
        ("Peeling Químico", "Peeling químico facial", 500.00, 60),
        ("Limpeza de Pele", "Limpeza de pele profunda", 150.00, 60),
        ("Microagulhamento", "Microagulhamento facial", 400.00, 45),
        ("Skinbooster", "Skinbooster facial", 800.00, 30),
        ("Lipo de Papada", "Lipoaspiração de papada", 3000.00, 120),
    ]

    with engine.begin() as conn:
        for nome, desc, preco, duracao in procedimentos:
            conn.execute(text("""
                INSERT INTO procedimentos (nome, descricao, preco, duracao_minutos, ativo)
                VALUES (:nome, :desc, :preco, :duracao, 1)
            """), {"nome": nome, "desc": desc, "preco": preco, "duracao": duracao})

    print_success(f"{len(procedimentos)} procedimentos criados!")

def create_clinica(engine):
    """Cria clínica inicial"""
    print_header("CRIANDO CLÍNICA")

    print("Dados da Clínica:")
    nome = input("Nome da clínica: ").strip() or "Minha Clínica de Estética"
    cnpj = input("CNPJ (opcional): ").strip() or None
    telefone = input("Telefone: ").strip() or "11999999999"
    email = input("Email: ").strip() or "contato@clinica.com"
    endereco = input("Endereço completo: ").strip() or "Rua X, 123"

    with engine.begin() as conn:
        result = conn.execute(text("""
            INSERT INTO clinicas (nome, cnpj, telefone, email, endereco_completo, sandbox_mode)
            VALUES (:nome, :cnpj, :telefone, :email, :endereco, 1)
        """), {
            "nome": nome,
            "cnpj": cnpj,
            "telefone": telefone,
            "email": email,
            "endereco": endereco
        })
        clinica_id = result.lastrowid

    print_success(f"Clínica '{nome}' criada com ID {clinica_id}!")
    return clinica_id

def create_admin_user(engine, clinica_id):
    """Cria usuário admin"""
    print_header("CRIANDO USUÁRIO ADMINISTRADOR")

    print("Dados do Administrador:")
    nome = input("Nome completo: ").strip() or "Administrador"
    email = input("Email de login: ").strip() or "admin@clinica.com"

    # Senha
    while True:
        senha = input("Senha (mínimo 6 caracteres): ").strip()
        if len(senha) >= 6:
            senha_confirm = input("Confirme a senha: ").strip()
            if senha == senha_confirm:
                break
            else:
                print_error("Senhas não conferem. Tente novamente.")
        else:
            print_error("Senha muito curta. Mínimo 6 caracteres.")

    # Hash da senha
    password_hash = pwd_context.hash(senha)

    with engine.begin() as conn:
        conn.execute(text("""
            INSERT INTO users (email, password_hash, nome, role, clinica_id, ativo)
            VALUES (:email, :password_hash, :nome, 'admin', :clinica_id, 1)
        """), {
            "email": email,
            "password_hash": password_hash,
            "nome": nome,
            "clinica_id": clinica_id
        })

    print_success(f"Usuário admin '{email}' criado com sucesso!")
    return email

def print_final_instructions(email):
    """Imprime instruções finais"""
    print_header("✨ SETUP CONCLUÍDO COM SUCESSO! ✨")

    print("""
🎯 PRÓXIMOS PASSOS:

1. INICIAR O SISTEMA:

   Opção A - Docker (Recomendado):
   ---------------------------------
   docker-compose up -d

   Acesse:
   - Frontend: http://localhost
   - Backend API: http://localhost:8000
   - Docs API: http://localhost:8000/docs


   Opção B - Local (Desenvolvimento):
   -----------------------------------

   Terminal 1 (Backend):
   cd backend
   pip install -r requirements.txt
   uvicorn app.main:app --reload

   Terminal 2 (Frontend):
   cd crm-tigre/frontend
   npm install
   npm start

   Acesse:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000


2. FAZER LOGIN:
   ---------------------------------
   Email: {email}
   Senha: (a senha que você definiu)


3. CONFIGURAR PAGAMENTOS (Opcional):
   ---------------------------------
   - Vá em Configurações > Credenciais
   - Adicione suas chaves Gerencianet ou Asaas
   - Ative/desative modo sandbox


4. COMEÇAR A USAR:
   ---------------------------------
   ✅ Cadastrar leads
   ✅ Converter leads em pacientes
   ✅ Agendar procedimentos
   ✅ Gerar pagamentos PIX/Boleto
   ✅ Visualizar dashboard e relatórios


📚 DOCUMENTAÇÃO:
   - API Docs: http://localhost:8000/docs
   - Relatório técnico: SDRPREMIUM.md


🆘 SUPORTE:
   - GitHub Issues: https://github.com/lucastigrereal-dev/estetica-sales-system/issues

""".format(email=email))

def main():
    """Função principal"""
    print_header("🚀 SETUP INICIAL - ESTÉTICA SALES SYSTEM")

    try:
        # 1. Setup Database
        engine = setup_database()

        # 2. Criar Procedimentos
        create_procedimentos(engine)

        # 3. Criar Clínica
        clinica_id = create_clinica(engine)

        # 4. Criar Admin
        admin_email = create_admin_user(engine, clinica_id)

        # 5. Instruções Finais
        print_final_instructions(admin_email)

    except Exception as e:
        print_error(f"Erro durante setup: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
