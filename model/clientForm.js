const { DataTypes } = require("sequelize");
const { sequelizeInstance } = require("../database/databaseConnection.js");

const ClientForm = sequelizeInstance.define(
  "ClientForm",
  {
    fullName: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    mobile: {
      type: DataTypes.STRING,
    },
    site_location: {
      type: DataTypes.STRING,
    },
    site_area: {
      type: DataTypes.STRING,
    },
    type_of_building: {
      type: DataTypes.STRING,
    },
    project_duration: {
      type: DataTypes.STRING,
    },
    access_road_width: {
      type: DataTypes.STRING,
    },
    topography: {
      type: DataTypes.STRING,
    },
    site_orientation_details: {
      type: DataTypes.TEXT,
    },
    site_orientation: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    FAR: {
      type: DataTypes.STRING,
    },
    GCR: {
      type: DataTypes.STRING,
    },
    setback: {
      type: DataTypes.STRING,
    },
    no_of_floor: {
      type: DataTypes.INTEGER,
    },
    parking_area: {
      type: DataTypes.STRING,
    },
    room_requirements: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.ENUM("checked", "unchecked", "declined"),
      defaultValue: "unchecked",
      allowNull: false,
    },
  },
  {
    tableName: "clients_form",
    timestamps: true,
    paranoid: true,
  }
);

module.exports = ClientForm;
