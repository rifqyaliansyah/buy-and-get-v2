const express = require('express');
const router = express.Router();
const PaymentLinkController = require('../controllers/paymentLinkController');

// Create payment link
router.post('/create-link', PaymentLinkController.create);

// Get all payment links
router.get('/links', PaymentLinkController.getAll);

module.exports = router;