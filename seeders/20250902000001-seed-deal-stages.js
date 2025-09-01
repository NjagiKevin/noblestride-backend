'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users LIMIT 1',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (users.length === 0) {
      console.log('No users found, skipping deal stages seeder.');
      return;
    }

    const userId = users[0].id;

    const dealStages = [
      { name: 'Initial Contact', order: 1 },
      { name: 'Qualification', order: 2 },
      { name: 'Needs Analysis', order: 3 },
      { name: 'Proposal', order: 4 },
      { name: 'Negotiation', order: 5 },
      { name: 'Closing', order: 6 },
      { name: 'Closed Won', order: 7 },
      { name: 'Closed Lost', order: 8 },
    ];

    const dealStagesToSeed = dealStages.map(stage => ({
      ...stage,
      stage_id: Sequelize.literal('uuid_generate_v4()'),
      user_id: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert('deal_stages', dealStagesToSeed, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('deal_stages', null, {});
  },
};
