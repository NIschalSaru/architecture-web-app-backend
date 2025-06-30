"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash("@Ndnb2025!Secure", 10);
    await queryInterface.bulkInsert("users", [
      {
        fullName: "superadmin",
        email: "ndbofficials@gmail.com",
        phoneNumber: "9851356590",
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
