# Ecossistema de Vendas Integrado: WaCRM + WaSender + Robô de Grupos

Este documento descreve como integrar as três ferramentas para criar uma "Kommo Paralela" de alta performance, focada em prospecção em massa e gestão organizada de leads.

---

## 1. O Papel de Cada Ferramenta

| Ferramenta | Função Principal | Quando Usar |
| :--- | :--- | :--- |
| **WaSender 3.7** | **Mineração e Extração** | Extrair contatos do Google Maps, buscar links de grupos na web e filtrar números válidos. |
| **Robô de Grupos** | **Abordagem de Massa** | Disparar mensagens em massa para grupos ou membros de grupos recém-extraídos. |
| **WaCRM** | **Gestão e Fechamento** | Organizar o atendimento (CRM), criar lembretes de follow-up e gerenciar o funil de vendas. |

---

## 2. O Fluxo de Trabalho (Workflow)

### Passo 1: Mineração (WaSender)
Use o WaSender para gerar sua lista de contatos. 
*   **Dica:** Use o extrator de Google Maps para pegar empresas do seu nicho.
*   **Saída:** Exporte a lista em formato `.xlsx` ou `.csv`.

### Passo 2: Filtragem (WaSender)
Antes de enviar, use a função "WhatsApp Number Filter" do WaSender para remover números que não têm WhatsApp. Isso protege seu chip de banimentos por tentar falar com números inexistentes.

### Passo 3: Abordagem Inicial (Robô de Grupos ou WaSender)
Faça o primeiro disparo. 
*   Se o objetivo for **Grupos**, use o Robô de Grupos para se infiltrar e enviar sua oferta.
*   Se for **Direct (PV)**, use o WaSender com o "Protocolo de Baixo Risco" (delays longos).

### Passo 4: Gestão do Lead (WaCRM)
Assim que o lead responder, ele entra no seu **WaCRM**.
*   **Etiquete o Lead:** Use os *Key Markers* para marcar como "Interessado".
*   **Agende o Follow-up:** Se ele não fechar na hora, use o *Reminder* para chamá-lo em 2 dias.
*   **Transição:** Se o lead for muito qualificado, use o script de transição para levá-lo à sua **Kommo Oficial (API)**.

---

## 3. Estratégia de Credibilidade (O Script de Transição)

Para não perder a confiança ao usar números diferentes, use este modelo de mensagem no WaCRM:

> "Olá, [Nome]! Sou o assistente digital da [Sua Empresa]. Vi que você tem interesse em [Assunto]. Para que eu possa te enviar nossa proposta detalhada e garantir sua segurança, vou transferir seu atendimento para o nosso **Canal Oficial Verificado**. 
> 
> Clique no link abaixo para falar com nosso consultor agora:
> [Link wa.me para sua Kommo Oficial]"

---

## 4. Dicas de Ouro para 2026

1.  **Múltiplas Instâncias:** O WaCRM permite abrir várias sessões. Use um número para cada nicho de mercado.
2.  **Aquecimento de Chips:** Use a função "Group Warmer" do WaSender para fazer seus chips conversarem entre si antes de começar os disparos. Isso aumenta a vida útil do chip em 300%.
3.  **Backup de Dados:** Exporte regularmente o arquivo `db.db` do WaCRM para garantir que seus lembretes e contatos estejam salvos.

---
**Conclusão:** Você agora tem uma estrutura onde o WaSender traz o lead, o Robô de Grupos faz o barulho, e o WaCRM organiza o dinheiro.
