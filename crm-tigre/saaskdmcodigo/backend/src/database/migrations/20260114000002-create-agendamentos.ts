import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("Agendamentos", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      companyId: {
        type: DataTypes.INTEGER,
        references: { model: "Companies", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        allowNull: false
      },
      pacienteId: {
        type: DataTypes.INTEGER,
        references: { model: "Contacts", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
        allowNull: false
      },
      procedimentoId: {
        type: DataTypes.INTEGER,
        references: { model: "Procedimentos", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
        allowNull: false
      },
      profissionalId: {
        type: DataTypes.INTEGER,
        references: { model: "Users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      dataAgendamento: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      horaInicio: {
        type: DataTypes.TIME,
        allowNull: false
      },
      horaFim: {
        type: DataTypes.TIME,
        allowNull: false
      },
      duracaoMinutos: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM("AGENDADO", "CONFIRMADO", "REALIZADO", "CANCELADO", "NO_SHOW"),
        defaultValue: "AGENDADO"
      },
      preco: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      desconto: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
      },
      precoFinal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      pagamentoStatus: {
        type: DataTypes.ENUM("PENDENTE", "PAGO", "PARCIAL", "CANCELADO"),
        defaultValue: "PENDENTE"
      },
      metodoPagamento: {
        type: DataTypes.STRING
      },
      notas: {
        type: DataTypes.TEXT
      },
      googleEventId: {
        type: DataTypes.STRING
      },
      lembrete24hEnviado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      lembrete2hEnviado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      motivoCancelamento: {
        type: DataTypes.TEXT
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.dropTable("Agendamentos");
  }
};
