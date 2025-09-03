'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const deals = await queryInterface.sequelize.query(
      'SELECT deal_id FROM deals LIMIT 1',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const dealStages = await queryInterface.sequelize.query(
      'SELECT stage_id FROM deal_stages LIMIT 1',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (deals.length === 0 || dealStages.length === 0) {
      console.log('No deals or deal stages found, skipping milestones seeder.');
      return;
    }

    const dealId = deals[0].deal_id;
    const dealStageId = dealStages[0].stage_id;

    const milestones = [
      {
        title: 'Initial Milestone',
        description: 'This is the first milestone for the deal.',
        status: 'Pending',
        due_date: new Date(),
        commission_amount: 1000.00,
        invoice_generated: false,
      },
      {
        title: 'Second Milestone',
        description: 'This is the second milestone for the deal.',
        status: 'Pending',
        due_date: new Date(new Date().setDate(new Date().getDate() + 30)), // 30 days from now
        commission_amount: 2500.00,
        invoice_generated: false,
      },
    ];

    const milestonesToSeed = milestones.map(milestone => ({
      ...milestone,
      milestone_id: Sequelize.literal('uuid_generate_v4()'),
      deal_id: dealId,
      deal_stage_id: dealStageId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert('milestones', milestonesToSeed, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('milestones', null, {});
  },
};
