const { customAlphabet } = require('nanoid');

// Generate code dengan format: 6 karakter alphanumeric
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 8);

const generatePaymentCode = () => {
    return nanoid();
};

const generateOrderId = () => {
    return `ORDER-${Date.now()}-${nanoid()}`;
};

module.exports = {
    generatePaymentCode,
    generateOrderId,
};