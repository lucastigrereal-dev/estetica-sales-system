#!/usr/bin/env python3
"""
SYNC LEADS - Sistema Unificado de Vendas de Estética
=====================================================
Este script sincroniza os leads do WaCRM e WaSender para o banco de dados unificado.
Ele lê os arquivos db.db de cada ferramenta e importa para o sistema central.
"""

import sqlite3
import os
from datetime import datetime
from pathlib import Path

# Configurações de caminhos (ajuste conforme sua instalação)
CONFIG = {
    "wacrm_db": r"C:\Program Files\WaCRM\db.db",  # Caminho do WaCRM no Windows
    "wasender_db": r"C:\Program Files\WASender\db.db",  # Caminho do WaSender no Windows
    "unified_db": "./database/estetica_sales.db",  # Banco unificado
}

def connect_db(db_path):
    """Conecta ao banco de dados SQLite."""
    if not os.path.exists(db_path):
        print(f"[AVISO] Banco não encontrado: {db_path}")
        return None
    return sqlite3.connect(db_path)

def init_unified_db():
    """Inicializa o banco de dados unificado com o schema."""
    db_path = CONFIG["unified_db"]
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    
    conn = sqlite3.connect(db_path)
    
    # Lê e executa o schema
    schema_path = Path(__file__).parent.parent / "database" / "schema.sql"
    if schema_path.exists():
        with open(schema_path, 'r', encoding='utf-8') as f:
            conn.executescript(f.read())
        print("[OK] Schema do banco unificado criado/atualizado.")
    
    conn.commit()
    return conn

def sync_wacrm_sessions(unified_conn):
    """Sincroniza as sessões do WaCRM como números de WhatsApp."""
    wacrm_conn = connect_db(CONFIG["wacrm_db"])
    if not wacrm_conn:
        return
    
    cursor = wacrm_conn.cursor()
    cursor.execute("SELECT sessionName, sesionID, IsBotRunning FROM Sessions")
    sessions = cursor.fetchall()
    
    unified_cursor = unified_conn.cursor()
    for session in sessions:
        nome, session_id, bot_running = session
        # Extrai o número do session_id se possível
        numero = session_id.split('@')[0] if '@' in str(session_id) else session_id
        
        unified_cursor.execute("""
            INSERT OR IGNORE INTO numeros_whatsapp (numero, nome_perfil, tipo, status)
            VALUES (?, ?, 'atendimento', 'ativo')
        """, (numero, nome))
    
    unified_conn.commit()
    wacrm_conn.close()
    print(f"[OK] {len(sessions)} sessões do WaCRM sincronizadas.")

def sync_wacrm_reminders(unified_conn):
    """Sincroniza os lembretes do WaCRM."""
    wacrm_conn = connect_db(CONFIG["wacrm_db"])
    if not wacrm_conn:
        return
    
    cursor = wacrm_conn.cursor()
    cursor.execute("""
        SELECT Id, name, ReminderforText, day, month, year, hour, minute, status 
        FROM reminders
    """)
    reminders = cursor.fetchall()
    
    unified_cursor = unified_conn.cursor()
    for reminder in reminders:
        id_, nome, texto, dia, mes, ano, hora, minuto, status = reminder
        try:
            data_hora = datetime(ano, mes, dia, hora, minuto)
            unified_cursor.execute("""
                INSERT OR IGNORE INTO lembretes (titulo, descricao, data_hora_lembrete, status)
                VALUES (?, ?, ?, ?)
            """, (nome, texto, data_hora.isoformat(), status or 'pendente'))
        except:
            pass
    
    unified_conn.commit()
    wacrm_conn.close()
    print(f"[OK] {len(reminders)} lembretes do WaCRM sincronizados.")

def import_leads_from_excel(excel_path, unified_conn):
    """Importa leads de um arquivo Excel exportado do WaSender."""
    try:
        import pandas as pd
        df = pd.read_excel(excel_path)
        
        unified_cursor = unified_conn.cursor()
        imported = 0
        
        for _, row in df.iterrows():
            telefone = str(row.get('Phone', row.get('Telefone', ''))).strip()
            nome = str(row.get('Name', row.get('Nome', 'Lead'))).strip()
            
            if telefone:
                unified_cursor.execute("""
                    INSERT OR IGNORE INTO leads (nome, telefone, origem)
                    VALUES (?, ?, 'wasender')
                """, (nome, telefone))
                imported += 1
        
        unified_conn.commit()
        print(f"[OK] {imported} leads importados do Excel.")
    except ImportError:
        print("[ERRO] Instale pandas e openpyxl: pip install pandas openpyxl")
    except Exception as e:
        print(f"[ERRO] Falha ao importar Excel: {e}")

def get_leads_for_campaign(unified_conn, status='novo', limit=50):
    """Retorna leads para uma campanha de disparo."""
    cursor = unified_conn.cursor()
    cursor.execute("""
        SELECT lead_id, nome, telefone FROM leads 
        WHERE status = ? 
        ORDER BY data_criacao DESC 
        LIMIT ?
    """, (status, limit))
    return cursor.fetchall()

def update_lead_status(unified_conn, lead_id, new_status, observacao=None):
    """Atualiza o status de um lead."""
    cursor = unified_conn.cursor()
    cursor.execute("""
        UPDATE leads 
        SET status = ?, data_ultimo_contato = ?, observacoes = COALESCE(?, observacoes)
        WHERE lead_id = ?
    """, (new_status, datetime.now().isoformat(), observacao, lead_id))
    unified_conn.commit()

def convert_lead_to_patient(unified_conn, lead_id):
    """Converte um lead em paciente quando ele agenda."""
    cursor = unified_conn.cursor()
    
    # Busca dados do lead
    cursor.execute("SELECT nome, telefone, email FROM leads WHERE lead_id = ?", (lead_id,))
    lead = cursor.fetchone()
    
    if lead:
        nome, telefone, email = lead
        cursor.execute("""
            INSERT INTO pacientes (lead_id, nome, telefone, email)
            VALUES (?, ?, ?, ?)
        """, (lead_id, nome, telefone, email))
        
        # Atualiza status do lead
        update_lead_status(unified_conn, lead_id, 'convertido')
        
        unified_conn.commit()
        return cursor.lastrowid
    return None

def create_appointment(unified_conn, paciente_id, profissional_id, procedimento_id, data_hora):
    """Cria um agendamento no sistema."""
    cursor = unified_conn.cursor()
    
    # Busca o preço do procedimento
    cursor.execute("SELECT preco FROM procedimentos WHERE procedimento_id = ?", (procedimento_id,))
    preco = cursor.fetchone()
    valor = preco[0] if preco else 0
    
    cursor.execute("""
        INSERT INTO agendamentos (paciente_id, profissional_id, procedimento_id, data_hora, valor)
        VALUES (?, ?, ?, ?, ?)
    """, (paciente_id, profissional_id, procedimento_id, data_hora, valor))
    
    unified_conn.commit()
    return cursor.lastrowid

def main():
    """Função principal de sincronização."""
    print("=" * 50)
    print("SISTEMA UNIFICADO DE VENDAS DE ESTÉTICA")
    print("Sincronização de Dados")
    print("=" * 50)
    
    # Inicializa o banco unificado
    unified_conn = init_unified_db()
    
    # Sincroniza dados do WaCRM
    sync_wacrm_sessions(unified_conn)
    sync_wacrm_reminders(unified_conn)
    
    # Exemplo: importar leads de Excel
    # import_leads_from_excel("leads_wasender.xlsx", unified_conn)
    
    # Mostra estatísticas
    cursor = unified_conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM leads")
    total_leads = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM pacientes")
    total_pacientes = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM agendamentos WHERE status = 'agendado'")
    total_agendamentos = cursor.fetchone()[0]
    
    print("\n--- ESTATÍSTICAS ---")
    print(f"Total de Leads: {total_leads}")
    print(f"Total de Pacientes: {total_pacientes}")
    print(f"Agendamentos Pendentes: {total_agendamentos}")
    
    unified_conn.close()
    print("\n[OK] Sincronização concluída!")

if __name__ == "__main__":
    main()
