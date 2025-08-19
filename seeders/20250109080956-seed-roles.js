"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const rolesToSeed = [
      {
        name: "Administrator",
      },
      {
        name: "Investor",
      },
      {
        name: "Target Company",
      },
    ].map(role => ({
      ...role,
      role_id: Sequelize.literal("uuid_generate_v4()"),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const existingRoles = await queryInterface.sequelize.query(
      "SELECT name FROM roles",
      { type: Sequelize.QueryTypes.SELECT }
    );
    const existingRoleNames = new Set(existingRoles.map(role => role.name));

    const newRoles = rolesToSeed.filter(
      role => !existingRoleNames.has(role.name)
    );

    if (newRoles.length > 0) {
      await queryInterface.bulkInsert("roles", newRoles, {});
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("roles", null, {});
  },
};
