# 📁 ESTRUTURA DE ARQUIVOS - SDR AURORA
## Árvore Completa do Projeto

---

# 🌳 VISÃO GERAL

```
SDR_AURORA/
│
├── 🐳 INFRAESTRUTURA (Docker)
├── 🔧 CONFIGURAÇÃO
├── 📊 BANCO DE DADOS
├── 🤖 WORKFLOW AUTOMATION  
├── 📝 DOCUMENTAÇÃO
├── 🛠️ SCRIPTS UTILITÁRIOS
└── 📈 DADOS PERSISTENTES
```

---

# 📂 ÁRVORE DETALHADA

```
C:\Users\lucas\Desktop\SDR_AURORA\
│
├── 📄 README.md                          # Documentação principal
├── 📄 .gitignore                         # Arquivos ignorados pelo Git
│
├── 🐳 DOCKER E INFRAESTRUTURA
│   ├── docker-compose.yml                # Orquestração 4 containers
│   ├── .env                              # Variáveis ambiente (SENHAS!)
│   └── .env.example                      # Template seguro (sem senhas)
│
├── 📊 BANCO DE DADOS
│   ├── schema.sql                        # Schema PostgreSQL completo
│   │                                     # - Tabela: leads
│   │                                     # - Tabela: conversations
│   │                                     # - Tabela: transfers
│   │                                     # - Tabela: config
│   │                                     # - Views: dashboard_leads, conversions_summary
│   │
│   └── migrations/                       # Migrações futuras (vazio por ora)
│
├── 🤖 N8N WORKFLOW
│   ├── workflow-aurora-intimax.json      # Workflow completo (~14KB)
│   │                                     # - Webhook receiver
│   │                                     # - Save/Update Lead
│   │                                     # - Fetch conversation history
│   │                                     # - OpenAI integration (Aurora)
│   │                                     # - Response processing
│   │                                     # - Transfer logic
│   │                                     # - Evolution API sender
│   │
│   └── prompts/
│       └── aurora-system-prompt.txt      # System prompt completo (3KB)
│
├── 📝 DOCUMENTAÇÃO (Apresentação)
│   ├── APRESENTACAO_SDR_AURORA.md        # ⭐ Apresentação executiva (30 slides)
│   ├── ARQUITETURA_TECNICA.md            # Documentação técnica completa
│   ├── COMPARATIVO_SOLUCOES.md           # Aurora vs concorrentes
│   ├── CALCULADORA_ROI.md                # Análise financeira
│   ├── ARVORE_ARQUIVOS.md                # Este arquivo!
│   │
│   ├── guides/
│   │   ├── GUIA_USO_RAPIDO.md            # Quick start (5 min)
│   │   ├── GUIA_MANUAL_CREDENCIAIS.md    # Config step-by-step
│   │   ├── START_HERE.md                 # Ponto de entrada
│   │   └── FAQ.md                        # Perguntas frequentes
│   │
│   └── reports/
│       ├── RELATORIO_TESTE_AUTOMACAO.md  # Teste automação Playwright
│       └── RESULTADO_TESTE.txt           # Resumo testes
│
├── 🛠️ SCRIPTS AUTOMAÇÃO (Playwright/Node.js)
│   ├── package.json                      # Dependências NPM
│   ├── package-lock.json                 # Lock file
│   │
│   ├── automation/
│   │   ├── setup-n8n-automation.js       # Script principal Playwright
│   │   ├── executar-tudo.js              # Orquestrador completo
│   │   ├── check-workflow.js             # Verifica se workflow existe
│   │   ├── import-workflow.js            # Importa workflow auto
│   │   └── test-n8n-connection.js        # Testa conectividade
│   │
│   └── utils/
│       ├── diagnostico-n8n.js            # Diagnóstico sistema
│       └── configurar-credenciais-direto.js
│
├── 🪟 EXECUTÁVEIS WINDOWS
│   ├── menu.bat                          # ⭐ Menu interativo (COMECE AQUI!)
│   ├── executar-automacao.bat            # Execução rápida
│   ├── executar-automacao-completa.bat   # Com verificações
│   ├── install.bat                       # Instala dependências
│   ├── LEIA-ME.bat                       # Abre docs automaticamente
│   ├── status.bat                        # Verifica status containers
│   └── logs.bat                          # Visualiza logs
│
├── 📦 DEPENDÊNCIAS (geradas)
│   └── node_modules/                     # Playwright + deps (~300MB)
│       ├── playwright/
│       └── ...
│
├── 📁 DADOS PERSISTENTES (volumes Docker)
│   ├── data/
│   │   ├── postgres/                     # Dados PostgreSQL
│   │   │   ├── aurora_intimax/           # DB principal
│   │   │   ├── n8n_aurora/               # DB N8N
│   │   │   └── evolution_db/             # DB Evolution
│   │   │
│   │   ├── redis/                        # Cache Redis
│   │   └── evolution/                    # Instâncias WhatsApp
│   │       └── instances/
│   │           └── aurora_intimax/       # QR code, sessão
│   │
│   └── backups/                          # Backups automáticos
│       ├── aurora_20260113.sql.gz
│       └── ...
│
├── 📊 LOGS
│   ├── n8n.log                           # Logs N8N workflow
│   ├── evolution.log                     # Logs Evolution API
│   ├── postgres.log                      # Logs PostgreSQL
│   └── automation.log                    # Logs scripts Playwright
│
├── 🖼️ SCREENSHOTS (gerados)
│   ├── workflow-configurado.png          # Workflow final
│   ├── erro-automacao.png                # Debug errors
│   └── dashboard-exemplo.png             # Dashboard PostgreSQL
│
└── 📋 EXTRAS
    ├── COMECE_AQUI_AGORA.txt             # Quick start texto
    ├── CHECKLIST_FINAL.md                # Checklist go-live
    └── ROADMAP.md                        # Próximas features

```

---

# 📊 ESTATÍSTICAS DO PROJETO

| Categoria | Quantidade | Tamanho Total |
|-----------|------------|---------------|
| **Arquivos Markdown** | 15 | ~150 KB |
| **Scripts JavaScript** | 8 | ~50 KB |
| **Scripts Batch** | 7 | ~20 KB |
| **Workflows JSON** | 1 | ~14 KB |
| **SQL** | 1 | ~5 KB |
| **Documentação total** | 20+ | ~200 KB |
| **Containers Docker** | 4 | ~2 GB (imagens) |
| **Dependências NPM** | ~300 packages | ~300 MB |
| **Projeto completo** | - | **~2,5 GB** |

---

# 🎯 ARQUIVOS MAIS IMPORTANTES

## Top 5 (Para Começar):

1. **menu.bat** ⭐⭐⭐  
   *Menu interativo. Executa tudo.*

2. **APRESENTACAO_SDR_AURORA.md** ⭐⭐⭐  
   *Apresentação completa pro dono/diretor.*

3. **workflow-aurora-intimax.json** ⭐⭐  
   *Coração do sistema (lógica Aurora).*

4. **schema.sql** ⭐⭐  
   *Estrutura banco de dados.*

5. **docker-compose.yml** ⭐  
   *Infraestrutura (sobe tudo).*

---

# 🔐 ARQUIVOS SENSÍVEIS (NUNCA COMMITAR!)

```
⚠️ SEGURANÇA CRÍTICA ⚠️

NÃO compartilhar / NÃO commitar Git:

├── .env                                  # SENHAS!
├── data/postgres/                        # Dados clientes
├── backups/                              # Backups com dados
└── logs/                                 # Pode ter info sensível

✅ OK compartilhar:
├── *.md (documentação)
├── *.js (scripts)
├── *.json (workflow)
├── *.sql (schema - sem dados)
```

---

# 📂 ORGANIZAÇÃO POR PERFIL

## Para o DONO / DIRETOR:

```
📊 Ler primeiro:
└── APRESENTACAO_SDR_AURORA.md
    └── CALCULADORA_ROI.md (impacto financeiro)
```

## Para o DIRETOR COMERCIAL:

```
📈 Ler primeiro:
├── APRESENTACAO_SDR_AURORA.md (seção comercial)
└── COMPARATIVO_SOLUCOES.md (vs concorrentes)
```

## Para VENDEDORES (Especialistas):

```
📘 Ler primeiro:
├── guides/GUIA_USO_RAPIDO.md
└── guides/FAQ.md (como usar Aurora no dia-a-dia)
```

## Para o TI / DEV:

```
🔧 Ler primeiro:
├── ARQUITETURA_TECNICA.md (arquitetura completa)
├── schema.sql (banco de dados)
└── docker-compose.yml (infraestrutura)

🚀 Executar:
└── menu.bat (setup automático)
```

---

# 🔄 FLUXO DE TRABALHO (ARQUIVOS)

## 1️⃣ Setup Inicial:

```
docker-compose.yml + .env
    ↓
    Sobe 4 containers (postgres, redis, evolution, n8n)
    ↓
schema.sql
    ↓
    Cria tabelas no PostgreSQL
    ↓
workflow-aurora-intimax.json
    ↓
    Importa workflow no N8N
    ↓
setup-n8n-automation.js
    ↓
    Configura credenciais automaticamente
```

## 2️⃣ Operação Diária:

```
Lead envia WhatsApp
    ↓
Evolution API (container rodando)
    ↓
Webhook dispara N8N
    ↓
workflow-aurora-intimax.json executa
    ↓
PostgreSQL grava dados (data/postgres/)
    ↓
Resposta enviada via Evolution
```

## 3️⃣ Manutenção:

```
status.bat
    ↓
    Verifica saúde containers
    ↓
logs.bat
    ↓
    Debug problemas
    ↓
backups/ (automático noturno)
```

---

# 🎨 DIAGRAMA VISUAL SIMPLIFICADO

```
┌─────────────────────────────────────────────┐
│          CAMADA DE APRESENTAÇÃO             │
│  📊 APRESENTACAO_SDR_AURORA.md              │
│  💰 CALCULADORA_ROI.md                      │
│  🆚 COMPARATIVO_SOLUCOES.md                 │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│         CAMADA DE AUTOMAÇÃO                 │
│  🤖 Scripts Playwright (*.js)               │
│  🪟 Executáveis Windows (*.bat)             │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│         CAMADA DE APLICAÇÃO                 │
│  🐳 Docker Compose (4 containers)           │
│  ⚙️ N8N Workflow (workflow-*.json)          │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│         CAMADA DE DADOS                     │
│  💾 PostgreSQL (schema.sql)                 │
│  📁 Volumes persistentes (data/)            │
└─────────────────────────────────────────────┘
```

---

# 📦 ARQUIVOS GERADOS (Não Versionados)

Estes arquivos são criados durante uso:

```
├── node_modules/              # Dependências NPM (300MB)
├── data/postgres/             # Dados do banco
├── data/redis/                # Cache
├── data/evolution/            # Sessões WhatsApp
├── logs/*.log                 # Logs de execução
├── backups/*.sql.gz           # Backups automáticos
└── *.png                      # Screenshots debug
```

**Não committar!** Estão em `.gitignore`.

---

# 🔍 COMO ENCONTRAR ALGO?

## Procurando por...

**"Como rodar o sistema?"**  
→ `menu.bat` ou `README.md`

**"Quanto vou ganhar?"**  
→ `CALCULADORA_ROI.md`

**"Como funciona tecnicamente?"**  
→ `ARQUITETURA_TECNICA.md`

**"Aurora vs ManyChat?"**  
→ `COMPARATIVO_SOLUCOES.md`

**"Onde estão as senhas?"**  
→ `.env` (cuidado!)

**"Cadê os dados dos leads?"**  
→ `data/postgres/aurora_intimax/`

**"Script pra automatizar config?"**  
→ `setup-n8n-automation.js`

**"Lógica da Aurora?"**  
→ `workflow-aurora-intimax.json` (nó OpenAI)

---

# 💡 DICAS DE NAVEGAÇÃO

## Atalhos Rápidos:

```bash
# Ver árvore Windows
cd C:\Users\lucas\Desktop\SDR_AURORA
tree /F /A > estrutura.txt

# Buscar texto em todos arquivos
findstr /S /I "aurora" *.md

# Tamanho de cada pasta
du -sh *

# Arquivos modificados hoje
find . -mtime 0
```

---

# 🎯 CONCLUSÃO

**Total de arquivos:** ~50  
**Linhas de código:** ~5.000  
**Linhas de docs:** ~3.000  
**Containers:** 4  
**Tecnologias:** 7  

**Tempo pra entender tudo:** 2-3 horas  
**Tempo pra rodar:** 15 minutos  

**Complexidade:** Média (com docs, fica fácil)  
**Manutenção:** Baixa (self-service)  

---

**📁 FIM DA ÁRVORE DE ARQUIVOS**

**Próximo:** Apresentar tudo e fazer GO-LIVE! 🚀
