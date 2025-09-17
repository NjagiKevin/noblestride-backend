'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Update existing rows to a default value (e.g., the ID of an admin user)
    await queryInterface.bulkUpdate('milestones', { created_by: 1 }, { created_by: null });
  },

  down: async (queryInterface, Sequelize) => {
    // There is no need to revert this change
  },
};