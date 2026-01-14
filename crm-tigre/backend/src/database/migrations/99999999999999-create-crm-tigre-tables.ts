import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    // PACIENTES
    await queryInterface.createTable("Pacientes", {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      companyId: { type: DataTypes.INTEGER, references: { model: "Companies", key: "id" }, onUpdate: "CASCADE", onDelete: "CASCADE" },
      contactId: { type: DataTypes.INTEGER, references: { model: "Contacts", key: "id" }, onUpdate: "CASCADE", onDelete: "SET NULL" },
      nome: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING },
      telefone: { type: DataTypes.STRING },
      whatsapp: { type: DataTypes.STRING },
      cpf: { type: DataTypes.STRING },
      dataNascimento: { type: DataTypes.DATEONLY },
      genero: { type: DataTypes.ENUM("M", "F", "OUTRO") },
      endereco: { type: DataTypes.STRING },
      cidade: { type: DataTypes.STRING },
      estado: { type: DataTypes.STRING },
      cep: { type: DataTypes.STRING },
      numeroProcedimentos: { type: DataTypes.INTEGER, defaultValue: 0 },
      procedimentoFavorito: { type: DataTypes.STRING },
      status: { type: DataTypes.ENUM("ATIVO", "INATIVO", "BLOQUEADO"), defaultValue: "ATIVO" },
      classificacao: { type: DataTypes.ENUM("OURO", "PRATA", "BRONZE", "NOVO"), defaultValue: "NOVO" },
      observacoes: { type: DataTypes.TEXT },
      alergias: { type: DataTypes.TEXT },
      historicoMedico: { type: DataTypes.TEXT },
      ultimoContato: { type: DataTypes.DATE },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false }
    });

    // PROCEDIMENTOS
    await queryInterface.createTable("Procedimentos", {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      companyId: { type: DataTypes.INTEGER, references: { model: "Companies", key: "id" }, onUpdate: "CASCADE", onDelete: "CASCADE" },
      nome: { type: DataTypes.STRING, allowNull: false },
      descricao: { type: DataTypes.TEXT },
      categoria: { type: DataTypes.ENUM("FACIAL", "CORPORAL", "CAPILAR", "INJETAVEL", "LASER", "OUTRA"), defaultValue: "FACIAL" },
      duracaoMinutos: { type: DataTypes.INTEGER, defaultValue: 60 },
      precoPadrao: { type: DataTypes.DECIMAL(10, 2) },
      precoPromocional: { type: DataTypes.DECIMAL(10, 2) },
      ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
      imagemUrl: { type: DataTypes.STRING },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false }
    });

    // AGENDAMENTOS
    await queryInterface.createTable("Agendamentos", {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      companyId: { type: DataTypes.INTEGER, references: { model: "Companies", key: "id" }, onUpdate: "CASCADE", onDelete: "CASCADE" },
      pacienteId: { type: DataTypes.INTEGER, references: { model: "Pacientes", key: "id" }, onUpdate: "CASCADE", onDelete: "CASCADE" },
      procedimentoId: { type: DataTypes.INTEGER, references: { model: "Procedimentos", key: "id" }, onUpdate: "CASCADE", onDelete: "SET NULL" },
      profissionalId: { type: DataTypes.INTEGER, references: { model: "Users", key: "id" }, onUpdate: "CASCADE", onDelete: "SET NULL" },
      dataAgendamento: { type: DataTypes.DATEONLY, allowNull: false },
      horaInicio: { type: DataTypes.TIME, allowNull: false },
      horaFim: { type: DataTypes.TIME },
      duracaoMinutos: { type: DataTypes.INTEGER },
      status: { type: DataTypes.ENUM("AGENDADO", "CONFIRMADO", "REALIZADO", "CANCELADO", "NO_SHOW"), defaultValue: "AGENDADO" },
      preco: { type: DataTypes.DECIMAL(10, 2) },
      desconto: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
      precoFinal: { type: DataTypes.DECIMAL(10, 2) },
      pagamentoStatus: { type: DataTypes.ENUM("PENDENTE", "PAGO", "PARCIAL", "REEMBOLSADO"), defaultValue: "PENDENTE" },
      metodoPagamento: { type: DataTypes.STRING },
      notas: { type: DataTypes.TEXT },
      motivoCancelamento: { type: DataTypes.STRING },
      googleEventId: { type: DataTypes.STRING },
      lembrete24hEnviado: { type: DataTypes.BOOLEAN, defaultValue: false },
      lembrete2hEnviado: { type: DataTypes.BOOLEAN, defaultValue: false },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false }
    });

    // PAGAMENTOS
    await queryInterface.createTable("Pagamentos", {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      companyId: { type: DataTypes.INTEGER, references: { model: "Companies", key: "id" }, onUpdate: "CASCADE", onDelete: "CASCADE" },
      pacienteId: { type: DataTypes.INTEGER, references: { model: "Pacientes", key: "id" }, onUpdate: "CASCADE", onDelete: "SET NULL" },
      agendamentoId: { type: DataTypes.INTEGER, references: { model: "Agendamentos", key: "id" }, onUpdate: "CASCADE", onDelete: "SET NULL" },
      valor: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      desconto: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
      valorFinal: { type: DataTypes.DECIMAL(10, 2) },
      metodo: { type: DataTypes.ENUM("CARTAO", "PIX", "BOLETO", "DINHEIRO", "TRANSFERENCIA"), defaultValue: "CARTAO" },
      status: { type: DataTypes.ENUM("PENDENTE", "PROCESSANDO", "APROVADO", "RECUSADO", "REEMBOLSADO"), defaultValue: "PENDENTE" },
      stripePaymentId: { type: DataTypes.STRING },
      stripeCheckoutUrl: { type: DataTypes.STRING },
      pixCode: { type: DataTypes.TEXT },
      pixQrCodeUrl: { type: DataTypes.STRING },
      boletoUrl: { type: DataTypes.STRING },
      dataPagamento: { type: DataTypes.DATE },
      observacoes: { type: DataTypes.TEXT },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false }
    });

    // PESQUISAS NPS
    await queryInterface.createTable("PesquisasNps", {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      companyId: { type: DataTypes.INTEGER, references: { model: "Companies", key: "id" }, onUpdate: "CASCADE", onDelete: "CASCADE" },
      pacienteId: { type: DataTypes.INTEGER, references: { model: "Pacientes", key: "id" }, onUpdate: "CASCADE", onDelete: "SET NULL" },
      agendamentoId: { type: DataTypes.INTEGER, references: { model: "Agendamentos", key: "id" }, onUpdate: "CASCADE", onDelete: "SET NULL" },
      score: { type: DataTypes.INTEGER },
      comentario: { type: DataTypes.TEXT },
      dataEnvio: { type: DataTypes.DATE },
      dataResposta: { type: DataTypes.DATE },
      respondido: { type: DataTypes.BOOLEAN, defaultValue: false },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false }
    });

    // ÍNDICES
    await queryInterface.addIndex("Pacientes", ["companyId"]);
    await queryInterface.addIndex("Pacientes", ["status"]);
    await queryInterface.addIndex("Procedimentos", ["companyId"]);
    await queryInterface.addIndex("Agendamentos", ["companyId", "dataAgendamento"]);
    await queryInterface.addIndex("Agendamentos", ["status"]);
    await queryInterface.addIndex("Pagamentos", ["companyId"]);
    await queryInterface.addIndex("Pagamentos", ["status"]);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("PesquisasNps");
    await queryInterface.dropTable("Pagamentos");
    await queryInterface.dropTable("Agendamentos");
    await queryInterface.dropTable("Procedimentos");
    await queryInterface.dropTable("Pacientes");
  }
};
