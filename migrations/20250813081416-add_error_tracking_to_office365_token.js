'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Office365Tokens', 'lastRefreshError', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn('Office365Tokens', 'lastRefreshAttempt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Office365Tokens', 'lastRefreshError');
    await queryInterface.removeColumn('Office365Tokens', 'lastRefreshAttempt');
  }
};
