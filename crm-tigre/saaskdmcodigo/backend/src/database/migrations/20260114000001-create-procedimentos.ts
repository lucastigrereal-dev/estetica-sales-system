import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("Procedimentos", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      nome: {
        type: DataTypes.STRING,
        allowNull: false
      },
      descricao: {
        type: DataTypes.TEXT
      },
      categoria: {
        type: DataTypes.STRING
      },
      duracaoMinutos: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      precoPadrao: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      precoPromocional: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
      },
      ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      imagemUrl: {
        type: DataTypes.STRING
      },
      companyId: {
        type: DataTypes.INTEGER,
        references: { model: "Companies", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        allowNull: false
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
    return queryInterface.dropTable("Procedimentos");
  }
};
