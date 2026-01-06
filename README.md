# Payment Link Generator - Backend

Backend API untuk Payment Link Generator menggunakan Express.js, PostgreSQL, dan Midtrans.

## 📋 Prerequisites

- Node.js (v14 atau lebih tinggi)
- PostgreSQL (v12 atau lebih tinggi)
- Akun Midtrans (Sandbox untuk testing)

## 🚀 Setup

### 1. Install Dependencies

```bash
npm init -y
npm install express pg dotenv midtrans-client cors nanoid@3
npm install --save-dev nodemon
```

### 2. Setup Database

Buat database PostgreSQL:

```sql
CREATE DATABASE payment_link_db;
```

Jalankan schema SQL:

```bash
psql -U postgres -d payment_link_db -f database/schema.sql
```

### 3. Setup Environment Variables

Copy `.env.example` ke `.env`:

```bash
cp .env.example .env
```

Edit `.env` dan isi dengan kredensial Anda:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=payment_link_db
DB_USER=postgres
DB_PASSWORD=your_password

MIDTRANS_SERVER_KEY=your_midtrans_server_key
MIDTRANS_CLIENT_KEY=your_midtrans_client_key
MIDTRANS_IS_PRODUCTION=false

FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

### 4. Dapatkan Midtrans Credentials

1. Daftar di [Midtrans](https://midtrans.com/)
2. Login ke [Dashboard Midtrans](https://dashboard.midtrans.com/)
3. Pilih environment **Sandbox** untuk testing
4. Copy **Server Key** dan **Client Key** dari Settings > Access Keys

### 5. Setup Midtrans Webhook (Opsional untuk Production)

Di Midtrans Dashboard:
1. Go to Settings > Configuration
2. Payment Notification URL: `https://your-domain.com/api/webhook`
3. Finish/Unfinish/Error Redirect URL: `https://your-frontend.com/success.html?order_id={order_id}`

## 🏃 Running

### Development Mode (dengan auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

Server akan berjalan di `http://localhost:5000`

## 📡 API Endpoints

### 1. Create Payment Link

**POST** `/api/create-link`

Request Body:
```json
{
  "price": 25000,
  "target_url": "https://drive.google.com/file/xxx"
}
```

Response:
```json
{
  "success": true,
  "message": "Payment link created successfully",
  "data": {
    "payment_link": "http://localhost:3000/pay.html?code=AbC91x",
    "code": "AbC91x",
    "price": 25000,
    "target_url": "https://drive.google.com/file/xxx"
  }
}
```

### 2. Get Payment Info

**GET** `/api/payment/:code`

Response:
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "code": "AbC91x",
    "price": 25000
  }
}
```

### 3. Create Charge/Transaction

**POST** `/api/payment/:code/charge`

Response:
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "redirect_url": "https://app.sandbox.midtrans.com/snap/v2/...",
    "order_id": "ORDER-1234567890-AbC91x",
    "token": "xxx-xxx-xxx"
  }
}
```

### 4. Get Order Info

**GET** `/api/payment/order/:order_id`

Response:
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "order_id": "ORDER-1234567890-AbC91x",
    "status": "paid",
    "price": 25000,
    "target_url": "https://drive.google.com/file/xxx",
    "paid_at": "2024-01-06T10:30:00.000Z"
  }
}
```

### 5. Webhook (Midtrans Notification)

**POST** `/api/webhook`

Endpoint ini dipanggil otomatis oleh Midtrans setelah pembayaran.

## 🧪 Testing

### Test Create Payment Link

```bash
curl -X POST http://localhost:5000/api/create-link \
  -H "Content-Type: application/json" \
  -d '{
    "price": 25000,
    "target_url": "https://google.com"
  }'
```

### Test Get Payment Info

```bash
curl http://localhost:5000/api/payment/AbC91x
```

## 📁 Struktur Folder

```
backend/
├── src/
│   ├── config/          # Database & Midtrans config
│   ├── controllers/     # Business logic
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middlewares/     # Express middlewares
│   ├── utils/           # Helper functions
│   └── app.js           # Express app
├── database/
│   └── schema.sql       # Database schema
├── .env                 # Environment variables
├── .env.example         # Example env file
├── package.json
├── server.js            # Entry point
└── README.md
```

## 🔒 Security Notes

- Jangan commit file `.env` ke repository
- Gunakan HTTPS untuk production
- Validasi semua input dari user
- Gunakan rate limiting untuk production
- Verifikasi signature dari Midtrans webhook

## 🐛 Troubleshooting

### Database Connection Error

- Pastikan PostgreSQL sudah running
- Cek kredensial di `.env`
- Cek apakah database sudah dibuat

### Midtrans Error

- Pastikan Server Key dan Client Key benar
- Gunakan Sandbox mode untuk testing
- Cek di Midtrans Dashboard > Transactions

### Webhook Tidak Berfungsi

- Untuk local development, gunakan ngrok untuk expose localhost
- Set Payment Notification URL di Midtrans Dashboard

## 📝 License

MIT