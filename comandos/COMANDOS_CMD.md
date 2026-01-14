# 💻 COMANDOS PRONTOS PARA CMD

Copie e cole esses comandos nas suas abas do CMD/Terminal.

---

## 🚀 SETUP INICIAL (Rodar uma vez)

### Aba 1: Clonar e Entrar no Projeto
```bash
git clone https://github.com/lucastigrereal-dev/estetica-sales-system.git
cd estetica-sales-system
```

### Aba 2: Criar Ambiente Virtual Python
```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### Aba 3: Instalar Dependências Node (Frontend)
```bash
cd frontend
npm install
cd ..
```

### Aba 4: Subir Docker (N8N + Banco)
```bash
docker-compose up -d
```

---

## 📊 OPERAÇÃO DIÁRIA (4 Abas Simultâneas)

### ABA 1 - EXPORTAR LEADS DA KOMMO
```bash
cd estetica-sales-system
venv\Scripts\activate
python scripts/kommo/kommo_export.py --status "sem_resposta"
```
**Resultado:** Cria `exports/leads_para_disparo_YYYYMMDD.xlsx`

---

### ABA 2 - PREPARAR LOTES PARA WASENDER
```bash
cd estetica-sales-system
venv\Scripts\activate
python scripts/kommo/prepare_campaign.py --input exports/leads_para_disparo_*.xlsx --lote 50
```
**Resultado:** Cria `exports/lote_01.xlsx`, `lote_02.xlsx`, etc.

---

### ABA 3 - MONITORAR RESPOSTAS
```bash
cd estetica-sales-system
venv\Scripts\activate
python scripts/kommo/track_responses.py --watch
```
**Resultado:** Monitora pasta `/responses/` em tempo real

---

### ABA 4 - REIMPORTAR NA KOMMO
```bash
cd estetica-sales-system
venv\Scripts\activate
python scripts/kommo/kommo_import.py --input responses/responderam.xlsx
```
**Resultado:** Atualiza leads na Kommo com tag "Respondeu_WaSender"

---

## 🔄 COMANDOS GIT (Após fazer alterações)

### Salvar alterações locais
```bash
git add .
git commit -m "feat: descrição do que você fez"
```

### Enviar para GitHub
```bash
git push
```

### Baixar atualizações do GitHub
```bash
git pull
```

### Ver status das alterações
```bash
git status
```

---

## 🐳 COMANDOS DOCKER

### Subir todos os serviços
```bash
docker-compose up -d
```

### Ver logs do N8N
```bash
docker-compose logs -f n8n
```

### Parar todos os serviços
```bash
docker-compose down
```

### Reiniciar um serviço específico
```bash
docker-compose restart n8n
```

### Ver serviços rodando
```bash
docker-compose ps
```

---

## 🌐 ACESSOS LOCAIS

| Serviço | URL | Usuário/Senha |
|---------|-----|---------------|
| N8N | http://localhost:5678 | Configurar no primeiro acesso |
| Backend API | http://localhost:8000 | - |
| Frontend | http://localhost:3000 | - |
| Swagger (API Docs) | http://localhost:8000/docs | - |

---

## 🛠️ COMANDOS ÚTEIS

### Testar se Python está funcionando
```bash
python --version
```

### Testar se Node está funcionando
```bash
node --version
```

### Testar se Docker está funcionando
```bash
docker --version
docker-compose --version
```

### Limpar cache do Python
```bash
pip cache purge
```

### Reinstalar dependências
```bash
pip install -r requirements.txt --force-reinstall
```

---

## 🔧 TROUBLESHOOTING

### Erro: "python não é reconhecido"
```bash
# Adicione Python ao PATH ou use:
py -3.11 scripts/kommo/kommo_export.py
```

### Erro: "docker não é reconhecido"
```bash
# Reinicie o Docker Desktop ou:
# Abra Docker Desktop manualmente antes de rodar comandos
```

### Erro: "Permission denied" no Git
```bash
# Configure suas credenciais:
git config --global user.email "seu@email.com"
git config --global user.name "Seu Nome"
```

### Erro: "Port already in use"
```bash
# Encontre e mate o processo:
netstat -ano | findstr :8000
taskkill /PID [numero_do_pid] /F
```

---

## 📱 ATALHOS DE TECLADO (Windows Terminal)

| Atalho | Ação |
|--------|------|
| `Ctrl + Shift + T` | Nova aba |
| `Ctrl + Tab` | Próxima aba |
| `Ctrl + Shift + Tab` | Aba anterior |
| `Alt + Shift + D` | Dividir painel |
| `Ctrl + C` | Parar comando |
| `Ctrl + L` | Limpar tela |

---

## 🎯 FLUXO DE TRABALHO RECOMENDADO

```
1. Abrir Windows Terminal
2. Dividir em 4 abas
3. Cada aba = um script diferente
4. Deixar rodando em paralelo
5. Verificar resultados periodicamente
```

**Dica:** Use o Windows Terminal (não o CMD antigo) para ter abas e painéis divididos.
