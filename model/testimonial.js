const { DataTypes, Model } = require("sequelize");
const { sequelizeInstance } = require("../database/databaseConnection.js");

class Testimonial extends Model {}

Testimonial.init(
  {
    rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        max: 5,
        min: 0,
      },
    },
    title: {
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
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    designation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: sequelizeInstance,
    modelName: "Testimonial",
    tableName: "testimonials",
    paranoid: true,
    timestamps: true,
  }
);

module.exports = Testimonial;
