const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');

// Import routes
const paymentLinkRoutes = require('./routes/paymentLink');
const paymentRoutes = require('./routes/payment');
const webhookRoutes = require('./routes/webhook');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'Payment Link Generator API',
        version: '1.0.0',
        endpoints: {
            create_link: 'POST /api/create-link',
            get_payment_info: 'GET /api/payment/:code',
            create_charge: 'POST /api/payment/:code/charge',
            get_order_info: 'GET /api/payment/order/:order_id',
            webhook: 'POST /api/webhook',
        },
    });
});

app.use('/api', paymentLinkRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/webhook', webhookRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found',
    });
});

// Error handler
app.use(errorHandler);

module.exports = app;