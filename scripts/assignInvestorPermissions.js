require('dotenv').config();
const db = require('../Models');

async function assignInvestorPermissions() {
  try {
    const Role = db.roles;
    const Permission = db.permissions;
    const RolePermission = db.role_permissions;

    // Find the Investor role
    const investorRole = await Role.findOne({
      where: { name: 'Investor' }
    });

    if (!investorRole) {
      console.error('Investor role not found. Please run role seeders first.');
      process.exit(1);
    }

    // Define investor-appropriate permissions
    const investorPermissionNames = [
      // Profile and User Management
      'VIEW_PROFILE',
      'GET_PROFILE',
      'UPDATE_USER_PROFILE',
      'UPLOAD_PROFILE_IMAGE',
      'ONBOARD_INVESTOR',
      
      // Deal Viewing and Management
      'VIEW_ALL_DEALS',
      'VIEW_DEAL',
      'FILTER_DEALS',
      'GET_DEALS_BY_USER_PREFERENCES',
      'FILTER_DEALS_BY_LOCATION',
      'VIEW_DEAL_CONTINENTS',
      'VIEW_COUNTRIES_FOR_DEAL',
      'VIEW_REGIONS_FOR_DEAL',
      'GET_DEAL_MILESTONES_AND_TASKS',
      
      // Deal Interaction
      'EXPRESS_DEAL_INTEREST',
      'WITHDRAW_DEAL_INTEREST',
      'ACCEPT_DEAL_INVITE',
      'REJECT_DEAL_INVITE',
      'GET_DEAL_INVITES',
      'GET_INVESTOR_INVITES',
      'CHECK_ACCEPTED_DEAL_ACCESS_INVITE',
      
      // Deal Stages and Milestones
      'VIEW_ALL_DEAL_STAGES',
      'VIEW_DEAL_STAGE_BY_ID',
      'VIEW_ALL_DEAL_MILESTONES',
      'VIEW_DEAL_MILESTONE_BY_ID',
      'VIEW_ALL_DEAL_MILESTONE_STATUSES',
      'VIEW_DEAL_MILESTONE_STATUS_BY_ID',
      
      // Investor-specific Operations
      'ADD_INVESTOR_TO_DEAL_STAGE',
      'UPDATE_INVESTOR_DEAL_STAGE',
      'VIEW_INVESTOR_DEAL_STAGES',
      'VIEW_ALL_INVESTOR_MILESTONES',
      'VIEW_INVESTOR_MILESTONE_BY_ID',
      'CREATE_INVESTOR_MILESTONE_STATUS',
      'VIEW_ALL_INVESTOR_MILESTONE_STATUSES',
      'VIEW_INVESTOR_MILESTONE_STATUS_BY_ID',
      'UPDATE_INVESTOR_MILESTONE_STATUS',
      'MARK_INVESTOR_MILESTONE_STATUS_AS_COMPLETED',
      'MARK_INVESTOR_MILESTONE_STATUS_AS_PENDING',
      'VIEW_INVESTOR_MILESTONE_STATUSES_BY_USER_AND_DEAL',
      'VIEW_INVESTOR_MILESTONE_STATUSES_BY_USER',
      
      // Investment Management
      'CREATE_INVESTMENT',
      'VIEW_ALL_INVESTMENTS',
      'VIEW_INVESTMENT_BY_ID',
      'UPDATE_INVESTMENT',
      'TRACK_INVESTOR_BEHAVIOR',
      
      // Document Management
      'VIEW_ALL_DOCUMENTS',
      'VIEW_DOCUMENT_BY_ID',
      'FILTER_DOCUMENTS',
      'GET_DOCUMENTS_BY_USER_DEALS',
      'GET_DOCUMENTS_FOR_USER_WITH_SHARE_STATUS',
      'GET_DOCUMENT_SIGNING_URL',
      'ACCEPT_DOCUMENT_SHARE',
      'REJECT_DOCUMENT_SHARE',
      'VIEW_DOCUMENT_SHARES',
      'VIEW_ALL_DOCUMENT_TYPES',
      'VIEW_DOCUMENT_TYPE_BY_ID',
      
      // Folder Management
      'VIEW_ALL_FOLDERS',
      'VIEW_FOLDER_BY_ID',
      'FILTER_FOLDERS',
      'GET_FOLDERS_BY_USER',
      'ACCEPT_FOLDER_ACCESS_INVITE',
      'REJECT_FOLDER_ACCESS_INVITE',
      'GET_FOLDER_INVITES',
      'GET_ACCEPTED_AND_PENDING_FOLDER_INVITES',
      'ACCEPT_SUBFOLDER_ACCESS_INVITE',
      'REJECT_SUBFOLDER_ACCESS_INVITE',
      'GET_SUBFOLDER_INVITES',
      'VIEW_SUBFOLDER_BY_ID',
      'VIEW_ALL_SUBFOLDERS_FOR_PARENT_FOLDER',
      
      // Preferences Management
      'CREATE_CONTINENT_PREFERENCE',
      'VIEW_CONTINENT_PREFERENCES',
      'VIEW_USER_CONTINENT_PREFERENCES',
      'UPDATE_CONTINENT_PREFERENCE',
      'DELETE_CONTINENT_PREFERENCE',
      'BULK_CREATE_CONTINENT_PREFERENCES',
      'CREATE_COUNTRY_PREFERENCE',
      'VIEW_COUNTRY_PREFERENCES',
      'UPDATE_COUNTRY_PREFERENCE',
      'DELETE_COUNTRY_PREFERENCE',
      'BULK_CREATE_COUNTRY_PREFERENCES',
      'CREATE_REGION_PREFERENCE',
      'VIEW_REGION_PREFERENCES',
      'UPDATE_REGION_PREFERENCE',
      'DELETE_REGION_PREFERENCE',
      'BULK_CREATE_REGION_PREFERENCES',
      'CREATE_SECTOR_PREFERENCE',
      'VIEW_SECTOR_PREFERENCES',
      'UPDATE_SECTOR_PREFERENCE',
      'DELETE_SECTOR_PREFERENCE',
      'BULK_CREATE_SECTOR_PREFERENCES',
      'CREATE_SUBSECTOR_PREFERENCE',
      'VIEW_SUBSECTOR_PREFERENCES',
      'UPDATE_SUBSECTOR_PREFERENCE',
      'DELETE_SUBSECTOR_PREFERENCE',
      'BULK_CREATE_SUBSECTOR_PREFERENCES',
      'CREATE_DEAL_TYPE_PREFERENCE',
      'VIEW_DEAL_TYPE_PREFERENCES',
      'UPDATE_DEAL_TYPE_PREFERENCE',
      'DELETE_DEAL_TYPE_PREFERENCE',
      'CREATE_MULTIPLE_DEAL_TYPE_PREFERENCES',
      'VIEW_UNIQUE_DEAL_TYPE_PREFERENCES',
      'CREATE_PRIMARY_LOCATION_PREFERENCE',
      'VIEW_PRIMARY_LOCATION_PREFERENCES',
      'UPDATE_PRIMARY_LOCATION_PREFERENCE',
      'DELETE_PRIMARY_LOCATION_PREFERENCE',
      'CREATE_USER_PREFERENCE',
      'GET_USER_PREFERENCES',
      'UPDATE_USER_PREFERENCE',
      'DELETE_USER_PREFERENCE',
      'CREATE_USER_TICKET_PREFERENCE',
      'GET_USER_TICKET_PREFERENCES',
      'UPDATE_USER_TICKET_PREFERENCE',
      'DELETE_USER_TICKET_PREFERENCE',
      
      // Reference Data Viewing
      'VIEW_ALL_CONTINENTS',
      'VIEW_CONTINENT_BY_ID',
      'VIEW_ALL_COUNTRIES',
      'VIEW_COUNTRY_BY_ID',
      'FILTER_COUNTRIES',
      'VIEW_ALL_REGIONS',
      'VIEW_REGION_BY_ID',
      'VIEW_ALL_SECTORS',
      'VIEW_SECTOR_BY_ID',
      'VIEW_ALL_SUBSECTORS',
      'VIEW_SUBSECTOR_BY_ID',
      'GET_REGION_WITH_COUNTRIES',
      'GET_CONTINENT_WITH_REGIONS',
      'GET_CONTINENT_WITH_COUNTRIES',
      'GET_SUBSECTOR_BY_SECTOR_ID',
      
      // Milestones and Tasks
      'VIEW_ALL_MILESTONES',
      'VIEW_MILESTONE_BY_ID',
      'FILTER_MILESTONES',
      'GET_MILESTONES_BY_DEAL_ID',
      'GET_MILESTONES_FOR_USER',
      'VIEW_ALL_TASKS',
      'VIEW_TASK_BY_ID',
      'FILTER_TASKS',
      'GET_TASKS_BY_DUE_DATE_RANGE',
      'GET_TASKS_FOR_USER_DEALS',
      'GET_USER_TASKS_BY_DEAL_ID',
      
      // Meetings
      'VIEW_DEAL_MEETINGS',
      'GET_MEETINGS_BY_DEAL_ID',
      'FILTER_DEAL_MEETINGS',
      
      // Notifications
      'VIEW_USER_NOTIFICATIONS',
      'MARK_NOTIFICATION_AS_READ',
      
      // Dashboard Data
      'GET_DASHBOARD_DEAL_STATUS_DATA',
      'GET_DASHBOARD_DEAL_TYPE_DATA',
      'GET_DASHBOARD_DEAL_SECTOR_DATA',
      'GET_DASHBOARD_DEAL_SIZE_DATA',
      'GET_DASHBOARD_DEAL_CONSULTANT_STATUS_DATA',
      
      // Contact Management
      'CREATE_CONTACT_PERSON',
      'VIEW_CONTACT_PERSONS',
      'VIEW_CONTACT_PERSON_BY_ID',
      'UPDATE_CONTACT_PERSON',
      'DELETE_CONTACT_PERSON',
      'VIEW_CONTACT_PERSONS_BY_USER',
      
      // Transactions
      'GET_ALL_TRANSACTIONS',
      'GET_TRANSACTION_BY_ID',
      'GET_INVOICES_BY_DEAL_ID',
      
      // User Reviews
      'CREATE_USER_REVIEW',
      'GET_USER_REVIEWS',
      'GET_USER_REVIEW_BY_ID',
      'UPDATE_USER_REVIEW',
      
      // Pipeline Viewing
      'VIEW_ALL_PIPELINE_STAGES',
      'VIEW_PIPELINE_STAGE_BY_ID',
      'GET_PIPELINE_STAGES_BY_PIPELINE_ID',
      
      // Social Media
      'VIEW_ALL_SOCIAL_ACCOUNT_TYPES',
      'VIEW_SOCIAL_ACCOUNT_TYPE_BY_ID',
      'CREATE_SOCIAL_MEDIA_ACCOUNT',
      'VIEW_SOCIAL_MEDIA_ACCOUNTS_BY_USER',
      'UPDATE_SOCIAL_MEDIA_ACCOUNT',
      'DELETE_SOCIAL_MEDIA_ACCOUNT',
      
      // Settings
      'GET_SETTINGS',
      'UPDATE_SETTINGS',
      
      // Investment Profile Updates
      'UPDATE_TOTAL_INVESTMENTS',
      'UPDATE_AVERAGE_CHECK_SIZE',
      'UPDATE_SUCCESSFUL_EXITS',
      'UPDATE_PORTFOLIO_IPR'
    ];

    console.log(`Found ${investorPermissionNames.length} permissions appropriate for Investor role`);

    // Find all permissions by name
    const permissions = await Permission.findAll({
      where: {
        name: investorPermissionNames
      }
    });

    if (permissions.length === 0) {
      console.error('No permissions found. Please run permission seeders first.');
      process.exit(1);
    }

    console.log(`Found ${permissions.length} permissions in database`);

    // Remove existing permissions for Investor role
    await RolePermission.destroy({ where: { role_id: investorRole.role_id } });

    // Map permissions to role_permissions entries
    const rolePermissions = permissions.map((permission) => ({
      role_id: investorRole.role_id,
      permission_id: permission.permission_id,
    }));

    // Assign permissions to the Investor role
    await RolePermission.bulkCreate(rolePermissions, {
      ignoreDuplicates: true,
    });

    console.log(`Successfully assigned ${permissions.length} permissions to Investor role.`);
    console.log('Investor role now has appropriate permissions for investment activities.');
    
    // List missing permissions if any
    const foundPermissionNames = permissions.map(p => p.name);
    const missingPermissions = investorPermissionNames.filter(name => !foundPermissionNames.includes(name));
    
    if (missingPermissions.length > 0) {
      console.log(`\nNote: ${missingPermissions.length} permissions were not found in database:`);
      missingPermissions.forEach(name => console.log(`  - ${name}`));
    }

    process.exit(0);
  } catch (error) {
    console.error('Error assigning permissions to Investor role:', error);
    process.exit(1);
  }
}

assignInvestorPermissions();