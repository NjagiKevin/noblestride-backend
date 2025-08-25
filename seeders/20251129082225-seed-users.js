"use strict";

const db = require("../Models");
const bcrypt = require("bcrypt");
const Role = db.roles;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash("password123", 10);

    const companies = [
      "Alicia Bakers & Confectioners Ltd",
      "Peal Agro",
      "ABNO Softwares",
      "AirDuka",
      "Bethel Consult",
      "666*",
      "Six Squares Ltd",
      "Eldo Tea",
      "Machakos Millers",
      "ALS",
      "Amotech Africa",
      "CIBO Industries Limited",
      "Busia Chicken",
      "Camino Ruiz",
      "Babu Babu Commodities",
      "The Big Thunder Nut",
      "Jarine Limited",
      "Harvest Berry Avocado",
      "Kwalito",
      "KK Foods",
      "Arch Ventures",
      "Gilfilian Airconditining",
      "Kisumu Concrete Products Ltd",
      "Thika School of Medical and Health Sciences",
      "NWH College",
      "St. Lawrence University",
      "Lakewood Group of Schools",
      "BrazAfric Group of Companies",
      "All in Trade",
      "Zonful Energy",
      "MobileMart",
      "3KM Energy Systems Ltd",
      "Country Energy (Uganda) Limited",
      "Victoria Commercial Bank",
      "Brisk Credit",
      "KWFT",
      "Chicken Basket",
      "SUMAC MFB",
      "Octagon",
      "Jijenge Credit Ltd",
      "Musoni MFI",
      "Rafode",
      "Middle East Bank Kenya",
      "Credit Bank",
      "Edenbridge",
      "Development Bank",
      "Family Bank",
      "Paramount Bank",
      "DigiTax",
      "Madison Insurance",
      "Yako Bank Uganda Ltd",
      "Tip-point Capital",
      "Kuza Factors Ltd",
      "Huduma Credit Ltd",
      "4G Capital",
      "Asante Financial",
      "Bowip Agencies",
      "Kanini Haraka",
      "Africa Inuka Hospital",
      "Philmed",
      "Faida Marketplace",
      "Flame Tree Group",
      "Valley Hospital",
      "Kenark Healthcare",
      "LaFemme Healthcare",
      "Inspire Wellness Center",
      "Ruai Family Hospital",
      "Nairobi Radiotherapy and Cancer Center",
      "Imperio Medical Group",
      "NWH Hospital",
      "Huruma Nursing Homes",
      "Scanlab Center",
      "Reale Medical Center",
      "Mediheal Group of Hospitals",
      "South B Hospital",
      "Langata Hospital",
      "Diani Beach Hospital",
      "Kisumu Specialists Hospital",
      "Pine Hospital",
      "Kiambu Diagnostic Imaging Center",
      "Apicalmed Limited",
      "St. Bridget Hospital",
      "Mwanainchi Bakery",
      "Emeraude Kivu Resort Hotel Rwanda",
      "Sun and Sand Beach",
      "Le Petit Village Kampala",
      "Rosslyn House Limited",
      "Number 7",
      "Acorn Holdings",
      "Classic Mouldings",
      "Kocela",
      "Proteq Automation",
      "Gas Africa",
      "Kutuma Kenya Ltd",
      "HighChem East Africa Group",
      "Unified Chemicals",
      "Auto Springs",
      "LinePlast Group",
      "United Paints Ltd",
      "Marini Naturals",
      "Metro Concepts EA",
      "Melchizedek Hospital",
      "DnR Studios",
      "Waterfront Karen",
      "BestLady Cosmetics",
      "Kinde Engineering",
      "Mukurweini Wakulima Dairy Ltd",
      "Xado East Africa",
      "MyCredit Limited",
      "Quipbank",
      "Vivid Gold",
      "SympliFi Ltd",
      "Raka Milk Processors",
      "Skillsasa",
      "Taraji School",
      "Enabling Finance Uganda",
      "Kelsoko",
      "Okolea Fintech",
      "UMBA Inc",
      "Cyber Security Africa",
      "Sunrise Virtual",
      "Malipo Circles",
      "Unumed",
      "Westlands Medical",
      "TransAfrica Water Systems",
      "Country Energy (Uganda) Ltd",
      "Project Mocha Limited",
      "Davu AI",
      "Interconsumer Products Limited(ICPL)",
      "Umoja Microfiance- Uganda",
      "Godai Limited",
      "Clinical Research Health Network",
      "Jeen Mata Microfinance",
      "Truesales Credit",
      "ECLOF Uganda",
      "Geviton",
      "Pabit HPP",
      "Resus Energy",
      "ZenDawa",
      "Eden Care Healthcare",
      "Mwendo Delivery",
      "AKM Glitters Limited",
      "Eco foods & cereals Ltd",
      "Ed Partners",
      "RhoKIT",
      "Blue Waters Hotel",
      "Ranalo Credit",
      "Khetia Drapers Ltd (KDL)",
    ];

    const targetCompanyRole = await Role.findOne({
      where: { name: "Target Company" },
    });

    const administratorRole = await Role.findOne({
      where: { name: "Administrator" },
    });

    if (!targetCompanyRole || !administratorRole) {
      console.warn("Required roles (Target Company or Administrator) not found. Skipping user seeding.");
      return;
    }

    const usersToSeed = [];

    // Seed Target Company users
    for (const company of companies) {
      usersToSeed.push({
        name: company,
        email: `${company.toLowerCase().replace(/[^a-z0-9]/g, "")}@example.com`,
        profile_image: `https://example.com/images/${company
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")}.jpg`,
        kyc_status: "Verified",
        preference_sector: JSON.stringify(["Tech", "Finance"]),
        preference_region: JSON.stringify(["North America", "Europe"]),
        role_id: targetCompanyRole.role_id,
        password: hashedPassword,
        role: "Target Company",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Seed Administrator users
    usersToSeed.push({
      name: "Evans W",
      email: "evans.w@example.com",
      profile_image: "https://example.com/images/evans_w.jpg",
      kyc_status: "Verified",
      preference_sector: JSON.stringify(["Tech", "Finance"]),
      preference_region: JSON.stringify(["North America", "Europe"]),
      role_id: administratorRole.role_id,
      password: hashedPassword,
      role: "Administrator",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const existingUsers = await queryInterface.sequelize.query(
      "SELECT email FROM users",
      { type: Sequelize.QueryTypes.SELECT }
    );
    const existingUserEmails = new Set(existingUsers.map(user => user.email));

    const newUsers = usersToSeed.filter(
      user => !existingUserEmails.has(user.email)
    );

    if (newUsers.length > 0) {
      await queryInterface.bulkInsert("users", newUsers, {});
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("users", null, {});
  },
};
