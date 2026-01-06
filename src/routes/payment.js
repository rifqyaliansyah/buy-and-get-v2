const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/paymentController');

// Get payment info by code
router.get('/:code', PaymentController.getInfo);

// Create charge/transaction
router.post('/:code/charge', PaymentController.charge);

// Get order info (untuk success page)
router.get('/order/:order_id', PaymentController.getOrderInfo);

module.exports = router;