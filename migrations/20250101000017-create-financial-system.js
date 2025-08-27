'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create investors_deals junction table
    await queryInterface.createTable('investors_deals', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      investor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
      investment_amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false
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

    // Create transactions table
    await queryInterface.createTable('transactions', {
      transaction_id: {
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
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false
      },
      payment_method: {
        type: Sequelize.ENUM('Credit Card', 'Bank Transfer', 'Mobile Money'),
        allowNull: false
      },
      transaction_type: {
        type: Sequelize.ENUM('Commission', 'Milestone Payment', 'Subscription Fee'),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('Pending', 'Completed', 'Failed'),
        defaultValue: 'Pending',
        allowNull: false
      },
      transaction_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
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

    // Create invoices table
    await queryInterface.createTable('invoices', {
      invoice_id: {
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
      milestone_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'milestones',
          key: 'milestone_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('Pending', 'Paid'),
        defaultValue: 'Pending',
        allowNull: false
      },
      due_date: {
        type: Sequelize.DATE,
        allowNull: false
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
    await queryInterface.addIndex('investors_deals', ['investor_id']);
    await queryInterface.addIndex('investors_deals', ['deal_id']);
    await queryInterface.addConstraint('investors_deals', {
      fields: ['investor_id', 'deal_id'],
      type: 'unique',
      name: 'unique_investor_deal'
    });

    await queryInterface.addIndex('transactions', ['deal_id']);
    await queryInterface.addIndex('transactions', ['user_id']);
    await queryInterface.addIndex('transactions', ['status']);
    await queryInterface.addIndex('transactions', ['transaction_type']);
    await queryInterface.addIndex('transactions', ['transaction_date']);

    await queryInterface.addIndex('invoices', ['deal_id']);
    await queryInterface.addIndex('invoices', ['milestone_id']);
    await queryInterface.addIndex('invoices', ['status']);
    await queryInterface.addIndex('invoices', ['due_date']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('invoices');
    await queryInterface.dropTable('transactions');
    await queryInterface.dropTable('investors_deals');
  }
};