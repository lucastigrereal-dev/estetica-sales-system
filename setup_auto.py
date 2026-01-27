#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Setup Automatico - Estetica Sales System
Cria configuracao padrao sem interacao
"""

import sys
import os
from sqlalchemy import create_engine, text
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def setup():
    print("INICIANDO SETUP AUTOMATICO...")
    print("="*60)

    # Criar diretorio
    db_dir = os.path.join(os.path.dirname(__file__), "backend", "database")
    os.makedirs(db_dir, exist_ok=True)

    db_path = os.path.join(db_dir, "crm_tigre.db")
    database_url = f"sqlite:///{db_path}"

    print(f"\n[OK] Banco de dados: {db_path}")

    engine = create_engine(database_url, echo=False)

    # Criar tabelas
    print("\n[INFO] Criando tabelas...")

    with engine.begin() as conn:
        # Clinica
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

        # User
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

        # Lead
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
                score INTEGER DEFAULT 0,
                temperatura VARCHAR(20) DEFAULT 'frio',
                paciente_id INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (paciente_id) REFERENCES pacientes(id)
            )
        """))

        # Paciente
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

        # Procedimento
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

        # Agendamento
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

        # Pagamento
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

        # WebhookLog
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

    print("[OK] 8 tabelas criadas com sucesso!")

    # Procedimentos
    print("\n[INFO] Criando procedimentos padrao...")
    procedimentos = [
        ("Botox", "Toxina botulinica para rugas", 800.00, 30),
        ("Preenchimento Labial", "Preenchimento com acido hialuronico", 1200.00, 45),
        ("Harmonizacao Facial", "Harmonizacao facial completa", 2500.00, 90),
        ("Peeling Quimico", "Peeling quimico facial", 500.00, 60),
        ("Limpeza de Pele", "Limpeza de pele profunda", 150.00, 60),
        ("Microagulhamento", "Microagulhamento facial", 400.00, 45),
        ("Skinbooster", "Skinbooster facial", 800.00, 30),
        ("Lipo de Papada", "Lipoaspiracao de papada", 3000.00, 120),
    ]

    with engine.begin() as conn:
        for nome, desc, preco, duracao in procedimentos:
            conn.execute(text("""
                INSERT INTO procedimentos (nome, descricao, preco, duracao_minutos, ativo)
                VALUES (:nome, :desc, :preco, :duracao, 1)
            """), {"nome": nome, "desc": desc, "preco": preco, "duracao": duracao})

    print(f"[OK] {len(procedimentos)} procedimentos cadastrados!")

    # Clinica
    print("\n[INFO] Criando clinica padrao...")
    clinica_nome = "Minha Clinica de Estetica"

    with engine.begin() as conn:
        result = conn.execute(text("""
            INSERT INTO clinicas (nome, telefone, email, endereco_completo, sandbox_mode)
            VALUES (:nome, :telefone, :email, :endereco, 1)
        """), {
            "nome": clinica_nome,
            "telefone": "11999999999",
            "email": "contato@clinica.com",
            "endereco": "Rua Exemplo, 123 - Sao Paulo/SP"
        })
        clinica_id = result.lastrowid

    print(f"[OK] Clinica '{clinica_nome}' criada (ID: {clinica_id})")

    # Admin
    print("\n[INFO] Criando usuario administrador...")
    admin_email = "admin@clinica.com"
    admin_senha = "admin123"
    password_hash = pwd_context.hash(admin_senha)

    with engine.begin() as conn:
        conn.execute(text("""
            INSERT INTO users (email, password_hash, nome, role, clinica_id, ativo)
            VALUES (:email, :password_hash, :nome, 'admin', :clinica_id, 1)
        """), {
            "email": admin_email,
            "password_hash": password_hash,
            "nome": "Administrador",
            "clinica_id": clinica_id
        })

    print(f"[OK] Usuario admin criado!")

    # Resumo final
    print("\n" + "="*60)
    print("SETUP CONCLUIDO COM SUCESSO!")
    print("="*60)

    print(f"""
DADOS DE ACESSO:

Clinica: {clinica_nome}
Email: {admin_email}
Senha: {admin_senha}

Banco de dados: {db_path}

Procedimentos cadastrados: {len(procedimentos)}
- Botox (R$ 800)
- Preenchimento Labial (R$ 1.200)
- Harmonizacao Facial (R$ 2.500)
- Peeling Quimico (R$ 500)
- Limpeza de Pele (R$ 150)
- Microagulhamento (R$ 400)
- Skinbooster (R$ 800)
- Lipo de Papada (R$ 3.000)

PROXIMO PASSO:

Opcao 1 - Docker:
------------------
docker-compose up -d

Acesse: http://localhost


Opcao 2 - Local:
------------------
# Terminal 1 (Backend)
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# Terminal 2 (Frontend)
cd crm-tigre/frontend
npm install
npm start

Acesse: http://localhost:3000


Documentacao:
- START.md - Guia rapido
- README.md - Overview completo
- http://localhost:8000/docs - API Docs

""")

    print("="*60)

if __name__ == "__main__":
    try:
        setup()
    except Exception as e:
        print(f"\nERRO: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
