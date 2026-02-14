const { DataTypes, Model } = require("sequelize");
const { sequelizeInstance } = require("../database/databaseConnection.js");

class TeamMember extends Model {}

TeamMember.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    designation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contact_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: {
        msg: "This email is already in use",
      },
      validate: {
        isEmail: {
          msg: "Please provide a valid email address",
        },
      },
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: {
        msg: "This order position is already occupied",
      },
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    filepath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: sequelizeInstance,
    modelName: "TeamMember",
    tableName: "team_members",
    paranoid: true,
    timestamps: true,
  }
);

module.exports = TeamMember;
