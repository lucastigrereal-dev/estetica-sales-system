-- ============================================
-- SETTINGS - INSTITUTO RODOVANSKY
-- Customização visual e de atendimento premium
-- ============================================

-- Company ID for Instituto Rodovansky
-- Assuming companyId = 3 (from earlier test)

-- ============================================
-- VISUAL CUSTOMIZATION
-- ============================================

-- Primary Color (Dourado Premium)
INSERT INTO "Settings" ("companyId", "key", "value", "createdAt", "updatedAt")
VALUES (3, 'primaryColor', '#C9A050', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Secondary Color (Azul Marinho)
INSERT INTO "Settings" ("companyId", "key", "value", "createdAt", "updatedAt")
VALUES (3, 'secondaryColor', '#1A2E4C', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Company Branding
INSERT INTO "Settings" ("companyId", "key", "value", "createdAt", "updatedAt")
VALUES (3, 'companyName', 'Instituto Rodovansky', NOW(), NOW())
ON CONFLICT DO NOTHING;

INSERT INTO "Settings" ("companyId", "key", "value", "createdAt", "updatedAt")
VALUES (3, 'companySlogan', 'Excelência em Estética Avançada', NOW(), NOW())
ON CONFLICT DO NOTHING;

INSERT INTO "Settings" ("companyId", "key", "value", "createdAt", "updatedAt")
VALUES (3, 'companyDescription', 'Instituto Rodovansky oferece tratamentos estéticos avançados com a mais alta tecnologia e profissionalismo', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Logo URLs
INSERT INTO "Settings" ("companyId", "key", "value", "createdAt", "updatedAt")
VALUES (3, 'logoUrl', '/assets/logo-rodovansky.png', NOW(), NOW())
ON CONFLICT DO NOTHING;

INSERT INTO "Settings" ("companyId", "key", "value", "createdAt", "updatedAt")
VALUES (3, 'logoWhiteUrl', '/assets/logo-rodovansky-white.png', NOW(), NOW())
ON CONFLICT DO NOTHING;

INSERT INTO "Settings" ("companyId", "key", "value", "createdAt", "updatedAt")
VALUES (3, 'faviconUrl', '/assets/favicon-rodovansky.ico', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- GREETING MESSAGES
-- ============================================

INSERT INTO "Settings" ("companyId", "key", "value", "createdAt", "updatedAt")
VALUES (3, 'greetingMessage', 'Bem-vinda ao Instituto Rodovansky! Sou a Aurora, como posso ajudá-la hoje? 💫', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Out of Hours Message
INSERT INTO "Settings" ("companyId", "key", "value", "createdAt", "updatedAt")
VALUES (3, 'outOfHoursMessage', 'Obrigada pelo contato! 💛 Nosso horário de atendimento é de segunda a sexta, das 8h às 20h, e aos sábados das 8h às 14h. Retornaremos assim que possível! 🌸', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Transfer Message
INSERT INTO "Settings" ("companyId", "key", "value", "createdAt", "updatedAt")
VALUES (3, 'transferMessage', 'Vou conectá-la com uma de nossas consultoras especializadas! Um momento, por favor. 💫', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- OPERATING HOURS
-- ============================================

INSERT INTO "Settings" ("companyId", "key", "value", "createdAt", "updatedAt")
VALUES (3, 'businessHours', '{"monday":{"start":"08:00","end":"20:00"},"tuesday":{"start":"08:00","end":"20:00"},"wednesday":{"start":"08:00","end":"20:00"},"thursday":{"start":"08:00","end":"20:00"},"friday":{"start":"08:00","end":"20:00"},"saturday":{"start":"08:00","end":"14:00"},"sunday":null}', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- CONTACT INFORMATION
-- ============================================

INSERT INTO "Settings" ("companyId", "key", "value", "createdAt", "updatedAt")
VALUES (3, 'address', 'Rua João de Barros, 1000 - Boa Viagem, Recife - PE', NOW(), NOW())
ON CONFLICT DO NOTHING;

INSERT INTO "Settings" ("companyId", "key", "value", "createdAt", "updatedAt")
VALUES (3, 'phone', '(81) 3133-9999', NOW(), NOW())
ON CONFLICT DO NOTHING;

INSERT INTO "Settings" ("companyId", "key", "value", "createdAt", "updatedAt")
VALUES (3, 'whatsapp', '81999999999', NOW(), NOW())
ON CONFLICT DO NOTHING;

INSERT INTO "Settings" ("companyId", "key", "value", "createdAt", "updatedAt")
VALUES (3, 'email', 'contato@rodovansky.com.br', NOW(), NOW())
ON CONFLICT DO NOTHING;

INSERT INTO "Settings" ("companyId", "key", "value", "createdAt", "updatedAt")
VALUES (3, 'website', 'www.rodovansky.com.br', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- PROCEDURES & SERVICES
-- ============================================

-- Enable Agendamentos
INSERT INTO "Settings" ("companyId", "key", "value", "createdAt", "updatedAt")
VALUES (3, 'enableSchedules', 'true', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Enable Financeiro
INSERT INTO "Settings" ("companyId", "key", "value", "createdAt", "updatedAt")
VALUES (3, 'enableFinanceiro', 'true', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Enable Aurora IA
INSERT INTO "Settings" ("companyId", "key", "value", "createdAt", "updatedAt")
VALUES (3, 'enableAuroraIA', 'true', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- PAYMENT INTEGRATION
-- ============================================

-- Payment Methods
INSERT INTO "Settings" ("companyId", "key", "value", "createdAt", "updatedAt")
VALUES (3, 'enableStripe', 'true', NOW(), NOW())
ON CONFLICT DO NOTHING;

INSERT INTO "Settings" ("companyId", "key", "value", "createdAt", "updatedAt")
VALUES (3, 'enablePix', 'true', NOW(), NOW())
ON CONFLICT DO NOTHING;

INSERT INTO "Settings" ("companyId", "key", "value", "createdAt", "updatedAt")
VALUES (3, 'enableBoleto', 'true', NOW(), NOW())
ON CONFLICT DO NOTHING;

INSERT INTO "Settings" ("companyId", "key", "value", "createdAt", "updatedAt")
VALUES (3, 'enableCash', 'true', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- REMINDERS & AUTOMATIONS
-- ============================================

-- Enable 24h Reminder
INSERT INTO "Settings" ("companyId", "key", "value", "createdAt", "updatedAt")
VALUES (3, 'enable24hReminder', 'true', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Enable 2h Reminder
INSERT INTO "Settings" ("companyId", "key", "value", "createdAt", "updatedAt")
VALUES (3, 'enable2hReminder', 'true', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Enable NPS Survey
INSERT INTO "Settings" ("companyId", "key", "value", "createdAt", "updatedAt")
VALUES (3, 'enableNPS', 'true', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Enable Reactivation Campaign
INSERT INTO "Settings" ("companyId", "key", "value", "createdAt", "updatedAt")
VALUES (3, 'enableReactivation', 'true', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- NPS Survey Time (20h - after business hours)
INSERT INTO "Settings" ("companyId", "key", "value", "createdAt", "updatedAt")
VALUES (3, 'npsSurveyTime', '20:00', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- BRAND COLORS FOR UI
-- ============================================

-- Primary Gold Shade
INSERT INTO "Settings" ("companyId", "key", "value", "createdAt", "updatedAt")
VALUES (3, 'primaryGold', '#C9A050', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Secondary Navy Shade
INSERT INTO "Settings" ("companyId", "key", "value", "createdAt", "updatedAt")
VALUES (3, 'secondaryNavy', '#1A2E4C', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Accent Success
INSERT INTO "Settings" ("companyId", "key", "value", "createdAt", "updatedAt")
VALUES (3, 'accentSuccess', '#059669', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Accent Warning
INSERT INTO "Settings" ("companyId", "key", "value", "createdAt", "updatedAt")
VALUES (3, 'accentWarning', '#D97706', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Accent Error
INSERT INTO "Settings" ("companyId", "key", "value", "createdAt", "updatedAt")
VALUES (3, 'accentError', '#DC2626', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- SYSTEM PREFERENCES
-- ============================================

-- Enable Dark Mode
INSERT INTO "Settings" ("companyId", "key", "value", "createdAt", "updatedAt")
VALUES (3, 'allowDarkMode', 'true', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Default Theme (light/dark)
INSERT INTO "Settings" ("companyId", "key", "value", "createdAt", "updatedAt")
VALUES (3, 'defaultTheme', 'light', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Locale (pt-BR)
INSERT INTO "Settings" ("companyId", "key", "value", "createdAt", "updatedAt")
VALUES (3, 'locale', 'pt-BR', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Timezone
INSERT INTO "Settings" ("companyId", "key", "value", "createdAt", "updatedAt")
VALUES (3, 'timezone', 'America/Recife', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- CONFIRMATION
-- ============================================
SELECT 'Instituto Rodovansky settings inserted successfully!' as result;
