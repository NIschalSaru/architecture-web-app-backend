const { DataTypes } = require("sequelize");
const { sequelizeInstance } = require("../database/databaseConnection.js");

const ProjectType = sequelizeInstance.define(
  "ProjectType",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "project_types",
    timestamps: true,
    paranoid: true,
  }
);

ProjectType.associate = (models) => {
  ProjectType.hasMany(models.Project, {
    foreignKey: "project_type_id",
    as: "projects",
  });
};

module.exports = ProjectType;
