'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('countries', {
      country_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false
      },
      continent_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'continents',
          key: 'continent_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      region_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'regions',
          key: 'region_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create indexes
    await queryInterface.addIndex('countries', ['name']);
    await queryInterface.addIndex('countries', ['code']);
    await queryInterface.addIndex('countries', ['continent_id']);
    await queryInterface.addIndex('countries', ['region_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('countries');
  }
};