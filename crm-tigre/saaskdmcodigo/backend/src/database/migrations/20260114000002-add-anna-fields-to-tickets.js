module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Tickets", "annaActive", {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      }),
      queryInterface.addColumn("Tickets", "annaStage", {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      })
    ]);
  },

  down: (queryInterface) => {
    return Promise.all([
      queryInterface.removeColumn("Tickets", "annaActive"),
      queryInterface.removeColumn("Tickets", "annaStage")
    ]);
  }
};
