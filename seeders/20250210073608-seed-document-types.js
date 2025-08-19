"use strict";

const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const documentTypesToSeed = [
      {
        name: "Information Memorandum",
      },
      {
        name: "NDA",
      },
      {
        name: "Financial Model",
      },
    ].map(type => ({
      ...type,
      type_id: Sequelize.literal("uuid_generate_v4()"),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const existingDocumentTypes = await queryInterface.sequelize.query(
      "SELECT name FROM document_types",
      { type: Sequelize.QueryTypes.SELECT }
    );
    const existingDocumentTypeNames = new Set(existingDocumentTypes.map(type => type.name));

    const newDocumentTypes = documentTypesToSeed.filter(
      type => !existingDocumentTypeNames.has(type.name)
    );

    if (newDocumentTypes.length > 0) {
      await queryInterface.bulkInsert("document_types", newDocumentTypes, {});
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("document_types", null, {});
  },
};
