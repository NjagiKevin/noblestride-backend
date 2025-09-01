'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('documents', {
      document_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      deal_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'deals',
          key: 'deal_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      uploaded_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      file_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      file_path: {
        type: Sequelize.STRING,
        allowNull: false
      },
      folder_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'folders',
          key: 'folder_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      subfolder_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'subfolders',
          key: 'subfolder_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      file_type: {
        type: Sequelize.ENUM('pdf', 'docx', 'xlsx'),
        allowNull: true
      },
      version_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      upload_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      access_permissions: {
        type: Sequelize.JSON,
        allowNull: true
      },
      watermark_details: {
        type: Sequelize.JSON,
        allowNull: true
      },
      docusign_envelope_id: {
        type: Sequelize.STRING,
        allowNull: true
      },
      requires_signature: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      archived: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      document_type_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'document_types',
          key: 'type_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
    await queryInterface.addIndex('documents', ['deal_id']);
    await queryInterface.addIndex('documents', ['uploaded_by']);
    await queryInterface.addIndex('documents', ['folder_id']);
    await queryInterface.addIndex('documents', ['subfolder_id']);
    await queryInterface.addIndex('documents', ['file_type']);
    await queryInterface.addIndex('documents', ['document_type_id']);
    await queryInterface.addIndex('documents', ['archived']);
    await queryInterface.addIndex('documents', ['requires_signature']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('documents');
  }
};