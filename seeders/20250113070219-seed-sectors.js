"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Seed Sectors (idempotently)
    const sectorsData = [

      { name: "Technology" },
      { name: "Financial Services" },
      { name: "Healthcare" },
      { name: "Energy" },
      { name: "Consumer Goods" },
      { name: "Industrial" },
      { name: "Real Estate" },
      { name: "Telecommunications" },
      { name: "Utilities" },
      { name: "Materials" },
      { name: "Agriculture" },
      { name: "Aviation" },
      { name: "Services" },
      { name: "Education" },
      { name: "Hospitality" },
      { name: "Housing" },
      { name: "Media and Entertainment" },
      { name: "Leasing" },
      { name: "Water & Sanitation" },
      { name: "Manufacturing" },
      { name: "Construction" },
      { name: "FMCG" },
      { name: "Retail" },
    ];

    const sectorsToSeed = sectorsData.map(sector => ({
      ...sector,
      sector_id: Sequelize.literal("uuid_generate_v4()"),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const existingSectors = await queryInterface.sequelize.query(
      "SELECT name FROM sectors",
      { type: Sequelize.QueryTypes.SELECT }
    );
    const existingSectorNames = new Set(existingSectors.map(sector => sector.name));

    const newSectors = sectorsToSeed.filter(
      sector => !existingSectorNames.has(sector.name)
    );

    if (newSectors.length > 0) {
      await queryInterface.bulkInsert("sectors", newSectors, {});
    }

    // 2. Seed Subsectors (idempotently)
    const sectorsWithSubsectors = [
        { name: "Technology", subsectors: ["SaaS", "FinTech", "HealthTech", "EdTech", "AgriTech"] },
        { name: "Financial Services", subsectors: ["Banking", "Insurance", "Wealth Management", "Asset Management"] },
        { name: "Healthcare", subsectors: ["Pharmaceuticals", "Biotechnology", "Medical Devices", "Hospitals"] },
        { name: "Energy", subsectors: ["Oil & Gas", "Renewable Energy", "Utilities"] },
        { name: "Consumer Goods", subsectors: ["E-commerce"] },
        { name: "Industrial", subsectors: ["Logistics"] },
        { name: "Real Estate", subsectors: ["Residential", "Commercial", "Industrial"] },
        { name: "Telecommunications", subsectors: ["Wireless", "Wireline", "Media"] },
        { name: "Utilities", subsectors: ["Electric", "Gas", "Water"] },
        { name: "Materials", subsectors: ["Mining", "Chemicals", "Forestry"] },
        { name: "Agriculture", subsectors: ["Farming", "Agro-processing", "Agri-tech"] },
        { name: "Aviation", subsectors: ["Airlines", "Airports", "Aerospace"] },
        { name: "Services", subsectors: ["Consulting", "Outsourcing", "Professional Services"] },
        { name: "Education", subsectors: ["K-12", "Higher Education", "Edu Tech"] },
        { name: "Hospitality", subsectors: ["Hotels", "Restaurants", "Tourism"] },
        { name: "Housing", subsectors: ["Residentials", "Commercials"] },
        { name: "Media and Entertainment", subsectors: ["Film", "Music", "Gaming"] },
        { name: "Leasing", subsectors: ["Equipment Leasing", "Vehicle Leasing"] },
        { name: "Water & Sanitation", subsectors: ["Water Treatment", "Waste Management"] },
        { name: "Manufacturing", subsectors: [] },
        { name: "Construction", subsectors: [] },
        { name: "FMCG", subsectors: [] },
        { name: "Retail", subsectors: [] },
    ];

    // Get all sectors with their IDs
    const allSectors = await queryInterface.sequelize.query(
      "SELECT sector_id, name FROM sectors",
      { type: Sequelize.QueryTypes.SELECT }
    );
    const sectorMap = new Map(allSectors.map(s => [s.name, s.sector_id]));

    // Get all existing subsectors
    const existingSubsectors = await queryInterface.sequelize.query(
      "SELECT name FROM subsectors",
      { type: Sequelize.QueryTypes.SELECT }
    );
    const existingSubsectorNames = new Set(existingSubsectors.map(s => s.name));

    const subsectorsToSeed = [];
    for (const sectorData of sectorsWithSubsectors) {
      const sectorId = sectorMap.get(sectorData.name);
      if (sectorId) {
        for (const subsectorName of sectorData.subsectors) {
          if (!existingSubsectorNames.has(subsectorName)) {
            subsectorsToSeed.push({
              subsector_id: Sequelize.literal("uuid_generate_v4()"),
              name: subsectorName,
              sector_id: sectorId,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          }
        }
      }
    }

    if (subsectorsToSeed.length > 0) {
      await queryInterface.bulkInsert("subsectors", subsectorsToSeed, {});
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("subsectors", null, {});
    await queryInterface.bulkDelete("sectors", null, {});
  },
};