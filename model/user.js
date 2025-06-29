const { DataTypes, Model } = require("sequelize");
const { sequelizeInstance } = require("../database/databaseConnection.js");

class User extends Model {}

User.init(
  {
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    filepath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
    },
    gender: {
      type: DataTypes.ENUM("male", "female"),
      allowNull: false,
    },
    passwordChangedAt: {
      type: DataTypes.DATE,
    },
    passwordResetToken: {
      type: DataTypes.STRING,
    },
    passwordResetTokenExpiry: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
  },
  {
    sequelize: sequelizeInstance,
    modelName: "User",
    tableName: "users",
    timestamps: true,
    paranoid: true,
  }
);

module.exports = User;
