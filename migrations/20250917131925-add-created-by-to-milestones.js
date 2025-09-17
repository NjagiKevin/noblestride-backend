'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('milestones', 'created_by', {
      type: Sequelize.INTEGER,
      allowNull: true, // Temporarily allow null
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    // Update existing rows to a default value (e.g., the ID of an admin user)
    await queryInterface.bulkUpdate('milestones', { created_by: 1 }, { created_by: null });

    // Alter the column to not allow null values
    await queryInterface.changeColumn('milestones', 'created_by', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('milestones', 'created_by');
  },
};