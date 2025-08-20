require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('../Models');

async function createInvestorUser() {
  try {
    const Role = db.roles;
    const User = db.users;

    // Find the Investor role
    const investorRole = await Role.findOne({
      where: { name: 'Investor' }
    });

    if (!investorRole) {
      console.error('Investor role not found. Please run role seeders first.');
      process.exit(1);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create or find the investor user
    const [user, created] = await User.findOrCreate({
      where: { email: 'vickyjr88@yahoo.co.uk' },
      defaults: {
        name: 'Vicky Junior',
        email: 'vickyjr88@yahoo.co.uk',
        password: hashedPassword,
        role: 'Investor',
        role_id: investorRole.role_id,
        kyc_status: 'Verified',
        status: 'Open',
        phone: '+254700000001'
      }
    });

    if (created) {
      console.log('New investor user created successfully:');
    } else {
      // Update the existing user to be an investor
      await user.update({
        role: 'Investor',
        role_id: investorRole.role_id,
        password: hashedPassword
      });
      console.log('Existing user updated to investor:');
    }

    console.log(`Name: ${user.name}`);
    console.log(`Email: vickyjr88@yahoo.co.uk`);
    console.log(`Role: Investor`);
    console.log(`Password: password123`);
    console.log(`Status: ${user.status}`);
    console.log(`KYC Status: ${user.kyc_status}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating investor user:', error);
    process.exit(1);
  }
}

createInvestorUser();