const { Kafka } = require('kafkajs');
const { refreshToken } = require('../office365Email/office365EmailService');

const enableKafka = process.env.ENABLE_KAFKA === 'true';

let consumer;
let isConnected = false;

const dummyFunction = (name) => async (...args) => {
  console.warn(`Kafka Consumer is disabled. Call to ${name} ignored.`);
  return { status: false, message: `Kafka Consumer is disabled.` };
};

const TOKEN_REFRESH_TOPIC = 'office365-token-refresh';

if (enableKafka) {
  const kafka = new Kafka({
    clientId: 'noblestride-app',
    brokers: process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['kafka:29092'] // Use env var or default
  });
  consumer = kafka.consumer({ groupId: 'office365-token-refresher' });

  // Event listeners for consumer
  consumer.on(consumer.events.CRASH, ({ payload }) => {
    console.error('Kafka Consumer crashed:', payload.error.message);
    isConnected = false;
  });

  consumer.on(consumer.events.DISCONNECT, () => {
    console.warn('Kafka Consumer disconnected unexpectedly.');
    isConnected = false;
  });

} else {
  console.warn('Kafka Consumer is disabled via ENABLE_KAFKA environment variable.');
}

const connectConsumer = enableKafka ? async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: TOKEN_REFRESH_TOPIC, fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const payload = JSON.parse(message.value.toString());
          const { userId, oldRefreshToken } = payload;

          console.log(`Received message for token refresh for user ${userId} on topic ${topic}`);

          // In a real application, you would fetch the user's refresh token from a secure database
          // For this example, we're assuming oldRefreshToken is passed in the message.
          // You would also need to update the database with the new tokens.

          const newTokenResponse = await refreshToken(oldRefreshToken);

          if (newTokenResponse.status === false) {
            console.error(`Failed to refresh token for user ${userId}:`, newTokenResponse.message);
            // Implement retry logic or alert system here
            return;
          }

          // TODO: Persist newTokenResponse (accessToken, refreshToken, expiresIn) to your database
          // associated with the userId.

        } catch (error) {
          console.error('Error processing Kafka message:', error);
        }
      },
    });
    isConnected = true;
    console.log('Kafka Consumer connected and listening for token refresh messages.');
  } catch (error) {
    isConnected = false;
    console.error('Error connecting Kafka Consumer:', error.message);
  }
} : dummyFunction('connectConsumer');

const disconnectConsumer = enableKafka ? async () => {
  try {
    await consumer.disconnect();
    isConnected = false;
    console.log('Kafka Consumer disconnected.');
  } catch (error) {
    console.error('Error disconnecting Kafka Consumer:', error.message);
  }
} : dummyFunction('disconnectConsumer');

module.exports = {
  connectConsumer,
  disconnectConsumer,
  TOKEN_REFRESH_TOPIC,
  isConnected: enableKafka ? isConnected : false, // Export the connection status
};
