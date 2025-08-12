const { Worker } = require('bullmq');
const { refreshToken } = require('../office365Email/office365EmailService');
const db = require('../../Models');

const REDIS_HOST = process.env.REDIS_HOST || 'redis';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10);

const connection = {
  host: REDIS_HOST,
  port: REDIS_PORT,
};

const tokenRefreshWorker = new Worker(
  'office365-token-refresh',
  async (job) => {
    const { userId, oldRefreshToken } = job.data;
    console.log(`Processing token refresh job for user ${userId}...`);

    try {
      const newTokenResponse = await refreshToken(oldRefreshToken);

      if (newTokenResponse.status === false) {
        throw new Error(`Failed to refresh token for user ${userId}: ${newTokenResponse.message}`);
      }

      // Update token in database
      await db.Office365Token.update(
        {
          accessToken: newTokenResponse.accessToken,
          refreshToken: newTokenResponse.refreshToken,
          expiresIn: newTokenResponse.expiresIn,
          acquiredAt: Date.now(),
        },
        { where: { userId: userId } }
      );

      console.log(`Successfully refreshed token for user ${userId}. New access token (first 10 chars): ${newTokenResponse.accessToken.substring(0, 10)}...`);
    } catch (error) {
      console.error(`Error in token refresh worker for user ${userId}:`, error.message);
      throw error; // Re-throw to mark job as failed
    }
  },
  { connection }
);

tokenRefreshWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed for user ${job.data.userId}`);
});

tokenRefreshWorker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed for user ${job.data.userId}: ${err.message}`);
});

console.log(`BullMQ Worker 'office365-token-refresh' initialized, connecting to Redis at ${REDIS_HOST}:${REDIS_PORT}`);

module.exports = tokenRefreshWorker;
