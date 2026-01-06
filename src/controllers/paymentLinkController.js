const PaymentLink = require('../models/paymentLink');
const { generatePaymentCode } = require('../utils/generateCode');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

class PaymentLinkController {
    // Create new payment link
    static async create(req, res) {
        try {
            const { price, target_url } = req.body;

            // Validation
            if (!price || !target_url) {
                return errorResponse(res, 'Price and target_url are required', 400);
            }

            if (price <= 0) {
                return errorResponse(res, 'Price must be greater than 0', 400);
            }

            // Generate unique code
            const code = generatePaymentCode();

            // Save to database
            const paymentLink = await PaymentLink.create(code, price, target_url);

            // Generate full payment link
            const fullLink = `${process.env.FRONTEND_URL}/pay.html?code=${code}`;

            return successResponse(res, {
                payment_link: fullLink,
                code: paymentLink.code,
                price: paymentLink.price,
                target_url: paymentLink.target_url,
            }, 'Payment link created successfully', 201);

        } catch (error) {
            console.error('Error creating payment link:', error);
            return errorResponse(res, 'Failed to create payment link', 500);
        }
    }

    // Get all payment links
    static async getAll(req, res) {
        try {
            const links = await PaymentLink.getAll();
            return successResponse(res, links);
        } catch (error) {
            console.error('Error fetching payment links:', error);
            return errorResponse(res, 'Failed to fetch payment links', 500);
        }
    }
}

module.exports = PaymentLinkController;