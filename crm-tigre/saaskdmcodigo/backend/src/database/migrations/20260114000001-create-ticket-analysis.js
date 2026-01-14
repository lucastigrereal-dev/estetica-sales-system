module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("TicketAnalyses", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      ticketId: {
        type: Sequelize.INTEGER,
        references: { model: "Tickets", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        allowNull: false
      },
      scoreQualificacao: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      sentimentoMedio: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
        allowNull: false
      },
      procedimentoInteresse: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      experienciaPrevia: {
        type: Sequelize.STRING,
        allowNull: true
      },
      melhorDia: {
        type: Sequelize.STRING,
        allowNull: true
      },
      melhorHorario: {
        type: Sequelize.STRING,
        allowNull: true
      },
      observacoes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      convertido: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      agendamentoId: {
        type: Sequelize.INTEGER,
        references: { model: "Schedules", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        allowNull: true
      },
      historicoConversa: {
        type: Sequelize.JSONB,
        defaultValue: [],
        allowNull: false
      },
      resumoIA: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      companyId: {
        type: Sequelize.INTEGER,
        references: { model: "Companies", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable("TicketAnalyses");
  }
};
