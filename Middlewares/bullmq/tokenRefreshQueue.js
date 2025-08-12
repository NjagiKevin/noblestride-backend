const { Queue } = require('bullmq');

const REDIS_HOST = process.env.REDIS_HOST || 'redis';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10);

const connection = {
  host: REDIS_HOST,
  port: REDIS_PORT,
};

const tokenRefreshQueue = new Queue('office365-token-refresh', { connection });

console.log(`BullMQ Queue 'office365-token-refresh' initialized, connecting to Redis at ${REDIS_HOST}:${REDIS_PORT}`);

module.exports = tokenRefreshQueue;
