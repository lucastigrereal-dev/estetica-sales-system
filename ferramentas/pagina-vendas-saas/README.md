# 🌐 Página de Vendas SaaS CRM

## O que é
Template WordPress completo para vender seu sistema de CRM/Whaticket como SaaS (Software as a Service).

## Conteúdo do Pacote

- **Site-pronto.zip** - Backup completo do WordPress (All-in-One WP Migration)
- **u492005577_sitebot.sql** - Banco de dados MySQL
- **chave-crocoblock.txt** - Licença do plugin Crocoblock (JetElements)

## Funcionalidades do Site

### Páginas
- Landing page com benefícios
- Página de preços/planos
- Página de contato
- FAQ
- Termos de uso
- Política de privacidade

### Recursos
- Design responsivo
- Formulário de cadastro
- Integração com gateway de pagamento
- Área de cliente

## Como Usar para Estética

Você pode adaptar este template para vender:
1. **Seu sistema de agendamento** para outras clínicas
2. **Consultoria de automação** WhatsApp
3. **Serviço de gestão** de redes sociais

## Instalação

### Requisitos
- Hospedagem com cPanel ou similar
- PHP 7.4+
- MySQL 5.7+
- WordPress 6.0+

### Passos
1. Instale WordPress na hospedagem
2. Instale plugin "All-in-One WP Migration"
3. Importe o arquivo `Site-pronto.zip`
4. Ative a licença do Crocoblock

## Configuração DNS

Se usar o mesmo domínio para Whaticket + Site:

```
MX 0 mail.seudominio.com.br
TXT "v=spf1 a mx include:websitewelcome.com ~all"
A seudominio.com.br → IP da hospedagem
A www.seudominio.com.br → IP da hospedagem
A painel.seudominio.com.br → IP da VPS (Whaticket)
A api.seudominio.com.br → IP da VPS (Whaticket)
```

## Avisos

⚠️ O arquivo SQL (93MB) não está no GitHub por ser muito grande
⚠️ Solicite ao administrador se precisar do backup completo
