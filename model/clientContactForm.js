const { DataTypes } = require("sequelize");
const { sequelizeInstance } = require("../database/databaseConnection.js");

const ClientContactForm = sequelizeInstance.define(
  "ClientContactForm",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    requirements: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    services: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "client_contact_form",
    timestamps: true,
    paranoid: true,
  }
);

module.exports = ClientContactForm;
