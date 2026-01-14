module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("TicketAnalyses", "leadState", {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "Estado do lead: HOT, WARM, COLD, CURIOSO, SPAM"
      }),
      queryInterface.addColumn("TicketAnalyses", "taereScores", {
        type: Sequelize.JSONB,
        allowNull: true,
        comment: "Scores TAERE: timing, affective, economic, risk, engagement, total"
      }),
      queryInterface.addColumn("TicketAnalyses", "taereSignals", {
        type: Sequelize.JSONB,
        allowNull: true,
        comment: "Sinais detectados pelo TAERE"
      }),
      queryInterface.addColumn("TicketAnalyses", "taereReasons", {
        type: Sequelize.JSONB,
        allowNull: true,
        comment: "Motivos da classificação TAERE"
      }),
      queryInterface.addColumn("TicketAnalyses", "taereConfidence", {
        type: Sequelize.FLOAT,
        defaultValue: 0,
        allowNull: false,
        comment: "Confiança da avaliação TAERE (0-1)"
      })
    ]);
  },

  down: (queryInterface) => {
    return Promise.all([
      queryInterface.removeColumn("TicketAnalyses", "leadState"),
      queryInterface.removeColumn("TicketAnalyses", "taereScores"),
      queryInterface.removeColumn("TicketAnalyses", "taereSignals"),
      queryInterface.removeColumn("TicketAnalyses", "taereReasons"),
      queryInterface.removeColumn("TicketAnalyses", "taereConfidence")
    ]);
  }
};
