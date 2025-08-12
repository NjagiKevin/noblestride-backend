const { Kafka } = require('kafkajs');

const enableKafka = process.env.ENABLE_KAFKA === 'true';

let producer;
let isConnected = false;

const dummyFunction = (name) => async (...args) => {
  console.warn(`Kafka Producer is disabled. Call to ${name} ignored.`);
  return { status: false, message: `Kafka Producer is disabled.` };
};

if (enableKafka) {
  const kafka = new Kafka({
    clientId: 'noblestride-app',
    brokers: process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['kafka:29092'] // Use env var or default
  });
  producer = kafka.producer();

  producer.on('producer.connect', () => {
    isConnected = true;
    console.log('Kafka Producer connected.');
  });

  producer.on('producer.disconnect', () => {
    isConnected = false;
    console.log('Kafka Producer disconnected.');
  });

  producer.on('producer.crash', (event) => {
    isConnected = false;
    console.error('Kafka Producer crashed:', event.payload.error.message);
  });

} else {
  console.warn('Kafka Producer is disabled via ENABLE_KAFKA environment variable.');
}

const connectProducer = enableKafka ? async () => {
  try {
    await producer.connect();
  } catch (error) {
    console.error('Error connecting Kafka Producer:', error.message);
  }
} : dummyFunction('connectProducer');

const disconnectProducer = enableKafka ? async () => {
  try {
    await producer.disconnect();
  } catch (error) {
    console.error('Error disconnecting Kafka Producer:', error.message);
  }
} : dummyFunction('disconnectProducer');

const sendMessage = enableKafka ? async (topic, messages) => {
  if (!isConnected) {
    console.warn(`Kafka Producer not connected. Message to topic ${topic} not sent.`);
    return;
  }
  try {
    await producer.send({
      topic,
      messages,
    });
    console.log(`Message sent to topic ${topic}:`, messages);
  } catch (error) {
    console.error(`Error sending message to topic ${topic}:`, error.message);
  }
} : dummyFunction('sendMessage');

module.exports = {
  connectProducer,
  disconnectProducer,
  sendMessage,
  isConnected: enableKafka ? isConnected : false, // Export actual status or false if disabled
};
