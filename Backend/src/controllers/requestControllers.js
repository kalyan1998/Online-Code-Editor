const { v4: uuidv4 } = require('uuid');
const Request = require('../models/Request');
const kafka = require('kafka-node');

const client = new kafka.KafkaClient({ kafkaHost: process.env.KAFKA_BOOTSTRAP_SERVERS });
const producer = new kafka.Producer(client);

const runCode = async (req, res) => {
  const { code, language } = req.body;

  if (!['cpp', 'java', 'nodejs', 'python', 'ruby'].includes(language)) {
    return res.status(400).json({ error: 'Unsupported language' });
  }

  const sessionId = uuidv4();
  const newRequest = new Request({
    sessionId,
    code,
    language,
    status: 'queued',
    result: '',
  });

  await newRequest.save();

  const payloads = [
    { topic: `${language}-requests`, messages: JSON.stringify({ sessionId, code }), partition: 0 }
  ];

  producer.send(payloads, async (err, data) => {
    if (err) {
      newRequest.status = 'failed';
      newRequest.result = 'Error sending message to Kafka';
      await newRequest.save();
      return res.status(500).json({ error: 'Error sending message to Kafka' });
    }

    newRequest.status = 'running';
    await newRequest.save();
    res.json({ sessionId });
  });
};

const getResult = async (req, res) => {
  const { sessionId } = req.params;
  const request = await Request.findOne({ sessionId });

  if (!request) {
    return res.status(404).json({ error: 'Session not found' });
  }

  res.json(request);
};

module.exports = {
  runCode,
  getResult,
};