# Protocolo de Baixo Risco (PBR) - WaCRM (Edição 2026)

Este guia foi desenvolvido com base na análise técnica do sistema **WaCRM** e nas políticas de detecção de automação do WhatsApp vigentes em 2026. O objetivo é minimizar as chances de banimento através da simulação de comportamento humano.

---

## 1. Configurações de Delay (O Coração da Segurança)
O WaCRM permite configurar intervalos entre mensagens. **Nunca use os valores padrão de fábrica.**

| Parâmetro | Configuração Recomendada | Motivo |
| :--- | :--- | :--- |
| **Delay entre Mensagens** | 30 a 60 segundos (Aleatório) | Humanos não enviam mensagens a cada 2 segundos. |
| **Pausa Longa** | A cada 20 mensagens, pausar 15 minutos | Simula o comportamento de um atendente fazendo uma pausa. |
| **Limite Diário** | Máximo 250 mensagens por conta | Evita entrar no radar de "Envio em Massa" da Meta. |

---

## 2. Estratégia de Aquecimento (Warm-up)
Se o seu número é novo ou nunca usou automação, siga este cronograma antes de iniciar campanhas pesadas:

*   **Dias 1-3:** Envie apenas 10 mensagens por dia para contatos conhecidos que **vão te responder**.
*   **Dias 4-7:** Aumente para 30 mensagens, alternando entre texto e áudio/imagem.
*   **Semana 2:** Comece a usar o WaCRM com o limite de 50 mensagens/dia e delay de 60s.

---

## 3. Regras de Conteúdo e Engajamento
O maior motivo de banimento não é o robô, mas a **denúncia do usuário**.

*   **Personalização:** Use a tag de nome (ex: `Olá, {{nome}}`). Mensagens idênticas para todos são sinal claro de SPAM.
*   **Opção de Sair:** Sempre inclua no final: *"Se não quiser mais receber estas mensagens, responda 'SAIR'"*. Isso evita que o usuário clique no botão "Denunciar/Bloquear".
*   **Variáveis de Texto:** Alterne as saudações (Olá, Oi, Bom dia) para que o padrão de hash das mensagens mude.

---

## 4. Uso do "Autoreply BOT" e "Key Markers"
O WaCRM possui um robô de resposta. Para usá-lo com segurança:
1.  **Delay de Digitação:** Se a ferramenta permitir, configure um delay de "digitando..." por 3 a 5 segundos antes da resposta.
2.  **Horário Comercial:** Não deixe o bot respondendo 24h por dia se o seu perfil for de uma pessoa física. Use horários plausíveis.

---

## 5. O que fazer em caso de Banimento?
Se o seu número for desconectado:
1.  **Não tente reconectar imediatamente** com outro número no mesmo IP/Computador.
2.  Limpe o cache do navegador interno do WaCRM (se disponível) ou reinstale a aplicação.
3.  Aguarde 24h antes de subir uma nova conta para evitar o "banimento em cascata" por IP.

**Nota Final:** A automação via interface (como o WaCRM faz) é tecnicamente proibida pelos termos do WhatsApp. Este protocolo reduz o risco, mas não o elimina totalmente. Use com responsabilidade.
