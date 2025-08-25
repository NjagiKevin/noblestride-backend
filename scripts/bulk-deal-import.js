const fs = require('fs');
const csv = require('csv-parser'); // Import csv-parser
const { Sequelize, DataTypes, Op } = require('sequelize');
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

// Define Models
const User = require('../Models/userModel')(sequelize, DataTypes);
const Deal = require('../Models/dealModel')(sequelize, DataTypes);
const Sector = require('../Models/sectorModel')(sequelize, DataTypes);
const Role = require('../Models/roleModel')(sequelize, DataTypes);

const importDeals = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Fetch roles for Target Company and Administrator (Deal Lead)
    const targetCompanyRole = await Role.findOne({ where: { name: 'Target Company' } });
    const administratorRole = await Role.findOne({ where: { name: 'Administrator' } });

    if (!targetCompanyRole || !administratorRole) {
      console.error('Required roles (Target Company or Administrator) not found. Please seed the roles table first.');
      await sequelize.close();
      return;
    }

    const results = [];
    fs.createReadStream(path.resolve(__dirname, '../Noblestride_Capital_Active_Deals_All_Deals.csv'))
      .pipe(csv({
        skipLines: 5, // Skip the first 5 empty lines
        mapHeaders: ({ header, index }) => {
          // Manually map headers to clean names
          const headers = [
            'Project', 'Sector', 'Target Profile', 'Deal Type', 'Max Selling Stake',
            'Ticket Size ($Mn)', 'Status', 'Company Name', 'Date Onboarded',
            'Deal Lead', 'Teaser', 'IM', 'Model', 'VDR', 'Consultant'
          ];
          return headers[index];
        }
      }))
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        for (const row of results) {
          const project = row['Project'];
          const sectorName = row['Sector'];
          const targetProfile = row['Target Profile'];
          let dealType = row['Deal Type'];
          const maxSellingStake = row['Max Selling Stake'];
          const ticketSizeStr = row['Ticket Size ($Mn)'];
          const status = row['Status'];
          const companyName = row['Company Name'];
          const dateOnboarded = row['Date Onboarded'];
          const dealLeadName = row['Deal Lead'];
          const teaser = row['Teaser'];
          const im = row['IM'];
          const model = row['Model'];
          const vdr = row['VDR'];
          const consultantName = row['Consultant'];

          if (dealType === 'Equity & Debt') {
            dealType = 'Equity and Debt';
          }

          // Skip if essential data is missing
          if (!project || !sectorName || !companyName || !dealLeadName) {
            console.warn(`Skipping row due to missing essential data: Project=${project}, Company=${companyName}, DealLead=${dealLeadName}`);
            continue;
          }

          // 1. Find or create Target Company User
          let targetCompanyUser;
          try {
            const randomSuffix = Math.floor(Math.random() * 100000);
            const generatedEmail = `${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}${randomSuffix}@example.com`;
            [targetCompanyUser] = await User.findOrCreate({
              where: { name: companyName, role: 'Target Company' },
              defaults: {
                name: companyName,
                email: generatedEmail,
                password: 'defaultpassword',
                role: 'Target Company',
                role_id: targetCompanyRole.role_id,
                description: targetProfile,
                kyc_status: 'Pending',
                status: 'Open',
              },
              logging: console.log, // Log the query
            });
            if (targetCompanyUser) {
              console.log(`Successfully found or created user for ${companyName}`);
            } else {
              throw new Error('findOrCreate returned null or undefined');
            }
          } catch (error) {
            console.error(`Error finding/creating target company user ${companyName}:`, error.message);
            console.error(`Skipping deal for ${companyName} due to user creation failure.`);
            continue; // Skip to the next row
          }

          // 2. Find Deal Lead User
          let dealLeadUser;
          try {
            console.log(`Searching for Deal Lead: ${dealLeadName}`);
            dealLeadUser = await User.findOne({
              where: { name: dealLeadName, role: 'Administrator' },
              timeout: 5000, // 5 second timeout
            });
            if (!dealLeadUser) {
              console.error(`Deal Lead user not found for: ${dealLeadName}. Skipping deal ${project}.`);
              continue;
            }
            console.log(`Found Deal Lead: ${dealLeadUser.name}`);
          } catch (error) {
            console.error(`Error finding deal lead user ${dealLeadName}:`, error.message);
            continue;
          }

          // 3. Find Sector
          let sector;
          try {
            sector = await Sector.findOne({ where: { name: sectorName } });
            if (!sector) {
              console.error(`Sector not found for: ${sectorName}. Skipping deal ${project}.`);
              continue;
            }
          } catch (error) {
            console.error(`Error finding sector ${sectorName}:`, error.message);
            continue;
          }

          // 4. Create Deal
          try {
            const ticketSize = parseFloat(ticketSizeStr);
            const dealStatus = status === 'Closed & Reopened' ? 'Closed & Reopened' : status;

            await Deal.findOrCreate({
              where: { title: project, target_company_id: targetCompanyUser.id },
              defaults: {
                title: project,
                project: project,
                description: targetProfile,
                status: dealStatus,
                ticket_size: isNaN(ticketSize) ? null : ticketSize,
                deal_size: isNaN(ticketSize) ? null : ticketSize,
                sector_id: sector.sector_id,
                target_company_id: targetCompanyUser.id,
                created_by: dealLeadUser.id,
                deal_type: dealType || null,
                maximum_selling_stake: maxSellingStake || null,
                teaser: teaser === 'Yes' ? 'Yes' : 'No',
                model: model === 'Yes' ? 'Yes' : 'No',
                has_information_memorandum: im === 'Yes' ? 'Yes' : 'No',
                has_vdr: vdr === 'Yes' ? 'Yes' : 'No',
                consultant_name: consultantName || null,
              },
            });
            console.log(`Processed deal: ${project} for ${companyName}`);
          } catch (error) {
            console.error(`Error creating deal ${project} for ${companyName}:`, error.message);
          }
        }

        console.log('Finished processing CSV file.');
        await sequelize.close();
      });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    if (sequelize) {
      await sequelize.close();
    }
  }
};

importDeals();