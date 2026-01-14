import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("Pacientes", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      visitorId: {
        type: DataTypes.INTEGER,
        references: { model: "Contacts", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      companyId: {
        type: DataTypes.INTEGER,
        references: { model: "Companies", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        allowNull: false
      },
      nome: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        defaultValue: ""
      },
      telefone: {
        type: DataTypes.STRING,
        allowNull: false
      },
      whatsapp: {
        type: DataTypes.STRING,
        defaultValue: ""
      },
      cpf: {
        type: DataTypes.STRING,
        defaultValue: ""
      },
      dataNascimento: {
        type: DataTypes.DATE,
        allowNull: true
      },
      genero: {
        type: DataTypes.STRING,
        defaultValue: ""
      },
      endereco: {
        type: DataTypes.STRING,
        defaultValue: ""
      },
      cidade: {
        type: DataTypes.STRING,
        defaultValue: ""
      },
      estado: {
        type: DataTypes.STRING,
        defaultValue: ""
      },
      cep: {
        type: DataTypes.STRING,
        defaultValue: ""
      },
      numeroProcedimentos: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      procedimentoFavorito: {
        type: DataTypes.STRING,
        defaultValue: ""
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "ATIVO"
      },
      classificacao: {
        type: DataTypes.STRING,
        defaultValue: "NOVO"
      },
      observacoes: {
        type: DataTypes.TEXT,
        defaultValue: ""
      },
      alergias: {
        type: DataTypes.TEXT,
        defaultValue: ""
      },
      historicoMedico: {
        type: DataTypes.TEXT,
        defaultValue: ""
      },
      ultimoContato: {
        type: DataTypes.DATE,
        allowNull: true
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
    return queryInterface.dropTable("Pacientes");
  }
};
