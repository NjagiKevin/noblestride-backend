const cron = require('node-cron');
const db = require('../../Models');
const { sendMessage } = require('../kafka/kafkaProducer');
const { TOKEN_REFRESH_TOPIC } = require('../kafka/tokenRefreshConsumer');
const tokenRefreshQueue = require('../bullmq/tokenRefreshQueue');
const Sequelize = db.Sequelize;

const enableKafka = process.env.ENABLE_KAFKA === 'true';
const enableBullMQTokenRefresh = process.env.ENABLE_BULLMQ_TOKEN_REFRESH === 'true';

const dummyFunction = (name) => () => {
    console.warn(`Office 365 Token Refresh Scheduler is disabled. Call to ${name} ignored.`);
};

const scheduleTokenRefresh = (enableKafka || enableBullMQTokenRefresh) ? () => {
    // Schedule to run every hour
    cron.schedule('0 * * * *', async () => {
        console.log('Running scheduled Office 365 token refresh check...');
        const now = Date.now();
        // Find tokens that expire within the next 24 hours (86400000 milliseconds)
        const expiryThreshold = now + (24 * 60 * 60 * 1000);

        try {
            // Clean old jobs first
            const cleanResult = await tokenRefreshQueue.clean(15 * 24 * 60 * 60 * 1000, 1000, 'completed');
            console.log(`Cleaned ${cleanResult.length} completed jobs`);

            const cleanFailedResult = await tokenRefreshQueue.clean(15 * 24 * 60 * 60 * 1000, 1000, 'failed');
            console.log(`Cleaned ${cleanFailedResult.length} failed jobs`);

            const expiringTokens = await db.Office365Token.findAll({
                where: {
                    // Calculate expiry time and compare with a future threshold
                    [db.Sequelize.Op.and]: [
                        db.Sequelize.literal(`("acquiredAt" + "expiresIn" * 1000) < ${expiryThreshold}`),
                        db.Sequelize.literal(`("acquiredAt" + "expiresIn" * 1000) > ${now}`)
                    ]
                },
                order: [
                    [db.Sequelize.literal('"acquiredAt" + "expiresIn" * 1000'), 'ASC'] // Process soonest-expiring tokens first
                ]
            });

            console.log(`Found ${expiringTokens.length} tokens nearing expiry`);

            for (const token of expiringTokens) {
                const tokenExpiryTime = token.acquiredAt + (token.expiresIn * 1000);
                if (tokenExpiryTime < expiryThreshold) {
                    console.log(`Token for user ${token.userId} is nearing expiry.`);
                    
                    if (enableBullMQTokenRefresh) {
                        // Calculate when the job should run (30 minutes before expiry)
                        const runAt = new Date(tokenExpiryTime - (30 * 60 * 1000));
                        
                        // Check if a job for this token already exists
                        const existingJobs = await tokenRefreshQueue.getJobs(['waiting', 'active', 'delayed']);
                        const hasExistingJob = existingJobs.some(job => 
                            job.data.userId === token.userId && 
                            job.data.oldRefreshToken === token.refreshToken
                        );

                        if (!hasExistingJob) {
                            // Add job with specific options
                            await tokenRefreshQueue.add('refreshOffice365Token', {
                                userId: token.userId,
                                oldRefreshToken: token.refreshToken,
                                expiryTime: tokenExpiryTime,
                            }, {
                                delay: Math.max(0, runAt.getTime() - Date.now()), // Ensure delay is not negative
                                priority: 1, // High priority
                                jobId: `refresh-${token.userId}-${Date.now()}`, // Unique job ID
                                attempts: 5, // More retry attempts for token refresh
                                backoff: {
                                    type: 'exponential',
                                    delay: 2000, // Start with 2 second delay
                                },
                            });
                            console.log(`Job added to BullMQ for user ${token.userId}, scheduled for ${runAt}`);
                        } else {
                            console.log(`Job already exists for user ${token.userId}, skipping`);
                        }
                    } else if (enableKafka) {
                        await sendMessage(TOKEN_REFRESH_TOPIC, [
                            { value: JSON.stringify({ userId: token.userId, oldRefreshToken: token.refreshToken }) }
                        ]);
                        console.log(`Message sent to Kafka for user ${token.userId}.`);
                    }
                }
            }
        } catch (error) {
            console.error('Error in scheduled token refresh:', error);
        }
    });
    console.log('Office 365 token refresh scheduler started.');
} : dummyFunction('scheduleTokenRefresh');

module.exports = {
    scheduleTokenRefresh,
};
