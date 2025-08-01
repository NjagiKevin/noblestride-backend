"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const sectorsToSeed = [
      {
        name: "Tech",
      },
      {
        name: "Finance",
      },
      {
        name: "Healthcare",
      },
      {
        name: "Energy",
      },
      {
        name: "Consumer Goods",
      },
      {
        name: "Industrial",
      },
      {
        name: "Real Estate",
      },
      {
        name: "Telecommunications",
      },
      {
        name: "Utilities",
      },
      {
        name: "Materials",
      },
    ].map(sector => ({
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
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("sectors", null, {});
  },
};
