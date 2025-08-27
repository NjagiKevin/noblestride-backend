'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      UPDATE "deals" SET "maximum_selling_stake" = 'Majority' WHERE "maximum_selling_stake" = 'majority';
    `);
    await queryInterface.sequelize.query(`
      UPDATE "deals" SET "maximum_selling_stake" = 'Minority' WHERE "maximum_selling_stake" = 'minority';
    `);
    await queryInterface.sequelize.query(`
      UPDATE "deals" SET "maximum_selling_stake" = 'Open' WHERE "maximum_selling_stake" = 'open';
    `);
    await queryInterface.sequelize.query(`
      UPDATE "deals" SET "maximum_selling_stake" = 'Full' WHERE "maximum_selling_stake" = 'full';
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // No down migration needed for this data fix
  }
};