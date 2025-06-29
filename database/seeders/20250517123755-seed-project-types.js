"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const projectTypes = [
      "Residential",
      "Commercial",
      "Restaurant & Cafe",
      "Hotel & Resort",
      "Entertainment",
      "Renovation",
      "Construction",
    ];

    const data = projectTypes.map((title) => ({
      title,
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("project_types", data, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("project_types", null, {});
  },
};
