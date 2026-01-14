-- Migração: Adicionar Módulo Financeiro
-- Data: 2026-01-14
-- Descrição: Cria tabelas de Clinica, Pagamento, WebhookLog e adiciona clinica_id aos modelos existentes

-- ========================================
-- 1. Criar tabela de Clínicas
-- ========================================
CREATE TABLE IF NOT EXISTS clinicas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(200) NOT NULL,
    cnpj VARCHAR(14) UNIQUE NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    gerencianet_client_id_encrypted VARCHAR,
    gerencianet_client_secret_encrypted VARCHAR,
    gerencianet_pix_cert_path VARCHAR,
    gerencianet_pix_key VARCHAR,
    asaas_token_encrypted VARCHAR,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 2. Adicionar clinica_id às tabelas existentes
-- ========================================

-- Pacientes: Adicionar clinica_id
-- Nota: SQLite não suporta ADD CONSTRAINT diretamente, então vamos adicionar apenas a coluna
ALTER TABLE pacientes ADD COLUMN clinica_id INTEGER REFERENCES clinicas(id);

-- Agendamentos: Adicionar clinica_id
ALTER TABLE agendamentos ADD COLUMN clinica_id INTEGER REFERENCES clinicas(id);

-- ========================================
-- 3. Criar tabela de Pagamentos
-- ========================================
CREATE TABLE IF NOT EXISTS pagamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agendamento_id INTEGER REFERENCES agendamentos(id),
    paciente_id INTEGER NOT NULL REFERENCES pacientes(id),
    clinica_id INTEGER NOT NULL REFERENCES clinicas(id),

    -- Valores
    valor REAL NOT NULL,
    desconto REAL DEFAULT 0.0,
    valor_final REAL NOT NULL,

    -- Método e Status
    metodo VARCHAR NOT NULL CHECK(metodo IN ('CARTAO', 'PIX', 'BOLETO', 'DINHEIRO')),
    status VARCHAR NOT NULL DEFAULT 'PENDENTE' CHECK(status IN ('PENDENTE', 'APROVADO', 'RECUSADO', 'REEMBOLSADO')),

    -- Provider-specific fields
    gerencianet_payment_id VARCHAR UNIQUE,
    gerencianet_txid VARCHAR UNIQUE,
    asaas_payment_id VARCHAR UNIQUE,
    pix_code TEXT,
    boleto_url VARCHAR,

    observacoes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_pagamento DATETIME,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 4. Criar tabela de Logs de Webhooks
-- ========================================
CREATE TABLE IF NOT EXISTS webhook_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    provider VARCHAR NOT NULL CHECK(provider IN ('gerencianet', 'asaas')),
    payload TEXT NOT NULL,
    processed INTEGER DEFAULT 0,  -- SQLite usa 0/1 para boolean
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 5. Criar Índices para Performance
-- ========================================

-- Pacientes
CREATE INDEX IF NOT EXISTS idx_paciente_clinica ON pacientes(clinica_id);

-- Agendamentos
CREATE INDEX IF NOT EXISTS idx_agendamento_clinica ON agendamentos(clinica_id);

-- Pagamentos
CREATE INDEX IF NOT EXISTS idx_pagamento_clinica_status ON pagamentos(clinica_id, status);
CREATE INDEX IF NOT EXISTS idx_pagamento_clinica_created ON pagamentos(clinica_id, created_at);
CREATE INDEX IF NOT EXISTS idx_pagamento_gn_txid ON pagamentos(gerencianet_txid);
CREATE INDEX IF NOT EXISTS idx_pagamento_asaas_id ON pagamentos(asaas_payment_id);

-- ========================================
-- 6. Dados de Teste (Opcional - comentado por padrão)
-- ========================================

/*
-- Inserir clínica de teste
INSERT INTO clinicas (nome, cnpj, telefone, email)
VALUES ('Clínica de Estética Beleza Pura', '12345678000190', '11987654321', 'contato@belezapura.com');

-- Atualizar registros existentes para vincular à clínica de teste
-- ATENÇÃO: Execute apenas se quiser vincular dados existentes à primeira clínica
UPDATE pacientes SET clinica_id = 1 WHERE clinica_id IS NULL;
UPDATE agendamentos SET clinica_id = 1 WHERE clinica_id IS NULL;
*/

-- ========================================
-- Verificação
-- ========================================
-- Para verificar se as tabelas foram criadas:
-- SELECT name FROM sqlite_master WHERE type='table';
-- SELECT sql FROM sqlite_master WHERE type='table' AND name='pagamentos';
