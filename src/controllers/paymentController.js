const PaymentLink = require('../models/paymentLink');
const Order = require('../models/order');
const snap = require('../config/midtrans');
const { generateOrderId } = require('../utils/generateCode');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

class PaymentController {
    // Get payment info by code
    static async getInfo(req, res) {
        try {
            const { code } = req.params;

            const paymentLink = await PaymentLink.findByCode(code);

            if (!paymentLink) {
                return errorResponse(res, 'Payment link not found', 404);
            }

            return successResponse(res, {
                code: paymentLink.code,
                price: paymentLink.price,
            });

        } catch (error) {
            console.error('Error fetching payment info:', error);
            return errorResponse(res, 'Failed to fetch payment info', 500);
        }
    }

    // Create Midtrans transaction
    static async charge(req, res) {
        try {
            const { code } = req.params;

            // Find payment link
            const paymentLink = await PaymentLink.findByCode(code);

            if (!paymentLink) {
                return errorResponse(res, 'Payment link not found', 404);
            }

            // Generate order ID
            const orderId = generateOrderId();

            // Create order in database
            await Order.create(code, orderId);

            // Prepare Midtrans parameter
            const parameter = {
                transaction_details: {
                    order_id: orderId,
                    gross_amount: paymentLink.price,
                },
                credit_card: {
                    secure: true,
                },
                callbacks: {
                    finish: `${process.env.FRONTEND_URL}/success.html?order_id=${orderId}`,
                },
            };

            // Create transaction with Midtrans
            const transaction = await snap.createTransaction(parameter);

            return successResponse(res, {
                redirect_url: transaction.redirect_url,
                order_id: orderId,
                token: transaction.token,
            });

        } catch (error) {
            console.error('Error creating charge:', error);
            return errorResponse(res, 'Failed to create payment transaction', 500);
        }
    }

    // Get order info (untuk success page)
    static async getOrderInfo(req, res) {
        try {
            const { order_id } = req.params;

            const order = await Order.findByOrderId(order_id);

            if (!order) {
                return errorResponse(res, 'Order not found', 404);
            }

            return successResponse(res, {
                order_id: order.order_id,
                status: order.status,
                price: order.price,
                target_url: order.target_url,
                paid_at: order.paid_at,
            });

        } catch (error) {
            console.error('Error fetching order info:', error);
            return errorResponse(res, 'Failed to fetch order info', 500);
        }
    }
}

module.exports = PaymentController;