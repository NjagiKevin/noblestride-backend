'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create deal leads table
    await queryInterface.createTable('deal_leads', {
      id: {
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

    // Create deal meetings table
    await queryInterface.createTable('deal_meetings', {
      meeting_id: {
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
      subject: {
        type: Sequelize.STRING,
        allowNull: false
      },
      start: {
        type: Sequelize.DATE,
        allowNull: false
      },
      end: {
        type: Sequelize.DATE,
        allowNull: false
      },
      attendees: {
        type: Sequelize.JSON,
        allowNull: false
      },
      meeting_link: {
        type: Sequelize.STRING,
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

    // Create signature records table
    await queryInterface.createTable('signature_records', {
      record_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      document_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'documents',
          key: 'document_id'
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
      signed_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
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

    // Create access invite tables
    await queryInterface.createTable('deal_access_invites', {
      invite_id: {
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
      status: {
        type: Sequelize.ENUM('Pending', 'Accepted', 'Rejected', 'Withdrawn'),
        defaultValue: 'Pending',
        allowNull: false
      },
      withdraw_reason: {
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

    await queryInterface.createTable('folder_access_invites', {
      invite_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      folder_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'folders',
          key: 'folder_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      user_email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('Pending', 'Accepted', 'Rejected'),
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

    await queryInterface.createTable('subfolder_access_invites', {
      invite_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      subfolder_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'subfolders',
          key: 'subfolder_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      user_email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('Pending', 'Accepted', 'Rejected'),
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

    await queryInterface.createTable('document_shares', {
      share_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      document_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'documents',
          key: 'document_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      user_email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('Pending', 'Accepted', 'Rejected'),
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

    // Create deal geographic junction tables
    await queryInterface.createTable('deal_continents', {
      id: {
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
      continent_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'continents',
          key: 'continent_id'
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

    await queryInterface.createTable('deal_regions', {
      id: {
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
      region_id: {
        type: Sequelize.UUID,
        allowNull: false,
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

    await queryInterface.createTable('deal_countries', {
      id: {
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

    // Create Office365 tokens table
    await queryInterface.createTable('Office365Tokens', {
      userId: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false
      },
      accessToken: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      refreshToken: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      expiresIn: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      acquiredAt: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      lastRefreshError: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      lastRefreshAttempt: {
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
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Create all necessary indexes
    await queryInterface.addIndex('deal_leads', ['deal_id']);
    await queryInterface.addIndex('deal_leads', ['user_id']);
    await queryInterface.addConstraint('deal_leads', {
      fields: ['deal_id', 'user_id'],
      type: 'unique',
      name: 'unique_deal_lead'
    });

    await queryInterface.addIndex('deal_meetings', ['deal_id']);
    await queryInterface.addIndex('deal_meetings', ['start']);
    await queryInterface.addIndex('deal_meetings', ['end']);

    await queryInterface.addIndex('signature_records', ['document_id']);
    await queryInterface.addIndex('signature_records', ['deal_id']);
    await queryInterface.addIndex('signature_records', ['user_id']);
    await queryInterface.addIndex('signature_records', ['signed_date']);

    await queryInterface.addIndex('deal_access_invites', ['investor_id']);
    await queryInterface.addIndex('deal_access_invites', ['deal_id']);
    await queryInterface.addIndex('deal_access_invites', ['status']);

    await queryInterface.addIndex('folder_access_invites', ['folder_id']);
    await queryInterface.addIndex('folder_access_invites', ['user_email']);
    await queryInterface.addIndex('folder_access_invites', ['status']);

    await queryInterface.addIndex('subfolder_access_invites', ['subfolder_id']);
    await queryInterface.addIndex('subfolder_access_invites', ['user_email']);

    await queryInterface.addIndex('document_shares', ['document_id']);
    await queryInterface.addIndex('document_shares', ['user_email']);

    await queryInterface.addIndex('deal_continents', ['deal_id']);
    await queryInterface.addIndex('deal_continents', ['continent_id']);

    await queryInterface.addIndex('deal_regions', ['deal_id']);
    await queryInterface.addIndex('deal_regions', ['region_id']);

    await queryInterface.addIndex('deal_countries', ['deal_id']);
    await queryInterface.addIndex('deal_countries', ['country_id']);

    await queryInterface.addIndex('Office365Tokens', ['userId']);
    await queryInterface.addIndex('Office365Tokens', ['deletedAt']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Office365Tokens');
    await queryInterface.dropTable('deal_countries');
    await queryInterface.dropTable('deal_regions');
    await queryInterface.dropTable('deal_continents');
    await queryInterface.dropTable('document_shares');
    await queryInterface.dropTable('subfolder_access_invites');
    await queryInterface.dropTable('folder_access_invites');
    await queryInterface.dropTable('deal_access_invites');
    await queryInterface.dropTable('signature_records');
    await queryInterface.dropTable('deal_meetings');
    await queryInterface.dropTable('deal_leads');
  }
};