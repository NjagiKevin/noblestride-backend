require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('../Models');

async function createSuperuser() {
  try {
    // Find the Administrator role
    const adminRole = await db.roles.findOne({
      where: { name: 'Administrator' }
    });

    if (!adminRole) {
      console.error('Administrator role not found. Please run seeders first.');
      process.exit(1);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create the admin user
    const [user, created] = await db.users.findOrCreate({
      where: { email: 'admin@noblestride.co.ke' },
      defaults: {
        name: 'Admin User',
        email: 'admin@noblestride.co.ke',
        password: hashedPassword,
        role: 'Administrator',
        role_id: adminRole.role_id,
        phone: '+254700000000',
        status: 'Open'
      }
    });

    if (created) {
      console.log('Superuser created successfully:');
    } else {
      // Update the existing user to be an admin
      await user.update({
        role: 'Administrator',
        role_id: adminRole.role_id,
        password: hashedPassword
      });
      console.log('Existing user updated to superuser:');
    }

    console.log(`Email: admin@noblestride.co.ke`);
    console.log(`Password: password123`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createSuperuser();
