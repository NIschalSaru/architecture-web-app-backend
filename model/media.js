const { DataTypes } = require("sequelize");
const { sequelizeInstance } = require("../database/databaseConnection.js");

const Media = sequelizeInstance.define(
  "Media",
  {
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image_type: {
      type: DataTypes.ENUM("feature", "gallery"),
      allowNull: false,
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
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "media",
    timestamps: true,
    paranoid: true,
  }
);

Media.associate = (models) => {
  Media.belongsTo(models.Project, {
    foreignKey: "project_id",
    as: "project",
  });
};

module.exports = Media;
