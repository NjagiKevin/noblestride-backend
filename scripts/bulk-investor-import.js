const fs = require('fs');
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
    host: process.env.DB_HOST || 'localhost', // Default to localhost if DB_HOST is not set
    port: process.env.DB_PORT || 5432, // Use provided port or default to 5432
    dialect: 'postgres',
    logging: false,
  }
);

// Define User and Role models
const User = require('../Models/userModel')(sequelize, DataTypes);
const Role = require('../Models/roleModel')(sequelize, DataTypes);

const saltRounds = 10;
const defaultPassword = 'password123';

const importInvestors = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Find the Investor role
    const investorRole = await Role.findOne({ where: { name: 'Investor' } });
    if (!investorRole) {
      console.error('Investor role not found. Please seed the roles table first.');
      await sequelize.close();
      return;
    }

    const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);

    const fileContent = fs.readFileSync(path.resolve(__dirname, '../Investor_Tracker_Contacts_PE.csv'), 'utf-8');
    const lines = fileContent.split('\n');

    let currentFirm = null;
    let currentWebsite = null;
    let currentSectorFocus = null;
    let currentOther = null;

    const headerLine = lines.findIndex(line => line.includes('Firm,Website,Contact Persons,LinkedIn,Contacts: Email,Tel. Number,Sector focus,Others'));
    if (headerLine === -1) {
        console.error('Could not find the header row in the CSV.');
        await sequelize.close();
        return;
    }

    const dataLines = lines.slice(headerLine + 1);

    for (const line of dataLines) {
        const columns = line.split(',');

        if (columns.length < 8) continue; // Skip malformed lines

        const firm = columns[1] ? columns[1].trim() : '';
        const website = columns[2] ? columns[2].trim() : '';
        const contactPerson = columns[3] ? columns[3].trim() : '';
        const email = columns[5] ? columns[5].trim() : '';
        const telNumber = columns[6] ? columns[6].trim() : '';
        const sectorFocus = columns[7] ? columns[7].trim() : '';
        const others = columns[8] ? columns[8].trim() : '';


        if (firm) {
            currentFirm = firm;
            currentWebsite = website;
            currentSectorFocus = sectorFocus;
            currentOther = others;
        }

        if (contactPerson && email) {
            try {
                const [user, created] = await User.findOrCreate({
                    where: { email: email },
                    defaults: {
                        name: contactPerson,
                        email: email,
                        password: hashedPassword,
                        role: 'Investor',
                        role_id: investorRole.role_id,
                        phone: telNumber,
                        location: currentFirm,
                        preference_sector: currentSectorFocus ? JSON.stringify(currentSectorFocus.split(';')) : null,
                        description: currentOther,
                        kyc_status: 'Pending',
                        status: 'Open',
                    },
                });

                if (created) {
                    console.log(`Created user: ${contactPerson} (${email})`);
                } else {
                    console.log(`User already exists: ${contactPerson} (${email})`);
                }
            } catch (error) {
                console.error(`Error creating user ${contactPerson} (${email}):`, error.message);
            }
        }
    }

    console.log('Finished processing CSV file.');
    await sequelize.close();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    if (sequelize) {
        await sequelize.close();
    }
  }
};

importInvestors();