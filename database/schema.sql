-- ============================================
-- SISTEMA UNIFICADO DE VENDAS DE ESTÉTICA
-- Banco de Dados Integrado
-- ============================================

-- Tabela de Leads (Prospecção via WaSender/WaCRM)
CREATE TABLE IF NOT EXISTS leads (
    lead_id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    telefone TEXT NOT NULL UNIQUE,
    email TEXT,
    origem TEXT DEFAULT 'wasender', -- wasender, wacrm, manual, instagram
    status TEXT DEFAULT 'novo', -- novo, contatado, interessado, agendado, convertido, perdido
    interesse_procedimento TEXT, -- botox, preenchimento, bioestimulador, etc
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_ultimo_contato DATETIME,
    observacoes TEXT,
    key_marker TEXT, -- Marcador do WaCRM
    session_id TEXT -- ID da sessão do WaCRM/WaSender
);

-- Tabela de Pacientes (Sistema Clínica)
CREATE TABLE IF NOT EXISTS pacientes (
    paciente_id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER,
    nome TEXT NOT NULL,
    telefone TEXT NOT NULL,
    email TEXT,
    cpf TEXT,
    data_nascimento DATE,
    endereco TEXT,
    historico_medico TEXT,
    alergias TEXT,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lead_id) REFERENCES leads(lead_id)
);

-- Tabela de Procedimentos Estéticos
CREATE TABLE IF NOT EXISTS procedimentos (
    procedimento_id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2),
    duracao_minutos INTEGER,
    categoria TEXT -- facial, corporal, capilar
);

-- Tabela de Profissionais/Especialistas
CREATE TABLE IF NOT EXISTS profissionais (
    profissional_id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    especialidade TEXT,
    telefone TEXT,
    email TEXT,
    ativo INTEGER DEFAULT 1
);

-- Tabela de Agendamentos
CREATE TABLE IF NOT EXISTS agendamentos (
    agendamento_id INTEGER PRIMARY KEY AUTOINCREMENT,
    paciente_id INTEGER NOT NULL,
    profissional_id INTEGER NOT NULL,
    procedimento_id INTEGER NOT NULL,
    data_hora DATETIME NOT NULL,
    status TEXT DEFAULT 'agendado', -- agendado, confirmado, realizado, cancelado, faltou
    valor DECIMAL(10,2),
    observacoes TEXT,
    lembrete_enviado INTEGER DEFAULT 0,
    confirmacao_recebida INTEGER DEFAULT 0,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (paciente_id) REFERENCES pacientes(paciente_id),
    FOREIGN KEY (profissional_id) REFERENCES profissionais(profissional_id),
    FOREIGN KEY (procedimento_id) REFERENCES procedimentos(procedimento_id)
);

-- Tabela de Campanhas de Disparo
CREATE TABLE IF NOT EXISTS campanhas (
    campanha_id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    mensagem_template TEXT,
    procedimento_alvo TEXT,
    data_inicio DATETIME,
    data_fim DATETIME,
    total_enviados INTEGER DEFAULT 0,
    total_respondidos INTEGER DEFAULT 0,
    total_agendados INTEGER DEFAULT 0,
    status TEXT DEFAULT 'rascunho' -- rascunho, ativa, pausada, finalizada
);

-- Tabela de Mensagens (Log de Comunicação)
CREATE TABLE IF NOT EXISTS mensagens (
    mensagem_id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER,
    paciente_id INTEGER,
    direcao TEXT NOT NULL, -- entrada, saida
    conteudo TEXT,
    tipo TEXT DEFAULT 'texto', -- texto, imagem, audio, video
    numero_origem TEXT,
    numero_destino TEXT,
    campanha_id INTEGER,
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lead_id) REFERENCES leads(lead_id),
    FOREIGN KEY (paciente_id) REFERENCES pacientes(paciente_id),
    FOREIGN KEY (campanha_id) REFERENCES campanhas(campanha_id)
);

-- Tabela de Lembretes (Integração WaCRM)
CREATE TABLE IF NOT EXISTS lembretes (
    lembrete_id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER,
    paciente_id INTEGER,
    titulo TEXT NOT NULL,
    descricao TEXT,
    data_hora_lembrete DATETIME NOT NULL,
    status TEXT DEFAULT 'pendente', -- pendente, enviado, concluido
    FOREIGN KEY (lead_id) REFERENCES leads(lead_id),
    FOREIGN KEY (paciente_id) REFERENCES pacientes(paciente_id)
);

-- Tabela de Números WhatsApp (Escala iPhone)
CREATE TABLE IF NOT EXISTS numeros_whatsapp (
    numero_id INTEGER PRIMARY KEY AUTOINCREMENT,
    numero TEXT NOT NULL UNIQUE,
    nome_perfil TEXT,
    tipo TEXT DEFAULT 'prospeccao', -- prospeccao, atendimento, oficial
    status TEXT DEFAULT 'ativo', -- ativo, banido, aquecendo
    mensagens_hoje INTEGER DEFAULT 0,
    limite_diario INTEGER DEFAULT 50,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    ultimo_uso DATETIME
);

-- Inserir procedimentos padrão de estética
INSERT INTO procedimentos (nome, descricao, preco, duracao_minutos, categoria) VALUES
('Botox', 'Aplicação de toxina botulínica para redução de rugas', 800.00, 30, 'facial'),
('Preenchimento Labial', 'Preenchimento com ácido hialurônico nos lábios', 1200.00, 45, 'facial'),
('Bioestimulador de Colágeno', 'Estimulação da produção natural de colágeno', 2500.00, 60, 'facial'),
('Harmonização Facial', 'Conjunto de procedimentos para harmonização do rosto', 3500.00, 120, 'facial'),
('Lipo de Papada', 'Redução de gordura submentoniana', 1800.00, 45, 'facial'),
('Skinbooster', 'Hidratação profunda da pele', 900.00, 30, 'facial'),
('Peeling Químico', 'Renovação celular através de ácidos', 350.00, 45, 'facial'),
('Microagulhamento', 'Estímulo de colágeno por microagulhas', 450.00, 60, 'facial');
