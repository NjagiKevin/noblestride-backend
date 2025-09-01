'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      profile_image: {
        type: Sequelize.STRING,
        allowNull: true
      },
      kyc_status: {
        type: Sequelize.ENUM('Pending', 'Verified', 'Rejected'),
        defaultValue: 'Pending',
        allowNull: false
      },
      preference_sector: {
        type: Sequelize.JSON,
        allowNull: true
      },
      preference_region: {
        type: Sequelize.JSON,
        allowNull: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM('Investor', 'Administrator', 'Target Company', 'Employee', 'Contact Person', 'Super Administrator', 'Advisor'),
        defaultValue: 'Investor',
        allowNull: false
      },
      role_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'role_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      status: {
        type: Sequelize.ENUM('On Hold', 'Open', 'Closed', 'Archived'),
        defaultValue: 'Open',
        allowNull: false
      },
      total_investments: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      average_check_size: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true
      },
      successful_exits: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      portfolio_ipr: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      addressable_market: {
        type: Sequelize.STRING,
        allowNull: true
      },
      current_market: {
        type: Sequelize.STRING,
        allowNull: true
      },
      total_assets: {
        type: Sequelize.STRING,
        allowNull: true
      },
      ebitda: {
        type: Sequelize.STRING,
        allowNull: true
      },
      gross_margin: {
        type: Sequelize.STRING,
        allowNull: true
      },
      cac_payback_period: {
        type: Sequelize.STRING,
        allowNull: true
      },
      tam: {
        type: Sequelize.STRING,
        allowNull: true
      },
      sam: {
        type: Sequelize.STRING,
        allowNull: true
      },
      som: {
        type: Sequelize.STRING,
        allowNull: true
      },
      year_founded: {
        type: Sequelize.STRING,
        allowNull: true
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          is: /^[+]?[1-9]?[0-9]{7,15}$/
        }
      },
      parent_user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
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
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Create indexes
    await queryInterface.addIndex('users', ['email']);
    await queryInterface.addIndex('users', ['role_id']);
    await queryInterface.addIndex('users', ['status']);
    await queryInterface.addIndex('users', ['kyc_status']);
    await queryInterface.addIndex('users', ['parent_user_id']);
    await queryInterface.addIndex('users', ['deleted_at']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};