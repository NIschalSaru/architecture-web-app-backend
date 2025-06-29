"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      fullName: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
      },
      phoneNumber: {
        type: Sequelize.STRING,
        unique: true,
      },
      filename: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      filepath: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      password: {
        type: Sequelize.STRING,
      },
      role: {
        type: Sequelize.ENUM("user", "admin"),
        defaultValue: "user",
      },
      gender: {
        type: Sequelize.ENUM("male", "female"),
        defaultValue: "male",
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      passwordResetToken: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      passwordChangedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      passwordResetTokenExpiry: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("users");
  },
};
