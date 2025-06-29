"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash("admin@123", 10);
    await queryInterface.bulkInsert("users", [
      {
        fullName: "SuperAdmin",
        email: "admin@gmail.com",
        phoneNumber: "9800000000",
        password: hashedPassword,
        role: "admin",
        gender: "male",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        passwordResetToken: null,
        passwordChangedAt: null,
        passwordResetTokenExpiry: null,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("users", null, {});
  },
};
