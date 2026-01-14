# Blueprint: Sistema de Vendas de Estética 2.0 (Integrado)

Este documento apresenta a arquitetura completa para transformar sua clínica de estética em uma máquina de vendas automatizada, utilizando o arsenal de ferramentas analisado.

---

## 1. Arquitetura do Ecossistema

O sistema é dividido em três camadas principais:

### A. Camada de Prospecção (O Motor)
*   **WaSender 3.7:** Responsável por minerar leads (Google Maps: "Salões de Beleza", "Academias", "Clínicas") e realizar o primeiro contato frio.
*   **Método iPhone (SpyHacker):** Utilização de múltiplos perfis de desenvolvedor para rodar 10+ instâncias de WhatsApp no mesmo aparelho, permitindo escala sem banimento do número principal.

### B. Camada de Atendimento e Filtro (O Cérebro)
*   **WaCRM:** Organiza os leads que responderam. Aqui você aplica os **Key Markers** (ex: [INTERESSE BOTOX], [AGENDADO]).
*   **N8N (Templates):** Automatiza a ponte entre o WhatsApp e o sistema da clínica. Quando um lead é marcado como "Agendado" no CRM, o N8N dispara os dados para o banco de dados da clínica.

### C. Camada de Gestão (O Back-end)
*   **Sistema Clínica:** Onde o agendamento é oficializado. Controla a agenda dos especialistas (`doctor_id`) e o histórico do paciente (`patient_id`).

---

## 2. Fluxo de Venda de Procedimento Estético

1.  **Atração:** WaSender extrai contatos de mulheres em academias de luxo da região.
2.  **Abordagem (Script de Curiosidade):**
    > "Olá, [Nome]! Vi que você frequenta a [Nome da Academia]. Estamos selecionando 5 pessoas para uma avaliação de bioestimulador de colágeno cortesia esta semana. Teria interesse?"
3.  **Qualificação (WaCRM):** O lead responde. Você usa o WaCRM para enviar um vídeo explicativo do procedimento e tirar dúvidas rápidas.
4.  **Agendamento (N8N + Sistema Clínica):** O lead aceita. Você preenche os dados e o N8N insere automaticamente na tabela `appointment` do seu sistema de clínica.

---

## 3. Guia de Implementação Técnica

### Configuração do iPhone (Escala)
1.  Acesse `udid.tech` conforme o PDF SpyHacker.
2.  Instale os perfis de configuração para duplicar o WhatsApp Business.
3.  Cada número deve ter uma foto de um "Consultor de Estética" diferente para humanizar a escala.

### Integração de Dados
*   O banco de dados do seu **Sistema Clínica** (`hms.sql`) usa MySQL.
*   Configure um nó de MySQL no **N8N** usando os templates que você possui para ler a tabela `appointment` e enviar lembretes automáticos de "Confirmação de Consulta" via WhatsApp 24h antes.

---

## 4. Estratégia de Segurança (Anti-Ban)
*   **Rodízio de Números:** Nunca envie mais de 50 mensagens novas por dia em cada número do iPhone.
*   **Aquecimento:** Use o "Group Warmer" do WaSender nos números novos por 3 dias antes de iniciar a prospecção de estética.

---
**Próximo Passo:** Comece instalando o WaSender para minerar seus primeiros 500 leads de estética e configure o primeiro número no iPhone usando o método do PDF.
