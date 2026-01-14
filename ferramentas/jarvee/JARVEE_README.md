# 🤖 Jarvee 1.8.7.2 - Automação Instagram

## O que é
Jarvee é uma ferramenta de automação para redes sociais (Instagram, Facebook, Twitter, Pinterest, LinkedIn, YouTube, Quora, Tumblr).

## Funcionalidades Principais

### Instagram
- **Follow/Unfollow** - Seguir seguidores de concorrentes
- **Like** - Curtir posts de hashtags específicas
- **Comment** - Comentar automaticamente
- **DM** - Enviar mensagens diretas
- **Story Viewer** - Visualizar stories automaticamente
- **Repost** - Repostar conteúdo
- **Scraper** - Extrair usuários de hashtags/locais

### Gerenciamento
- Gerencia até **10+ contas** simultaneamente
- Proxies por conta
- Delays configuráveis
- Horários de operação

## Estrutura de Arquivos

```
Jarvee_1.8.7.2/
├── Jarvee.exe              # Executável principal
├── Jarvee.exe.config       # Configuração do app
├── NLog.config             # Configuração de logs
├── femaleNames.txt         # Nomes para geração de perfis
├── maleNames.txt           # Nomes para geração de perfis
├── locales/                # Traduções
├── Logs/                   # Logs de operação
├── StatisticsExport/       # Exportação de estatísticas
├── StoryViewer/            # Dados de stories
└── tempdb/                 # Banco temporário
```

## Configuração Recomendada

### Delays (para evitar bloqueio)
```
Follow: 60-120 segundos entre ações
Like: 30-60 segundos entre ações
Comment: 120-180 segundos entre ações
DM: 300-600 segundos entre ações
```

### Limites Diários
```
Follows: 50-100/dia (contas novas: 20-30)
Unfollows: 50-100/dia
Likes: 100-200/dia
Comments: 20-50/dia
DMs: 20-30/dia
```

## Integração com o Sistema de Estética

### Fluxo de Prospecção Instagram
1. **Jarvee** extrai seguidores de clínicas concorrentes
2. **Jarvee** segue e curte posts desses usuários
3. **Jarvee** envia DM com oferta
4. Interessados são direcionados para **WhatsApp**
5. **WaSender/WaCRM** continua o atendimento

### Hashtags Recomendadas para Estética
```
#harmonizacaofacial
#botox
#preenchimentolabial
#esteticafacial
#skincare
#bioestimulador
#lipodepapada
#clinicadeestetica
#procedimentoestetico
#beleza
```

### Locais para Scraping
- Clínicas concorrentes na sua cidade
- Salões de beleza
- Spas
- Academias (público fitness)

## Avisos Importantes

⚠️ **Risco de Banimento**: Instagram detecta automação agressiva
⚠️ **Use Proxies**: Uma proxy por conta
⚠️ **Aqueça Contas**: Contas novas precisam de 2-4 semanas de uso manual
⚠️ **Backup**: Faça backup do banco de dados regularmente

## Requisitos
- Windows 10/11
- .NET Framework 4.6.1+
- Proxies residenciais (recomendado)
- Contas Instagram aquecidas

## Onde Baixar
O executável completo (339MB) não está no GitHub por ser muito grande.
Solicite ao administrador do projeto.
