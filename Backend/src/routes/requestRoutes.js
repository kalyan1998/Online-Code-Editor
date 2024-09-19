const express = require('express');
const requestController = require('../controllers/requestController');

const router = express.Router();

router.post('/run', requestController.runCode);
router.get('/result/:sessionId', requestController.getResult);

module.exports = router;
