const express = require('express');
const router = express.Router();
const WebhookController = require('../controllers/webhookController');

// Midtrans webhook endpoint
router.post('/', WebhookController.handleNotification);

module.exports = router;