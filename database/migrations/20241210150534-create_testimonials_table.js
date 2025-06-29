"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("testimonials", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      rating: {
        type: Sequelize.FLOAT,
        validate: {
          max: 5,
          min: 0,
        },
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
      title: {
        type: Sequelize.STRING,
        unique: true,
      },
      message: {
        type: Sequelize.TEXT,
      },
      fullname: {
        type: Sequelize.STRING,
      },
      designation: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("testimonials");
  },
};
