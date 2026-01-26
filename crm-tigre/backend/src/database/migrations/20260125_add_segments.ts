import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("Segments", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: "Nome do segmento"
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Descrição do segmento"
      },
      rules: {
        type: DataTypes.JSON,
        allowNull: false,
        comment: "Regras de filtro em formato JSON"
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
        comment: "Segmento ativo?"
      },
      contactCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: "Quantidade de contatos no segmento (cache)"
      },
      lastCalculated: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "Última vez que foi calculado"
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
    }).then(() => {
      return Promise.all([
        queryInterface.addIndex("Segments", ["companyId"]),
        queryInterface.addIndex("Segments", ["isActive"]),
        queryInterface.addIndex("Segments", ["name", "companyId"], {
          unique: true,
          name: "segments_name_company_unique"
        })
      ]);
    });
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.dropTable("Segments");
  }
};
