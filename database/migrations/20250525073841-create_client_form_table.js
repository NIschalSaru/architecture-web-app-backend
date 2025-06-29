"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("clients_form", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      fullName: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      mobile: {
        type: Sequelize.STRING,
      },
      site_location: {
        type: Sequelize.STRING,
      },
      site_area: {
        type: Sequelize.STRING,
      },
      type_of_building: {
        type: Sequelize.STRING,
      },
      project_duration: {
        type: Sequelize.STRING,
      },
      access_road_width: {
        type: Sequelize.STRING,
      },
      topography: {
        type: Sequelize.STRING,
      },
      site_orientation_details: {
        type: Sequelize.TEXT,
      },
      site_orientation: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      FAR: {
        type: Sequelize.STRING,
      },
      GCR: {
        type: Sequelize.STRING,
      },
      setback: {
        type: Sequelize.STRING,
      },
      no_of_floor: {
        type: Sequelize.INTEGER,
      },
      parking_area: {
        type: Sequelize.STRING,
      },
      room_requirements: {
        type: Sequelize.TEXT,
      },
      status: {
        type: Sequelize.ENUM("checked", "unchecked", "declined"),
        defaultValue: "unchecked",
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("clients_form");
  },
};
