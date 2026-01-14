# SSL Certificates

## Produção (Let's Encrypt)

Para gerar certificados SSL gratuitos com Let's Encrypt:

```bash
# Instalar certbot
sudo apt-get update
sudo apt-get install certbot

# Gerar certificados
sudo certbot certonly --webroot \
  -w /var/www/certbot \
  -d crm.suaclinica.com \
  -d api.crm.suaclinica.com \
  --email seu-email@exemplo.com \
  --agree-tos \
  --no-eff-email

# Copiar certificados para nginx/ssl/
sudo cp /etc/letsencrypt/live/crm.suaclinica.com/fullchain.pem ./fullchain.pem
sudo cp /etc/letsencrypt/live/crm.suaclinica.com/privkey.pem ./privkey.pem
sudo cp /etc/letsencrypt/live/crm.suaclinica.com/chain.pem ./chain.pem
```

## Desenvolvimento (Self-Signed)

Para desenvolvimento local:

```bash
# Gerar certificado self-signed
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout privkey.pem \
  -out fullchain.pem \
  -subj "/C=BR/ST=SP/L=SaoPaulo/O=CRM Tigre/CN=localhost"

# Copiar para chain.pem
cp fullchain.pem chain.pem
```

## Auto-renovação (Let's Encrypt)

Adicionar ao crontab:

```bash
# Renovar certificados mensalmente
0 0 1 * * certbot renew --quiet && docker-compose restart nginx
```

## Arquivos Necessários

- `fullchain.pem` - Certificado completo (cert + chain)
- `privkey.pem` - Chave privada
- `chain.pem` - Chain de certificados (para OCSP stapling)
