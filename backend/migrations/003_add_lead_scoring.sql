-- Migration: Add Lead Scoring Fields
-- Data: 2026-01-25
-- Descrição: Adiciona campos de scoring e tracking de engajamento em Leads

-- Adicionar campos de scoring
ALTER TABLE leads ADD COLUMN score INTEGER DEFAULT 0;
ALTER TABLE leads ADD COLUMN temperature VARCHAR(10) DEFAULT 'cold';

-- Adicionar campos de tracking
ALTER TABLE leads ADD COLUMN replied_to_campaign BOOLEAN DEFAULT 0;
ALTER TABLE leads ADD COLUMN opened_messages INTEGER DEFAULT 0;
ALTER TABLE leads ADD COLUMN requested_appointment BOOLEAN DEFAULT 0;
ALTER TABLE leads ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP;

-- Criar índices para performance
CREATE INDEX idx_lead_score ON leads(score DESC);
CREATE INDEX idx_lead_temperature ON leads(temperature);
CREATE INDEX idx_lead_status_temperature ON leads(status, temperature);

-- Comentários
COMMENT ON COLUMN leads.score IS 'Pontuação do lead (0-100)';
COMMENT ON COLUMN leads.temperature IS 'Temperatura: hot (>=70), warm (>=40), cold (<40)';
COMMENT ON COLUMN leads.replied_to_campaign IS 'Lead respondeu a alguma campanha?';
COMMENT ON COLUMN leads.opened_messages IS 'Quantidade de mensagens abertas';
COMMENT ON COLUMN leads.requested_appointment IS 'Lead solicitou agendamento?';

-- Atualizar scores iniciais de todos os leads existentes
-- (Executar via Python: POST /api/leads/bulk-recalculate-scores)
