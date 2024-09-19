const kafka = require('kafka-node');
const mongoose = require('mongoose');
const Request = require('../models/Request');
const axios = require('axios');

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Kafka client and consumer
const client = new kafka.KafkaClient({ kafkaHost: process.env.KAFKA_BOOTSTRAP_SERVERS });
const consumer = new kafka.Consumer(
  client,
  [
    { topic: 'cpp-requests', partition: 0 },
    { topic: 'java-requests', partition: 0 },
    { topic: 'nodejs-requests', partition: 0 },
    { topic: 'python-requests', partition: 0 },
    { topic: 'ruby-requests', partition: 0 }
  ],
  { autoCommit: true }
);

// Language-specific endpoints
const languageEndpoints = {
  cpp: 'http://cpp-service.cpp.svc.cluster.local:80/execute',
  java: 'http://java-service.java.svc.cluster.local:80/execute',
  nodejs: 'http://nodejs-service.nodejs.svc.cluster.local:80/execute',
  python: 'http://python-service.python.svc.cluster.local:80/execute',
  ruby: 'http://ruby-service.ruby.svc.cluster.local:80/execute'
};

consumer.on('message', async (message) => {
  const { sessionId, code } = JSON.parse(message.value);
  const language = message.topic.split('-')[0];

  const endpoint = languageEndpoints[language];
  if (!endpoint) {
    console.error(`Unsupported language: ${language}`);
    return;
  }

  try {
    const response = await axios.post(endpoint, { sessionId, code });
    const request = await Request.findOne({ sessionId });
    request.status = 'completed';
    request.result = response.data;
    await request.save();
  } catch (err) {
    const request = await Request.findOne({ sessionId });
    request.status = 'failed';
    request.result = err.message;
    await request.save();
  }
});
