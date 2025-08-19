const { Queue } = require('bullmq');

const REDIS_HOST = process.env.REDIS_HOST || 'redis';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10);
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

// Redis connection configuration
const connection = {
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
};

// Queue configuration
const queueConfig = {
  connection,
  defaultJobOptions: {
    attempts: 3, // Number of retry attempts for failed jobs
    backoff: {
      type: 'exponential',
      delay: 1000, // Initial delay in ms
    },
    removeOnComplete: 100, // Keep the last 100 completed jobs
    removeOnFail: 100, // Keep the last 100 failed jobs
  },
};

const tokenRefreshQueue = new Queue('office365-token-refresh', queueConfig);

// Event handlers for the queue
tokenRefreshQueue.on('error', (error) => {
  console.error('Queue error:', error);
});

tokenRefreshQueue.on('waiting', (jobId) => {
  console.log(`Job ${jobId} is waiting to be processed`);
});

tokenRefreshQueue.on('cleaned', (jobs, type) => {
  console.log(`Cleaned ${jobs.length} ${type} jobs`);
});

console.log(`BullMQ Queue 'office365-token-refresh' initialized, connecting to Redis at ${REDIS_HOST}:${REDIS_PORT}`);

module.exports = tokenRefreshQueue;
