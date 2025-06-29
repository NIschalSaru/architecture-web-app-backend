const { DataTypes } = require("sequelize");
const { sequelizeInstance } = require("../database/databaseConnection.js");

const Project = sequelizeInstance.define(
  "Project",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    project_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    site_area: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "projects",
    timestamps: true,
    paranoid: true,
  }
);

Project.associate = (models) => {
  Project.hasOne(models.Client, {
    foreignKey: "project_id",
    as: "client",
  });

  Project.belongsTo(models.ProjectType, {
    foreignKey: "project_type_id",
    as: "projectType",
  });

  Project.hasMany(models.Media, {
    foreignKey: "project_id",
    as: "media",
  });
};

module.exports = Project;
