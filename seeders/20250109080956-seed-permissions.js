'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const permissionsToSeed = [
      {
        name: 'CREATE_DEAL',
      },
      {
        name: 'UPDATE_DEAL',
      },
      {
        name: 'DELETE_DEAL',
      },
      {
        name: 'VIEW_DEAL',
      },
      {
        name: 'CREATE_AUDIT_LOG',
      },
      {
        name: 'VIEW_ALL_AUDIT_LOGS',
      },
      {
        name: 'VIEW_AUDIT_LOG_BY_ID',
      },
      {
        name: 'CREATE_CONTACT_PERSON',
      },
      {
        name: 'VIEW_CONTACT_PERSONS',
      },
      {
        name: 'VIEW_CONTACT_PERSON_BY_ID',
      },
      {
        name: 'UPDATE_CONTACT_PERSON',
      },
      {
        name: 'DELETE_CONTACT_PERSON',
      },
      {
        name: 'VIEW_CONTACT_PERSONS_BY_USER',
      },
      {
        name: 'CREATE_CONTINENT',
      },
      {
        name: 'VIEW_ALL_CONTINENTS',
      },
      {
        name: 'VIEW_CONTINENT_BY_ID',
      },
      {
        name: 'UPDATE_CONTINENT',
      },
      {
        name: 'DELETE_CONTINENT',
      },
      {
        name: 'CREATE_CONTINENT_PREFERENCE',
      },
      {
        name: 'VIEW_CONTINENT_PREFERENCES',
      },
      {
        name: 'VIEW_USER_CONTINENT_PREFERENCES',
      },
      {
        name: 'UPDATE_CONTINENT_PREFERENCE',
      },
      {
        name: 'DELETE_CONTINENT_PREFERENCE',
      },
      {
        name: 'BULK_CREATE_CONTINENT_PREFERENCES',
      },
      {
        name: 'CREATE_COUNTRY',
      },
      {
        name: 'VIEW_ALL_COUNTRIES',
      },
      {
        name: 'VIEW_COUNTRY_BY_ID',
      },
      {
        name: 'UPDATE_COUNTRY',
      },
      {
        name: 'DELETE_COUNTRY',
      },
      {
        name: 'FILTER_COUNTRIES',
      },
      {
        name: 'CREATE_COUNTRY_PREFERENCE',
      },
      {
        name: 'VIEW_COUNTRY_PREFERENCES',
      },
      {
        name: 'UPDATE_COUNTRY_PREFERENCE',
      },
      {
        name: 'DELETE_COUNTRY_PREFERENCE',
      },
      {
        name: 'BULK_CREATE_COUNTRY_PREFERENCES',
      },
      {
        name: 'ADD_CONTINENT_TO_DEAL',
      },
      {
        name: 'REMOVE_CONTINENT_FROM_DEAL',
      },
      {
        name: 'VIEW_DEAL_CONTINENTS',
      },
      {
        name: 'FILTER_DEALS',
      },
      {
        name: 'MARK_DEAL_AS_ACTIVE',
      },
      {
        name: 'MARK_DEAL_AS_CLOSED',
      },
      {
        name: 'MARK_DEAL_AS_ARCHIVED',
      },
      {
        name: 'GET_DEALS_BY_USER_PREFERENCES',
      },
      {
        name: 'GET_TARGET_COMPANY_DEALS',
      },
      {
        name: 'GET_DEAL_MILESTONES_AND_TASKS',
      },
      {
        name: 'MARK_DEAL_AS_ON_HOLD',
      },
      {
        name: 'MARK_DEAL_AS_PENDING',
      },
      {
        name: 'MARK_DEAL_AS_CLOSED_AND_REOPENED',
      },
      {
        name: 'FILTER_DEALS_BY_LOCATION',
      },
      {
        name: 'UPDATE_DEAL_STAGE',
      },
      {
        name: 'ADD_COUNTRY_TO_DEAL',
      },
      {
        name: 'REMOVE_COUNTRY_FROM_DEAL',
      },
      {
        name: 'VIEW_COUNTRIES_FOR_DEAL',
      },
      {
        name: 'CREATE_DEAL_MILESTONE',
      },
      {
        name: 'VIEW_ALL_DEAL_MILESTONES',
      },
      {
        name: 'VIEW_DEAL_MILESTONE_BY_ID',
      },
      {
        name: 'UPDATE_DEAL_MILESTONE',
      },
      {
        name: 'DELETE_DEAL_MILESTONE',
      },
      {
        name: 'CREATE_DEAL_MILESTONE_STATUS',
      },
      {
        name: 'VIEW_ALL_DEAL_MILESTONE_STATUSES',
      },
      {
        name: 'VIEW_DEAL_MILESTONE_STATUS_BY_ID',
      },
      {
        name: 'UPDATE_DEAL_MILESTONE_STATUS',
      },
      {
        name: 'DELETE_DEAL_MILESTONE_STATUS',
      },
      {
        name: 'ADD_REGION_TO_DEAL',
      },
      {
        name: 'REMOVE_REGION_FROM_DEAL',
      },
      {
        name: 'VIEW_REGIONS_FOR_DEAL',
      },
      {
        name: 'CREATE_DEAL_STAGE',
      },
      {
        name: 'VIEW_ALL_DEAL_STAGES',
      },
      {
        name: 'VIEW_DEAL_STAGE_BY_ID',
      },
      {
        name: 'DELETE_DEAL_STAGE',
      },
      {
        name: 'CREATE_DEAL_TYPE_PREFERENCE',
      },
      {
        name: 'VIEW_DEAL_TYPE_PREFERENCES',
      },
      {
        name: 'UPDATE_DEAL_TYPE_PREFERENCE',
      },
      {
        name: 'DELETE_DEAL_TYPE_PREFERENCE',
      },
      {
        name: 'CREATE_MULTIPLE_DEAL_TYPE_PREFERENCES',
      },
      {
        name: 'VIEW_UNIQUE_DEAL_TYPE_PREFERENCES',
      },
      {
        name: 'CREATE_DOCUMENT',
      },
      {
        name: 'VIEW_ALL_DOCUMENTS',
      },
      {
        name: 'VIEW_DOCUMENT_BY_ID',
      },
      {
        name: 'UPDATE_DOCUMENT',
      },
      {
        name: 'DELETE_DOCUMENT',
      },
      {
        name: 'ARCHIVE_DOCUMENT',
      },
      {
        name: 'FILTER_DOCUMENTS',
      },
      {
        name: 'GET_DOCUMENTS_BY_USER_DEALS',
      },
      {
        name: 'GET_DOCUMENTS_FOR_USER_WITH_SHARE_STATUS',
      },
      {
        name: 'GET_DOCUMENT_SIGNING_URL',
      },
      {
        name: 'SHARE_DOCUMENT',
      },
      {
        name: 'ACCEPT_DOCUMENT_SHARE',
      },
      {
        name: 'REJECT_DOCUMENT_SHARE',
      },
      {
        name: 'VIEW_DOCUMENT_SHARES',
      },
      {
        name: 'CREATE_DOCUMENT_TYPE',
      },
      {
        name: 'VIEW_ALL_DOCUMENT_TYPES',
      },
      {
        name: 'VIEW_DOCUMENT_TYPE_BY_ID',
      },
      {
        name: 'UPDATE_DOCUMENT_TYPE',
      },
      {
        name: 'DELETE_DOCUMENT_TYPE',
      },
      {
        name: 'CREATE_FOLDER',
      },
      {
        name: 'VIEW_ALL_FOLDERS',
      },
      {
        name: 'VIEW_FOLDER_BY_ID',
      },
      {
        name: 'UPDATE_FOLDER',
      },
      {
        name: 'DELETE_FOLDER',
      },
      {
        name: 'ARCHIVE_FOLDER',
      },
      {
        name: 'FILTER_FOLDERS',
      },
      {
        name: 'GET_FOLDERS_BY_USER',
      },
      {
        name: 'GET_ACCEPTED_AND_PENDING_FOLDER_INVITES',
      },
      {
        name: 'ADD_INVESTOR_TO_DEAL_STAGE',
      },
      {
        name: 'UPDATE_INVESTOR_DEAL_STAGE',
      },
      {
        name: 'VIEW_INVESTOR_DEAL_STAGES',
      },
      {
        name: 'REMOVE_INVESTOR_FROM_DEAL_STAGE',
      },
      {
        name: 'CREATE_INVESTOR_MILESTONE',
      },
      {
        name: 'VIEW_ALL_INVESTOR_MILESTONES',
      },
      {
        name: 'VIEW_INVESTOR_MILESTONE_BY_ID',
      },
      {
        name: 'UPDATE_INVESTOR_MILESTONE',
      },
      {
        name: 'DELETE_INVESTOR_MILESTONE',
      },
      {
        name: 'CREATE_INVESTOR_MILESTONE_STATUS',
      },
      {
        name: 'VIEW_ALL_INVESTOR_MILESTONE_STATUSES',
      },
      {
        name: 'VIEW_INVESTOR_MILESTONE_STATUS_BY_ID',
      },
      {
        name: 'UPDATE_INVESTOR_MILESTONE_STATUS',
      },
      {
        name: 'DELETE_INVESTOR_MILESTONE_STATUS',
      },
      {
        name: 'MARK_INVESTOR_MILESTONE_STATUS_AS_COMPLETED',
      },
      {
        name: 'MARK_INVESTOR_MILESTONE_STATUS_AS_PENDING',
      },
      {
        name: 'VIEW_INVESTOR_MILESTONE_STATUSES_BY_USER_AND_DEAL',
      },
      {
        name: 'VIEW_INVESTOR_MILESTONE_STATUSES_BY_USER',
      },
      {
        name: 'CREATE_INVESTMENT',
      },
      {
        name: 'VIEW_ALL_INVESTMENTS',
      },
      {
        name: 'VIEW_INVESTMENT_BY_ID',
      },
      {
        name: 'UPDATE_INVESTMENT',
      },
      {
        name: 'DELETE_INVESTMENT',
      },
      {
        name: 'TRACK_INVESTOR_BEHAVIOR',
      },
      {
        name: 'CREATE_MILESTONE',
      },
      {
        name: 'VIEW_ALL_MILESTONES',
      },
      {
        name: 'VIEW_MILESTONE_BY_ID',
      },
      {
        name: 'UPDATE_MILESTONE',
      },
      {
        name: 'DELETE_MILESTONE',
      },
      {
        name: 'FILTER_MILESTONES',
      },
      {
        name: 'GET_MILESTONES_BY_DEAL_ID',
      },
      {
        name: 'GET_MILESTONES_FOR_USER',
      },
      {
        name: 'CREATE_NOTIFICATION',
      },
      {
        name: 'VIEW_USER_NOTIFICATIONS',
      },
      {
        name: 'MARK_NOTIFICATION_AS_READ',
      },
      {
        name: 'SEND_PREDICTIVE_NOTIFICATIONS',
      },
      {
        name: 'CREATE_PERMISSION',
      },
      {
        name: 'VIEW_ALL_PERMISSIONS',
      },
      {
        name: 'VIEW_PERMISSION_BY_ID',
      },
      {
        name: 'UPDATE_PERMISSION',
      },
      {
        name: 'DELETE_PERMISSION',
      },
      {
        name: 'CREATE_PIPELINE_STAGE',
      },
      {
        name: 'VIEW_ALL_PIPELINE_STAGES',
      },
      {
        name: 'VIEW_PIPELINE_STAGE_BY_ID',
      },
      {
        name: 'UPDATE_PIPELINE_STAGE',
      },
      {
        name: 'DELETE_PIPELINE_STAGE',
      },
      {
        name: 'GET_PIPELINE_STAGES_BY_PIPELINE_ID',
      },
      {
        name: 'CREATE_PRIMARY_LOCATION_PREFERENCE',
      },
      {
        name: 'VIEW_PRIMARY_LOCATION_PREFERENCES',
      },
      {
        name: 'UPDATE_PRIMARY_LOCATION_PREFERENCE',
      },
      {
        name: 'DELETE_PRIMARY_LOCATION_PREFERENCE',
      },
      {
        name: 'CREATE_REGION',
      },
      {
        name: 'VIEW_ALL_REGIONS',
      },
      {
        name: 'VIEW_REGION_BY_ID',
      },
      {
        name: 'UPDATE_REGION',
      },
      {
        name: 'DELETE_REGION',
      },
      {
        name: 'CREATE_REGION_PREFERENCE',
      },
      {
        name: 'VIEW_REGION_PREFERENCES',
      },
      {
        name: 'UPDATE_REGION_PREFERENCE',
      },
      {
        name: 'DELETE_REGION_PREFERENCE',
      },
      {
        name: 'BULK_CREATE_REGION_PREFERENCES',
      },
      {
        name: 'CREATE_ROLE',
      },
      {
        name: 'VIEW_ALL_ROLES',
      },
      {
        name: 'VIEW_ROLE_BY_ID',
      },
      {
        name: 'UPDATE_ROLE',
      },
      {
        name: 'DELETE_ROLE',
      },
      {
        name: 'ASSIGN_PERMISSIONS_TO_ROLE',
      },
      {
        name: 'CREATE_SECTOR',
      },
      {
        name: 'VIEW_ALL_SECTORS',
      },
      {
        name: 'VIEW_SECTOR_BY_ID',
      },
      {
        name: 'UPDATE_SECTOR',
      },
      {
        name: 'DELETE_SECTOR',
      },
      {
        name: 'BULK_UPLOAD_SECTORS_AND_SUBSECTORS',
      },
      {
        name: 'CREATE_SECTOR_PREFERENCE',
      },
      {
        name: 'VIEW_SECTOR_PREFERENCES',
      },
      {
        name: 'UPDATE_SECTOR_PREFERENCE',
      },
      {
        name: 'DELETE_SECTOR_PREFERENCE',
      },
      {
        name: 'BULK_CREATE_SECTOR_PREFERENCES',
      },
      {
        name: 'CREATE_SOCIAL_ACCOUNT_TYPE',
      },
      {
        name: 'VIEW_ALL_SOCIAL_ACCOUNT_TYPES',
      },
      {
        name: 'VIEW_SOCIAL_ACCOUNT_TYPE_BY_ID',
      },
      {
        name: 'UPDATE_SOCIAL_ACCOUNT_TYPE',
      },
      {
        name: 'DELETE_SOCIAL_ACCOUNT_TYPE',
      },
      {
        name: 'BULK_UPLOAD_SOCIAL_ACCOUNT_TYPES',
      },
      {
        name: 'CREATE_SOCIAL_MEDIA_ACCOUNT',
      },
      {
        name: 'VIEW_SOCIAL_MEDIA_ACCOUNTS_BY_USER',
      },
      {
        name: 'UPDATE_SOCIAL_MEDIA_ACCOUNT',
      },
      {
        name: 'DELETE_SOCIAL_MEDIA_ACCOUNT',
      },
      {
        name: 'CREATE_STAGE_CARD',
      },
      {
        name: 'VIEW_ALL_STAGE_CARDS',
      },
      {
        name: 'VIEW_STAGE_CARD_BY_ID',
      },
      {
        name: 'UPDATE_STAGE_CARD',
      },
        {
          name: 'DELETE_STAGE_CARD',
        },
        {
          name: 'SEND_SUBFOLDER_ACCESS_INVITE',
        },
        {
          name: 'ACCEPT_SUBFOLDER_ACCESS_INVITE',
        },
        {
          name: 'REJECT_SUBFOLDER_ACCESS_INVITE',
        },
        {
          name: 'GET_SUBFOLDER_INVITES',
        },
        {
          name: 'CREATE_SUBFOLDER',
        },
        {
          name: 'VIEW_SUBFOLDER_BY_ID',
        },
        {
          name: 'VIEW_ALL_SUBFOLDERS_FOR_PARENT_FOLDER',
        },
        {
          name: 'UPDATE_SUBFOLDER',
        },
        {
          name: 'DELETE_SUBFOLDER',
        },
        {
          name: 'CREATE_SUBSECTOR',
        },
        {
          name: 'VIEW_ALL_SUBSECTORS',
        },
        {
          name: 'VIEW_SUBSECTOR_BY_ID',
        },
        {
          name: 'UPDATE_SUBSECTOR',
        },
        {
          name: 'DELETE_SUBSECTOR',
        },
        {
          name: 'CREATE_SUBSECTOR_PREFERENCE',
        },
        {
          name: 'VIEW_SUBSECTOR_PREFERENCES',
        },
        {
          name: 'UPDATE_SUBSECTOR_PREFERENCE',
        },
        {
          name: 'DELETE_SUBSECTOR_PREFERENCE',
        },
        {
          name: 'BULK_CREATE_SUBSECTOR_PREFERENCES',
        },
        {
          name: 'CREATE_TASK',
        },
        {
          name: 'VIEW_ALL_TASKS',
        },
        {
          name: 'VIEW_TASK_BY_ID',
        },
        {
          name: 'UPDATE_TASK',
        },
        {
          name: 'DELETE_TASK',
        },
        {
          name: 'ASSIGN_TASK_TO_USER',
        },
        {
          name: 'MARK_TASK_AS_COMPLETED',
        },
        {
          name: 'FILTER_TASKS',
        },
        {
          name: 'SCHEDULE_DEAL_MEETING',
        },
        {
          name: 'VIEW_DEAL_MEETINGS',
        },
        {
          name: 'UPDATE_DEAL_MEETING',
        },
        {
          name: 'DELETE_DEAL_MEETING',
        },
        {
          name: 'UPDATE_MILESTONE_STATUS',
        },
        {
          name: 'GET_INVOICES_BY_DEAL_ID',
        },
        {
          name: 'SEND_DEAL_ACCESS_INVITE',
        },
        {
          name: 'GET_INVESTOR_INVITES',
        },
        {
          name: 'GET_DEAL_INVITES',
        },
        {
          name: 'REJECT_DEAL_INVITE',
        },
        {
          name: 'ACCEPT_DEAL_INVITE',
        },
        {
          name: 'EXPRESS_DEAL_INTEREST',
        },
        {
          name: 'CHECK_ACCEPTED_DEAL_ACCESS_INVITE',
        },
        {
          name: 'WITHDRAW_DEAL_INTEREST',
        },
        {
          name: 'GET_DASHBOARD_DEAL_STATUS_DATA',
        },
        {
          name: 'GET_DASHBOARD_DEAL_TYPE_DATA',
        },
        {
          name: 'GET_DASHBOARD_DEAL_SECTOR_DATA',
        },
        {
          name: 'GET_DASHBOARD_DEAL_SIZE_DATA',
        },
        {
          name: 'GET_DASHBOARD_DEAL_CONSULTANT_STATUS_DATA',
        },
        {
          name: 'SEND_FOLDER_ACCESS_INVITE',
        },
        {
          name: 'ACCEPT_FOLDER_ACCESS_INVITE',
        },
        {
          name: 'REJECT_FOLDER_ACCESS_INVITE',
        },
        {
          name: 'GET_FOLDER_INVITES',
        },
        {
          name: 'GET_REGION_WITH_COUNTRIES',
        },
        {
          name: 'GET_CONTINENT_WITH_REGIONS',
        },
        {
          name: 'GET_CONTINENT_WITH_COUNTRIES',
        },
        {
          name: 'GET_SUBSECTOR_BY_SECTOR_ID',
        },
        {
          name: 'GET_TASKS_BY_DUE_DATE_RANGE',
        },
        {
          name: 'GET_TASKS_FOR_USER_DEALS',
        },
        {
          name: 'GET_USER_TASKS_BY_DEAL_ID',
        },
        {
          name: 'GET_MEETINGS_BY_DEAL_ID',
        },
        {
          name: 'FILTER_DEAL_MEETINGS',
        },
        {
          name: 'CREATE_TRANSACTION',
        },
        {
          name: 'GET_ALL_TRANSACTIONS',
        },
        {
          name: 'GET_TRANSACTION_BY_ID',
        },
        {
          name: 'UPDATE_TRANSACTION',
        },
        {
          name: 'DELETE_TRANSACTION',
        },
        {
          name: 'CREATE_USER_PREFERENCE',
        },
        {
          name: 'GET_USER_PREFERENCES',
        },
        {
          name: 'UPDATE_USER_PREFERENCE',
        },
        {
          name: 'DELETE_USER_PREFERENCE',
        },
        {
          name: 'CREATE_USER_REVIEW',
        },
        {
          name: 'GET_USER_REVIEWS',
        },
        {
          name: 'GET_USER_REVIEW_BY_ID',
        },
        {
          name: 'UPDATE_USER_REVIEW',
        },
        {
          name: 'DELETE_USER_REVIEW',
        },
        {
          name: 'GET_USERS_BY_TYPE',
        },
        {
          name: 'BULK_UPLOAD_USERS',
        },
        {
          name: 'GET_USER_BY_ID',
        },
        {
          name: 'DELETE_USER',
        },
        {
          name: 'GET_PROFILE',
        },
        {
          name: 'GET_EMPLOYEES',
        },
        {
          name: 'UPDATE_USER_STATUS',
        },
        {
          name: 'MARK_USER_AS_ARCHIVED',
        },
        {
          name: 'MARK_USER_AS_OPEN',
        },
        {
          name: 'MARK_USER_AS_ON_HOLD',
        },
        {
          name: 'UPDATE_TOTAL_INVESTMENTS',
        },
        {
          name: 'UPDATE_AVERAGE_CHECK_SIZE',
        },
        {
          name: 'UPDATE_SUCCESSFUL_EXITS',
        },
        {
          name: 'UPDATE_PORTFOLIO_IPR',
        },
        {
          name: 'UPDATE_DESCRIPTION',
        },
        {
          name: 'UPDATE_ADDRESSABLE_MARKET',
        },
        {
          name: 'UPDATE_CURRENT_MARKET',
        },
        {
          name: 'UPDATE_TAM',
        },
        {
          name: 'UPDATE_SAM',
        },
        {
          name: 'UPDATE_LOCATION',
        },
        {
          name: 'UPDATE_YEAR_FOUNDED',
        },
        {
          name: 'UPDATE_SOM',
        },
        {
          name: 'UPDATE_CAC',
        },
        {
          name: 'UPDATE_EBITDA',
        },
        {
          name: 'UPDATE_TOTAL_ASSETS',
        },
        {
          name: 'UPDATE_GROSS_MARGIN',
        },
        {
          name: 'UPDATE_USER_PROFILE',
        },
        {
          name: 'ADMIN_UPDATE_USER_PROFILE',
        },
        {
          name: 'ONBOARD_INVESTOR',
        },
        {
          name: 'UPLOAD_PROFILE_IMAGE',
        },
        {
          name: 'ONBOARD_TARGET_COMPANY',
        },
        {
          name: 'ADD_EMPLOYEE',
        },
        {
          name: 'UPDATE_EMPLOYEE',
        },
        {
          name: 'DELETE_EMPLOYEE',
        },
        {
          name: 'CREATE_EMPLOYEE_FOR_INVESTMENT_FIRM',
        },
        {
          name: 'GET_EMPLOYEES_FOR_INVESTMENT_FIRM',
        },
        {
          name: 'CREATE_USER_TICKET_PREFERENCE',
        },
        {
          name: 'GET_USER_TICKET_PREFERENCES',
        },
        {
          name: 'UPDATE_USER_TICKET_PREFERENCE',
        },
        {
          name: 'DELETE_USER_TICKET_PREFERENCE',
        },
        {
          name: 'GET_SETTINGS',
        },
        {
          name: 'UPDATE_SETTINGS',
        },
        {
          name: 'VIEW_PROFILE',
        },
        {
          name: 'VIEW_ALL_DEALS',
        },
      ].map(permission => ({
        ...permission,
        permission_id: Sequelize.literal('uuid_generate_v4()'),
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

    const existingPermissions = await queryInterface.sequelize.query(
      'SELECT name FROM permissions',
      { type: Sequelize.QueryTypes.SELECT }
    );
    const existingPermissionNames = new Set(existingPermissions.map(p => p.name));

    const newPermissions = permissionsToSeed.filter(
      permission => !existingPermissionNames.has(permission.name)
    );

    if (newPermissions.length > 0) {
      await queryInterface.bulkInsert('permissions', newPermissions, {});
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('permissions', null, {});
  },
};
