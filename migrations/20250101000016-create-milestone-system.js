'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create milestones table
    await queryInterface.createTable('milestones', {
      milestone_id: {
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
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('Pending', 'Completed'),
        defaultValue: 'Pending',
        allowNull: false
      },
      due_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      commission_amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true
      },
      invoice_generated: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
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

    // Create tasks table
    await queryInterface.createTable('tasks', {
      task_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('Pending', 'In Progress', 'Completed'),
        defaultValue: 'Pending',
        allowNull: false
      },
      assigned_to: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
      due_date: {
        type: Sequelize.DATE,
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

    // Create indexes for milestones
    await queryInterface.addIndex('milestones', ['deal_id']);
    await queryInterface.addIndex('milestones', ['status']);
    await queryInterface.addIndex('milestones', ['deal_stage_id']);
    await queryInterface.addIndex('milestones', ['due_date']);

    // Create indexes for tasks
    await queryInterface.addIndex('tasks', ['assigned_to']);
    await queryInterface.addIndex('tasks', ['created_by']);
    await queryInterface.addIndex('tasks', ['deal_id']);
    await queryInterface.addIndex('tasks', ['deal_stage_id']);
    await queryInterface.addIndex('tasks', ['status']);
    await queryInterface.addIndex('tasks', ['due_date']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tasks');
    await queryInterface.dropTable('milestones');
  }
};