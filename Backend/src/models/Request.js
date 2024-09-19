const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  code: { type: String, required: true },
  language: { type: String, required: true },
  status: { type: String, required: true },
  result: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Request', RequestSchema);
