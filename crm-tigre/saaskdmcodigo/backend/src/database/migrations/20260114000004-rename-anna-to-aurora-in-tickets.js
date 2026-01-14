module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.renameColumn("Tickets", "annaActive", "auroraActive"),
      queryInterface.renameColumn("Tickets", "annaStage", "auroraStage")
    ]);
  },

  down: (queryInterface) => {
    return Promise.all([
      queryInterface.renameColumn("Tickets", "auroraActive", "annaActive"),
      queryInterface.renameColumn("Tickets", "auroraStage", "annaStage")
    ]);
  }
};
