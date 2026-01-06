-- Database: payment_link_db
-- Drop tables if exists (untuk development)
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS payment_links CASCADE;

-- Table: payment_links
CREATE TABLE payment_links (
  id SERIAL PRIMARY KEY,
  code VARCHAR(20) UNIQUE NOT NULL,
  price INTEGER NOT NULL,
  target_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: orders
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  payment_code VARCHAR(20) REFERENCES payment_links(code) ON DELETE CASCADE,
  order_id VARCHAR(100) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes untuk performa
CREATE INDEX idx_payment_code ON payment_links(code);
CREATE INDEX idx_order_id ON orders(order_id);
CREATE INDEX idx_payment_code_orders ON orders(payment_code);
CREATE INDEX idx_order_status ON orders(status);

-- Sample data untuk testing (optional)
-- INSERT INTO payment_links (code, price, target_url) 
-- VALUES ('TEST123', 25000, 'https://google.com');