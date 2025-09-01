'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('subfolders', {
      subfolder_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      created_for: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      parent_folder_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'folders',
          key: 'folder_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      parent_subfolder_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'subfolders',
          key: 'subfolder_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      archived: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
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
    await queryInterface.addIndex('subfolders', ['created_by']);
    await queryInterface.addIndex('subfolders', ['created_for']);
    await queryInterface.addIndex('subfolders', ['parent_folder_id']);
    await queryInterface.addIndex('subfolders', ['parent_subfolder_id']);
    await queryInterface.addIndex('subfolders', ['archived']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('subfolders');
  }
};