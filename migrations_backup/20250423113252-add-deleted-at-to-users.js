"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable("users");
    if (!tableInfo.deleted_at) {
      await queryInterface.addColumn("users", "deleted_at", {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("users", "deleted_at");
  },
};
