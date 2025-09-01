'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex('Users', ['name', 'role'], {
      name: 'users_name_role_idx',
      unique: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('Users', 'users_name_role_idx');
  },
};