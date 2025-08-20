require('dotenv').config();
const db = require('../Models');

async function addViewProfilePermission() {
  try {
    const Role = db.roles;
    const Permission = db.permissions;
    const RolePermission = db.role_permissions;

    // Check if VIEW_PROFILE permission exists
    let viewProfilePermission = await Permission.findOne({
      where: { name: 'VIEW_PROFILE' }
    });

    // Create the permission if it doesn't exist
    if (!viewProfilePermission) {
      viewProfilePermission = await Permission.create({
        name: 'VIEW_PROFILE'
      });
      console.log('Created new permission: VIEW_PROFILE');
    } else {
      console.log('VIEW_PROFILE permission already exists');
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
        permission_id: viewProfilePermission.permission_id
      }
    });

    if (!existingRolePermission) {
      // Assign VIEW_PROFILE permission to Administrator role
      await RolePermission.create({
        role_id: adminRole.role_id,
        permission_id: viewProfilePermission.permission_id
      });
      console.log('Successfully assigned VIEW_PROFILE permission to Administrator role');
    } else {
      console.log('VIEW_PROFILE permission is already assigned to Administrator role');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addViewProfilePermission();