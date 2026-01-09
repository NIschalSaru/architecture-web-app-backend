"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("team_members", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      designation: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      contact_no: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_featured: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      filename: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      filepath: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: true,
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
    await queryInterface.dropTable("team_members");
  },
};
