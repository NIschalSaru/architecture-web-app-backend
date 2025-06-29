const { DataTypes } = require("sequelize");
const { sequelizeInstance } = require("../database/databaseConnection.js");

const Client = sequelizeInstance.define(
  "Client",
  {
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    mobile: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "clients",
    timestamps: true,
    paranoid: true,
  }
);

Client.associate = (models) => {
  Client.belongsTo(models.Project, {
    foreignKey: "project_id",
    as: "project",
  });
};

module.exports = Client;
