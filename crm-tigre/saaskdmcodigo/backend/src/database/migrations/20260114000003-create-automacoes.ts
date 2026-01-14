import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("Automacaos", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      tipo: {
        type: DataTypes.ENUM(
          "LEMBRETE_24H",
          "LEMBRETE_2H",
          "NPS",
          "REATIVACAO_30D",
          "REATIVACAO_60D",
          "REATIVACAO_90D"
        ),
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
        onDelete: "CASCADE",
        allowNull: false
      },
      agendamentoId: {
        type: DataTypes.INTEGER,
        references: { model: "Agendamentos", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      dataEnvio: {
        type: DataTypes.DATE
      },
      status: {
        type: DataTypes.ENUM("PENDENTE", "ENVIADO", "RESPONDIDO", "ERRO"),
        defaultValue: "PENDENTE"
      },
      mensagemEnviada: {
        type: DataTypes.TEXT
      },
      resposta: {
        type: DataTypes.TEXT
      },
      notaNps: {
        type: DataTypes.INTEGER
      },
      erroMensagem: {
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
    return queryInterface.dropTable("Automacaos");
  }
};
