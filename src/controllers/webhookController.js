const Order = require('../models/order');
const crypto = require('crypto');

class WebhookController {
    static async handleNotification(req, res) {
        try {
            const notification = req.body;

            // Verify signature hash (security)
            const serverKey = process.env.MIDTRANS_SERVER_KEY;
            const orderId = notification.order_id;
            const statusCode = notification.status_code;
            const grossAmount = notification.gross_amount;

            const signatureKey = crypto
                .createHash('sha512')
                .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
                .digest('hex');

            if (signatureKey !== notification.signature_key) {
                console.error('Invalid signature key');
                return res.status(403).json({ message: 'Invalid signature' });
            }

            // Get transaction status
            const transactionStatus = notification.transaction_status;
            const fraudStatus = notification.fraud_status;

            console.log(`Webhook received for order: ${orderId}, status: ${transactionStatus}`);

            // Update order status based on transaction status
            let orderStatus = 'pending';

            if (transactionStatus === 'capture') {
                if (fraudStatus === 'accept') {
                    orderStatus = 'paid';
                }
            } else if (transactionStatus === 'settlement') {
                orderStatus = 'paid';
            } else if (
                transactionStatus === 'cancel' ||
                transactionStatus === 'deny' ||
                transactionStatus === 'expire'
            ) {
                orderStatus = 'failed';
            } else if (transactionStatus === 'pending') {
                orderStatus = 'pending';
            }

            // Update order in database
            await Order.updateStatus(orderId, orderStatus);

            console.log(`Order ${orderId} updated to ${orderStatus}`);

            return res.status(200).json({ message: 'Webhook processed successfully' });

        } catch (error) {
            console.error('Webhook error:', error);
            return res.status(500).json({ message: 'Webhook processing failed' });
        }
    }
}

module.exports = WebhookController;