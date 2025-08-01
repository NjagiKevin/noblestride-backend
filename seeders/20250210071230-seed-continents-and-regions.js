"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const continentsToSeed = [
      { name: "Africa" },
      { name: "Asia" },
      { name: "Europe" },
      { name: "North America" },
      { name: "South America" },
      { name: "Australia" },
      { name: "Antarctica" },
    ];

    const existingContinents = await queryInterface.sequelize.query(
      "SELECT continent_id, name FROM continents",
      { type: Sequelize.QueryTypes.SELECT }
    );
    const existingContinentMap = new Map(existingContinents.map(c => [c.name, c.continent_id]));

    const newContinents = continentsToSeed.filter(
      continent => !existingContinentMap.has(continent.name)
    ).map(continent => ({
      ...continent,
      continent_id: Sequelize.literal("uuid_generate_v4()"),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    if (newContinents.length > 0) {
      await queryInterface.bulkInsert("continents", newContinents, {});
    }

    // Re-fetch all continents to ensure we have their IDs, including newly inserted ones
    const allContinents = await queryInterface.sequelize.query(
      "SELECT continent_id, name FROM continents",
      { type: Sequelize.QueryTypes.SELECT }
    );
    const continentIdMap = new Map(allContinents.map(c => [c.name, c.continent_id]));

    const regionsToSeed = [
      { name: "Northern Africa", continentName: "Africa" },
      { name: "West Africa", continentName: "Africa" },
      { name: "Central Africa", continentName: "Africa" },
      { name: "East Africa", continentName: "Africa" },
      { name: "South Africa", continentName: "Africa" },
      { name: "Eastern Asia", continentName: "Asia" },
      { name: "Central Asia", continentName: "Asia" },
      { name: "Southern Asia", continentName: "Asia" },
      { name: "Western Asia", continentName: "Asia" },
      { name: "Eastern Europe", continentName: "Europe" },
      { name: "Northern Europe", continentName: "Europe" },
      { name: "Southern Europe", continentName: "Europe" },
      { name: "Western Europe", continentName: "Europe" },
      { name: "Caribbean", continentName: "North America" },
      { name: "Central America", continentName: "North America" },
      { name: "Northern America", continentName: "North America" },
      { name: "South America", continentName: "South America" },
      { name: "Australia and New Zealand", continentName: "Australia" },
      { name: "Melanesia", continentName: "Australia" },
      { name: "Micronesia", continentName: "Australia" },
      { name: "Polynesia", continentName: "Australia" },
      { name: "Antarctica", continentName: "Antarctica" },
    ].map(region => ({
      region_id: Sequelize.literal("uuid_generate_v4()"),
      name: region.name,
      continent_id: continentIdMap.get(region.continentName),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const existingRegions = await queryInterface.sequelize.query(
      "SELECT name FROM regions",
      { type: Sequelize.QueryTypes.SELECT }
    );
    const existingRegionNames = new Set(existingRegions.map(r => r.name));

    const newRegions = regionsToSeed.filter(
      region => !existingRegionNames.has(region.name)
    );

    if (newRegions.length > 0) {
      await queryInterface.bulkInsert("regions", newRegions, {});
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("regions", null, {});
    await queryInterface.bulkDelete("continents", null, {});
  },
};
