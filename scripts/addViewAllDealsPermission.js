require('dotenv').config();
const db = require('../Models');

async function addViewAllDealsPermission() {
  try {
    const Role = db.roles;
    const Permission = db.permissions;
    const RolePermission = db.role_permissions;

    // Check if VIEW_ALL_DEALS permission exists
    let viewAllDealsPermission = await Permission.findOne({
      where: { name: 'VIEW_ALL_DEALS' }
    });

    // Create the permission if it doesn't exist
    if (!viewAllDealsPermission) {
      viewAllDealsPermission = await Permission.create({
        name: 'VIEW_ALL_DEALS'
      });
      console.log('Created new permission: VIEW_ALL_DEALS');
    } else {
      console.log('VIEW_ALL_DEALS permission already exists');
    }

    // Find the Administrator role
    const adminRole = await Role.findOne({
      where: { name: 'Administrator' }
    });

    if (!adminRole) {
      console.error('Administrator role not found. Please run seeders first.');
      process.exit(1);
    }

    // Check if the permission is already assigned to the Administrator role
    const existingRolePermission = await RolePermission.findOne({
      where: {
        role_id: adminRole.role_id,
        permission_id: viewAllDealsPermission.permission_id
      }
    });

    if (!existingRolePermission) {
      // Assign VIEW_ALL_DEALS permission to Administrator role
      await RolePermission.create({
        role_id: adminRole.role_id,
        permission_id: viewAllDealsPermission.permission_id
      });
      console.log('Successfully assigned VIEW_ALL_DEALS permission to Administrator role');
    } else {
      console.log('VIEW_ALL_DEALS permission is already assigned to Administrator role');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addViewAllDealsPermission();