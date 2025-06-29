const { DataTypes } = require("sequelize");
const { sequelizeInstance } = require("../database/databaseConnection.js");

const TrustedClient = sequelizeInstance.define(
  "TrustedClient",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    filepath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fileurl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    feature: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "trusted_clients",
    timestamps: true,
    paranoid: true,
  }
);

module.exports = TrustedClient;
