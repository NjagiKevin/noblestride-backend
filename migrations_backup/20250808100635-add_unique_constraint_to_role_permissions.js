'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('role_permissions', {
      fields: ['role_id', 'permission_id'],
      type: 'unique',
      name: 'unique_role_permission'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('role_permissions', 'unique_role_permission');
  }
};
