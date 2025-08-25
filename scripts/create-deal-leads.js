const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '../.env.development.local') });

// Database connection
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5436,
    dialect: 'postgres',
    logging: false,
  }
);

// Define User and Role models
const User = require('../Models/userModel')(sequelize, DataTypes);
const Role = require('../Models/roleModel')(sequelize, DataTypes);

const saltRounds = 10;
const defaultPassword = 'password123';

const dealLeads = [
  { name: 'Evans M', email: 'evans.m@example.com' },
  { name: 'Brenda C', email: 'brenda.c@example.com' },
  { name: 'James O', email: 'james.o@example.com' },
  { name: 'Duncan M', email: 'duncan.m@example.com' },
  { name: 'Sheilla W', email: 'sheilla.w@example.com' },
  { name: 'Amos G', email: 'amos.g@example.com' },
  { name: 'Cliff N', email: 'cliff.n@example.com' },
];

const createDealLeads = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    const administratorRole = await Role.findOne({ where: { name: 'Administrator' } });
    if (!administratorRole) {
      console.error('Administrator role not found. Please seed the roles table first.');
      await sequelize.close();
      return;
    }

    const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);

    for (const lead of dealLeads) {
      try {
        const [user, created] = await User.findOrCreate({
          where: { email: lead.email },
          defaults: {
            name: lead.name,
            email: lead.email,
            password: hashedPassword,
            role: 'Administrator',
            role_id: administratorRole.role_id,
            kyc_status: 'Verified', // Assuming administrators are verified
            status: 'Open',
          },
        });

        if (created) {
          console.log(`Created Administrator: ${lead.name} (${lead.email})`);
        } else {
          console.log(`Administrator already exists: ${lead.name} (${lead.email})`);
        }
      } catch (error) {
        console.error(`Error creating Administrator ${lead.name} (${lead.email}):`, error.message);
      }
    }
    console.log('Finished creating deal leads.');
    await sequelize.close();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    if (sequelize) {
      await sequelize.close();
    }
  }
};

createDealLeads();
