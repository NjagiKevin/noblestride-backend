require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('../Models');

async function updateUserToAdmin() {
  try {
    // Find the Administrator role
    const adminRole = await db.roles.findOne({
      where: { name: 'Administrator' }
    });

    if (!adminRole) {
      console.error('Administrator role not found');
      process.exit(1);
    }

    // Get the first user (or you can specify email to find specific user)
    const user = await db.users.findOne();

    if (!user) {
      console.error('No user found');
      process.exit(1);
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Update the user
    await user.update({
      role_id: adminRole.role_id,
      role: 'Administrator',
      password: hashedPassword
    });

    console.log(`Updated user ${user.email} to Administrator role with new password`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateUserToAdmin();
