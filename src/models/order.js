const pool = require('../config/database');

class Order {
    static async create(paymentCode, orderId) {
        const query = `
      INSERT INTO orders (payment_code, order_id, status)
      VALUES ($1, $2, 'pending')
      RETURNING *
    `;
        const values = [paymentCode, orderId];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async findByOrderId(orderId) {
        const query = `
      SELECT o.*, pl.target_url, pl.price
      FROM orders o
      JOIN payment_links pl ON o.payment_code = pl.code
      WHERE o.order_id = $1
    `;
        const result = await pool.query(query, [orderId]);
        return result.rows[0];
    }

    static async updateStatus(orderId, status) {
        const query = `
      UPDATE orders
      SET status = $1, paid_at = $2
      WHERE order_id = $3
      RETURNING *
    `;
        const paidAt = status === 'paid' ? new Date() : null;
        const result = await pool.query(query, [status, paidAt, orderId]);
        return result.rows[0];
    }

    static async findByPaymentCode(paymentCode) {
        const query = 'SELECT * FROM orders WHERE payment_code = $1 ORDER BY created_at DESC';
        const result = await pool.query(query, [paymentCode]);
        return result.rows;
    }
}

module.exports = Order;