"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const socialAccountTypesToSeed = [
      {
        name: "X",
      },
      {
        name: "LinkedIn",
      },
      {
        name: "Facebook",
      },
      {
        name: "Instagram",
      },
    ].map(type => ({
      ...type,
      type_id: Sequelize.literal("uuid_generate_v4()"),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const existingSocialAccountTypes = await queryInterface.sequelize.query(
      "SELECT name FROM social_account_types",
      { type: Sequelize.QueryTypes.SELECT }
    );
    const existingSocialAccountTypeNames = new Set(existingSocialAccountTypes.map(type => type.name));

    const newSocialAccountTypes = socialAccountTypesToSeed.filter(
      type => !existingSocialAccountTypeNames.has(type.name)
    );

    if (newSocialAccountTypes.length > 0) {
      await queryInterface.bulkInsert("social_account_types", newSocialAccountTypes, {});
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("social_account_types", null, {});
  },
};
