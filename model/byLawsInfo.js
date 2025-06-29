const { DataTypes } = require("sequelize");
const { sequelizeInstance } = require("../database/databaseConnection.js");

const ByLawsInfo = sequelizeInstance.define(
  "ByLawsInfo",
  {
    title: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    imagepath: {
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
    feature: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "by_laws_info",
    timestamps: true,
    paranoid: true,
  }
);

module.exports = ByLawsInfo;
