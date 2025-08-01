"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const dealMilestonesToSeed = [
      {
        name: "Preparation of a teaser",
        description: "Initial contact with the potential investor.",
      },
      {
        name: "Preparation of financial model.",
        description: "Conducting due diligence on the deal.",
      },
      {
        name: "Preparation of information memorandum",
        description: "Issuance of the term sheet.",
      },
      {
        name: "Preparation of valuation report (for equity investments)",
        description: "Signing of the final agreement.",
      },
      {
        name: "Preparation of business plan (Optional)",
        description: "Signing of the final agreement.",
      },
    ].map(milestone => ({
      ...milestone,
      milestone_id: Sequelize.literal("uuid_generate_v4()"),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const existingDealMilestones = await queryInterface.sequelize.query(
      "SELECT name FROM deal_milestones",
      { type: Sequelize.QueryTypes.SELECT }
    );
    const existingDealMilestoneNames = new Set(existingDealMilestones.map(milestone => milestone.name));

    const newDealMilestones = dealMilestonesToSeed.filter(
      milestone => !existingDealMilestoneNames.has(milestone.name)
    );

    if (newDealMilestones.length > 0) {
      await queryInterface.bulkInsert("deal_milestones", newDealMilestones, {});
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("deal_milestones", null, {});
  },
};
