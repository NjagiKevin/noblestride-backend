"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Seed Sectors (idempotently)
    const sectorsData = [
      { name: "Tech" },
      { name: "Finance" },
      { name: "Healthcare" },
      { name: "Energy" },
      { name: "Consumer Goods" },
      { name: "Industrial" },
      { name: "Real Estate" },
      { name: "Telecommunications" },
      { name: "Utilities" },
      { name: "Materials" },
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
        { name: "Tech", subsectors: ["SaaS", "FinTech", "HealthTech", "EdTech", "AgriTech"] },
        { name: "Finance", subsectors: ["Banking", "Insurance", "Wealth Management", "Asset Management"] },
        { name: "Healthcare", subsectors: ["Pharmaceuticals", "Biotechnology", "Medical Devices", "Hospitals"] },
        { name: "Energy", subsectors: ["Oil & Gas", "Renewable Energy", "Utilities"] },
        { name: "Consumer Goods", subsectors: ["Retail", "E-commerce", "FMCG"] },
        { name: "Industrial", subsectors: ["Manufacturing", "Construction", "Logistics"] },
        { name: "Real Estate", subsectors: ["Residential", "Commercial", "Industrial"] },
        { name: "Telecommunications", subsectors: ["Wireless", "Wireline", "Media"] },
        { name: "Utilities", subsectors: ["Electric", "Gas", "Water"] },
        { name: "Materials", subsectors: ["Mining", "Chemicals", "Forestry"] },
    ];

    // Get all sectors with their IDs
    const allSectors = await queryInterface.sequelize.query(
      "SELECT sector_id, name FROM sectors",
      { type: Sequelize.QueryTypes.SELECT }
    );
    const sectorMap = new Map(allSectors.map(s => [s.name, s.sector_id]));

    // Get all existing subsectors
    const existingSubsectors = await queryInterface.sequelize.query(
      "SELECT name, sector_id FROM subsectors",
      { type: Sequelize.QueryTypes.SELECT }
    );
    const existingSubsectorSet = new Set(existingSubsectors.map(s => `${s.name}|${s.sector_id}`));

    const subsectorsToSeed = [];
    for (const sectorData of sectorsWithSubsectors) {
      const sectorId = sectorMap.get(sectorData.name);
      if (sectorId) {
        for (const subsectorName of sectorData.subsectors) {
          if (!existingSubsectorSet.has(`${subsectorName}|${sectorId}`)) {
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