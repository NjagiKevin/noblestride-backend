"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const milestonesToSeed = [
      {
        name: "Receipt and review of the teaser",
        description: "",
      },
      {
        name: "Execution of the NDA",
        description: "",
      },
      {
        name: "Issuance of an Expression of interest or letter of intent or email confirming interest in the deal and requesting additional information.",
        description: "",
      },
      {
        name: "Data room access",
        description: "",
      },
      {
        name: "Conduct preliminary due diligence",
        description: "",
      },
      {
        name: "Preparation of internal IC paper",
        description: "",
      },
      {
        name: "First IC approval",
        description: "",
      },
      {
        name: "Issuance of non-binding term sheet.",
        description: "",
      },
      {
        name: "Execution of the term sheet.",
        description: "",
      },
      {
        name: "Onsite detailed due diligence – this may be undertaken internally, or they may hire external consultants such as big 4 audit firms to undertake financial, tax, commercial, ESG, Legal DD etc",
        description: "",
      },
      {
        name: "Second IC Approval",
        description: "",
      },
      {
        name: "Issuance of a binding offer.",
        description: "",
      },
      {
        name: "Issuance of loan agreement of Share purchase agreement.",
        description: "",
      },
      {
        name: "Seeking approval from competition authority – i.e notifying CAK or COMESA",
        description: "",
      },
    ].map(milestone => ({
      ...milestone,
      milestone_id: Sequelize.literal("uuid_generate_v4()"),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const existingMilestones = await queryInterface.sequelize.query(
      "SELECT name FROM investor_milestones",
      { type: Sequelize.QueryTypes.SELECT }
    );
    const existingMilestoneNames = new Set(existingMilestones.map(milestone => milestone.name));

    const newMilestones = milestonesToSeed.filter(
      milestone => !existingMilestoneNames.has(milestone.name)
    );

    if (newMilestones.length > 0) {
      await queryInterface.bulkInsert("investor_milestones", newMilestones, {});
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("investor_milestones", null, {});
  },
};
