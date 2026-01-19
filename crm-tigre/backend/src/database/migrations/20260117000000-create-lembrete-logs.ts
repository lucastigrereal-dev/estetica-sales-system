import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("LembreteLogs", {
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
        references: { model: "Pacientes", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      agendamentoId: {
        type: DataTypes.INTEGER,
        references: { model: "Agendamentos", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      tipo: {
        type: DataTypes.ENUM("LEMBRETE_24H", "LEMBRETE_2H", "NPS", "REATIVACAO"),
        allowNull: false
      },
      numeroWhatsapp: {
        type: DataTypes.STRING,
        allowNull: false
      },
      mensagem: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM("PENDENTE", "ENVIADO", "FALHA", "RESPONDIDO"),
        defaultValue: "PENDENTE",
        allowNull: false
      },
      tentativas: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      ultimaTentativa: {
        type: DataTypes.DATE
      },
      erroMensagem: {
        type: DataTypes.TEXT
      },
      respostaRecebida: {
        type: DataTypes.TEXT
      },
      dataResposta: {
        type: DataTypes.DATE
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
    return queryInterface.dropTable("LembreteLogs");
  }
};
