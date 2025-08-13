const { Worker } = require('bullmq');
const { refreshToken } = require('../office365Email/office365EmailService');
const db = require('../../Models');

const REDIS_HOST = process.env.REDIS_HOST || 'redis';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10);
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

// Redis connection configuration
const connection = {
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
};

// Worker configuration
const workerConfig = {
  connection,
  autorun: true,
  concurrency: 10, // Process up to 10 jobs concurrently
  limiter: {
    max: 100, // Maximum number of jobs processed per time window
    duration: 1000 * 60, // Time window in milliseconds (1 minute)
  },
};

const tokenRefreshWorker = new Worker(
  'office365-token-refresh',
  async (job) => {
    const { userId, oldRefreshToken } = job.data;
    console.log(`Processing token refresh job for user ${userId}...`);

    try {
      // Update job progress
      await job.updateProgress(10);

      const newTokenResponse = await refreshToken(oldRefreshToken);
      await job.updateProgress(50);

      if (newTokenResponse.status === false) {
        throw new Error(`Failed to refresh token for user ${userId}: ${newTokenResponse.message}`);
      }

      // Start a transaction to ensure atomic update
      const transaction = await db.sequelize.transaction();
      try {
        // Update token in database
        await db.Office365Token.update(
          {
            accessToken: newTokenResponse.accessToken,
            refreshToken: newTokenResponse.refreshToken,
            expiresIn: newTokenResponse.expiresIn,
            acquiredAt: Date.now(),
            lastRefreshError: null, // Clear any previous error
          },
          { 
            where: { userId: userId },
            transaction
          }
        );

        await transaction.commit();
        await job.updateProgress(100);

        // Return result for job completion logging
        return {
          status: 'success',
          message: `Successfully refreshed token for user ${userId}`,
          tokenPreview: newTokenResponse.accessToken.substring(0, 10),
        };
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      // Log error in database
      try {
        await db.Office365Token.update(
          {
            lastRefreshError: error.message,
            lastRefreshAttempt: Date.now(),
          },
          { where: { userId: userId } }
        );
      } catch (dbError) {
        console.error('Failed to log error to database:', dbError);
      }

      console.error(`Error in token refresh worker for user ${userId}:`, error.message);
      throw error; // Re-throw to mark job as failed
    }
  },
  workerConfig
);

// Event handlers
tokenRefreshWorker.on('completed', (job, result) => {
  console.log(
    `Job ${job.id} completed for user ${job.data.userId}.`,
    `Status: ${result.status}.`,
    `Message: ${result.message}.`,
    `New token preview: ${result.tokenPreview}...`
  );
});

tokenRefreshWorker.on('failed', (job, err) => {
  console.error(
    `Job ${job.id} failed for user ${job.data.userId}:`,
    `Error: ${err.message}`,
    `Attempt: ${job.attemptsMade} of ${job.opts.attempts}`
  );
});

tokenRefreshWorker.on('error', (err) => {
  console.error('Worker error:', err);
});

tokenRefreshWorker.on('progress', (job, progress) => {
  console.log(`Job ${job.id} is ${progress}% complete`);
});

console.log(`BullMQ Worker 'office365-token-refresh' initialized, connecting to Redis at ${REDIS_HOST}:${REDIS_PORT}`);

module.exports = tokenRefreshWorker;
