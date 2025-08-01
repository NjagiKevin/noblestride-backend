"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const enumName = 'enum_deal_access_invites_status';
    const enumValues = await queryInterface.sequelize.query(
      `SELECT unnest(enum_range(NULL::"${enumName}"))::text;`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const currentValues = enumValues.map(e => e.unnest);

    if (!currentValues.includes('Withdrawn')) {
      await queryInterface.sequelize.query(`
        ALTER TYPE "${enumName}" ADD VALUE 'Withdrawn';
      `);
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Note: PostgreSQL does not allow removing values from an ENUM directly.
    // To remove the value, you would need to create a new ENUM type without the "Withdrawn" value
    // and migrate the column to use the new ENUM type. This is a complex process and is not included here.
  },
};