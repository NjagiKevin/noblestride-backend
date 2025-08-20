require('dotenv').config();
const db = require('../Models');

async function getUsersWithInvestorRole() {
  try {
    const Role = db.roles;
    const User = db.users;

    // Find the Investor role
    const investorRole = await Role.findOne({
      where: { name: 'Investor' }
    });

    if (!investorRole) {
      console.log('Investor role not found in the system.');
      process.exit(1);
    }

    // Find all users with Investor role
    const investorUsers = await User.findAll({
      where: { 
        role_id: investorRole.role_id,
        role: 'Investor'
      },
      attributes: ['id', 'name', 'email', 'role', 'status', 'kyc_status', 'createdAt']
    });

    if (investorUsers.length === 0) {
      console.log('No users found with Investor role.');
    } else {
      console.log(`Found ${investorUsers.length} user(s) with Investor role:`);
      console.log('================================================');
      
      investorUsers.forEach((user, index) => {
        console.log(`${index + 1}. User Details:`);
        console.log(`   ID: ${user.id}`);
        console.log(`   Name: ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Status: ${user.status}`);
        console.log(`   KYC Status: ${user.kyc_status}`);
        console.log(`   Created At: ${user.createdAt}`);
        console.log('   --------------------------------');
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('Error fetching users with Investor role:', error);
    process.exit(1);
  }
}

getUsersWithInvestorRole();