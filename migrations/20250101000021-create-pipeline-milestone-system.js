'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create pipelines table
    await queryInterface.createTable('pipelines', {
      pipeline_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      target_amount: {
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

    // Create pipeline stages table
    await queryInterface.createTable('pipeline_stages', {
      stage_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      pipeline_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'pipelines',
          key: 'pipeline_id'
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

    // Create stage cards table
    await queryInterface.createTable('stage_cards', {
      card_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      pipeline_stage_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'pipeline_stages',
          key: 'stage_id'
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

    // Create investor deal stages table
    await queryInterface.createTable('investor_deal_stages', {
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
      stage_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'deal_stages',
          key: 'stage_id'
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

    // Create investor milestones table
    await queryInterface.createTable('investor_milestones', {
      milestone_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
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

    // Create investor milestone statuses table
    await queryInterface.createTable('investor_milestone_statuses', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      investor_milestone_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'investor_milestones',
          key: 'milestone_id'
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
      status: {
        type: Sequelize.ENUM('Pending', 'Completed'),
        defaultValue: 'Pending',
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

    // Create deal milestones table
    await queryInterface.createTable('deal_milestones', {
      milestone_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
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

    // Create deal milestone statuses table
    await queryInterface.createTable('deal_milestone_statuses', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      deal_milestone_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'deal_milestones',
          key: 'milestone_id'
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
      status: {
        type: Sequelize.ENUM('Pending', 'Completed'),
        defaultValue: 'Pending',
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

    // Create primary location preferences table (complex enum table)
    await queryInterface.createTable('primary_location_preferences', {
      preference_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
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
      continent: {
        type: Sequelize.ENUM(
          'Africa', 'Asia', 'Europe', 'North America', 
          'South America', 'Oceania', 'Antarctica'
        ),
        allowNull: false
      },
      country_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'countries',
          key: 'country_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      region: {
        type: Sequelize.ENUM(
          'West Africa', 'East Africa', 'North Africa', 'Central Africa', 'Southern Africa',
          'East Asia', 'Southeast Asia', 'South Asia', 'Central Asia', 'West Asia',
          'Western Europe', 'Eastern Europe', 'Northern Europe', 'Southern Europe',
          'North America', 'Central America', 'Caribbean',
          'South America',
          'Australia and New Zealand', 'Melanesia', 'Micronesia', 'Polynesia',
          'Antarctica'
        ),
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

    // Create user preferences table (legacy table for backward compatibility)
    await queryInterface.createTable('user_preferences', {
      preference_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
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
      sector_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'sectors',
          key: 'sector_id'
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

    // Create all indexes
    await queryInterface.addIndex('pipelines', ['name']);
    
    await queryInterface.addIndex('pipeline_stages', ['pipeline_id']);
    await queryInterface.addIndex('pipeline_stages', ['name']);
    
    await queryInterface.addIndex('stage_cards', ['pipeline_stage_id']);
    await queryInterface.addIndex('stage_cards', ['user_id']);
    
    await queryInterface.addIndex('investor_deal_stages', ['investor_id']);
    await queryInterface.addIndex('investor_deal_stages', ['deal_id']);
    await queryInterface.addIndex('investor_deal_stages', ['stage_id']);
    
    await queryInterface.addIndex('investor_milestones', ['name']);
    
    await queryInterface.addIndex('investor_milestone_statuses', ['investor_milestone_id']);
    await queryInterface.addIndex('investor_milestone_statuses', ['user_id']);
    await queryInterface.addIndex('investor_milestone_statuses', ['deal_id']);
    await queryInterface.addIndex('investor_milestone_statuses', ['status']);
    
    await queryInterface.addIndex('deal_milestones', ['name']);
    
    await queryInterface.addIndex('deal_milestone_statuses', ['deal_milestone_id']);
    await queryInterface.addIndex('deal_milestone_statuses', ['deal_id']);
    await queryInterface.addIndex('deal_milestone_statuses', ['status']);
    
    await queryInterface.addIndex('primary_location_preferences', ['user_id']);
    await queryInterface.addIndex('primary_location_preferences', ['country_id']);
    await queryInterface.addIndex('primary_location_preferences', ['continent']);
    await queryInterface.addIndex('primary_location_preferences', ['region']);
    
    await queryInterface.addIndex('user_preferences', ['user_id']);
    await queryInterface.addIndex('user_preferences', ['sector_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_preferences');
    await queryInterface.dropTable('primary_location_preferences');
    await queryInterface.dropTable('deal_milestone_statuses');
    await queryInterface.dropTable('deal_milestones');
    await queryInterface.dropTable('investor_milestone_statuses');
    await queryInterface.dropTable('investor_milestones');
    await queryInterface.dropTable('investor_deal_stages');
    await queryInterface.dropTable('stage_cards');
    await queryInterface.dropTable('pipeline_stages');
    await queryInterface.dropTable('pipelines');
  }
};