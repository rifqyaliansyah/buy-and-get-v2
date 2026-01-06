const pool = require('../config/database');

class PaymentLink {
    static async create(code, price, targetUrl) {
        const query = `
      INSERT INTO payment_links (code, price, target_url)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
        const values = [code, price, targetUrl];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async findByCode(code) {
        const query = 'SELECT * FROM payment_links WHERE code = $1';
        const result = await pool.query(query, [code]);
        return result.rows[0];
    }

    static async getAll() {
        const query = 'SELECT * FROM payment_links ORDER BY created_at DESC';
        const result = await pool.query(query);
        return result.rows;
    }
}

module.exports = PaymentLink;