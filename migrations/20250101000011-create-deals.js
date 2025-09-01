'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('deals', {
      deal_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      project: {
        type: Sequelize.STRING,
        allowNull: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      image_url: {
        type: Sequelize.STRING,
        allowNull: true
      },
      deal_stage_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'deal_stages',
          key: 'stage_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      status: {
        type: Sequelize.ENUM('Active', 'Pending', 'Open', 'On Hold', 'Inactive', 'Closed', 'Closed & Reopened', 'Archived'),
        defaultValue: 'Open',
        allowNull: false
      },
      ticket_size: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      deal_size: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false
      },
      sector_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'sectors',
          key: 'sector_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      subsector_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'subsectors',
          key: 'subsector_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      target_company_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      key_investors: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      visibility: {
        type: Sequelize.ENUM('Public', 'Private'),
        defaultValue: 'Public',
        allowNull: false
      },
      deal_type: {
        type: Sequelize.ENUM('Equity', 'Debt', 'Equity and Debt'),
        allowNull: true
      },
      maximum_selling_stake: {
        type: Sequelize.ENUM('Minority', 'Majority', 'Open', 'Full'),
        allowNull: true
      },
      teaser: {
        type: Sequelize.ENUM('Yes', 'No'),
        defaultValue: 'Yes',
        allowNull: false
      },
      model: {
        type: Sequelize.ENUM('Yes', 'No'),
        defaultValue: 'No',
        allowNull: false
      },
      has_information_memorandum: {
        type: Sequelize.ENUM('Yes', 'No'),
        allowNull: true
      },
      has_vdr: {
        type: Sequelize.ENUM('Yes', 'No'),
        allowNull: true
      },
      consultant_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      retainer_amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true
      },
      success_fee_percentage: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
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
    await queryInterface.addIndex('deals', ['status']);
    await queryInterface.addIndex('deals', ['visibility']);
    await queryInterface.addIndex('deals', ['sector_id']);
    await queryInterface.addIndex('deals', ['subsector_id']);
    await queryInterface.addIndex('deals', ['target_company_id']);
    await queryInterface.addIndex('deals', ['created_by']);
    await queryInterface.addIndex('deals', ['deal_stage_id']);
    await queryInterface.addIndex('deals', ['deal_type']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('deals');
  }
};