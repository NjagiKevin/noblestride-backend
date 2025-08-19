require('dotenv').config();
const db = require('../Models');

async function assignAllPermissionsToAdmin() {
  try {
    const Role = db.roles;
    const Permission = db.permissions;
    const RolePermission = db.role_permissions;

    // Find the Administrator role
    const adminRole = await Role.findOne({
      where: { name: 'Administrator' }
    });

    if (!adminRole) {
      console.error('Administrator role not found. Please run seeders first.');
      process.exit(1);
    }

    // Fetch all permissions
    const permissions = await Permission.findAll();
    if (!permissions.length) {
      console.error('No permissions found. Please run permission seeders first.');
      process.exit(1);
    }

    // Remove existing permissions for Administrator role
    await RolePermission.destroy({ where: { role_id: adminRole.role_id } });

    // Map permissions to role_permissions entries
    const rolePermissions = permissions.map((permission) => ({
      role_id: adminRole.role_id,
      permission_id: permission.permission_id,
    }));

    // Assign all permissions to the Administrator role
    await RolePermission.bulkCreate(rolePermissions, {
      ignoreDuplicates: true,
    });

    console.log(`Successfully assigned ${permissions.length} permissions to Administrator role.`);
    console.log('Administrator role now has access to all system permissions.');
    process.exit(0);
  } catch (error) {
    console.error('Error assigning permissions to Administrator role:', error);
    process.exit(1);
  }
}

assignAllPermissionsToAdmin();