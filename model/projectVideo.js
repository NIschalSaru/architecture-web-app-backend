const { DataTypes } = require("sequelize");
const { sequelizeInstance } = require("../database/databaseConnection.js");

const ProjectVideo = sequelizeInstance.define(
  "ProjectVideo",
  {
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    video_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "project_videos",
    timestamps: true,
    paranoid: true,
  }
);

ProjectVideo.associate = (models) => {
  ProjectVideo.belongsTo(models.Project, {
    foreignKey: "project_id",
    as: "project",
  });
};

module.exports = ProjectVideo;
