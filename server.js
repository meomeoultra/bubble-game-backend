require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Kết nối PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }  // cần cho Render
});

// Tạo bảng nếu chưa có
(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS leaderboard (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      score INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log("✅ Database sẵn sàng");
})();

// API: lấy top 10
app.get('/leaderboard', async (req, res) => {
  const result = await pool.query(
    'SELECT name, score, created_at FROM leaderboard ORDER BY score DESC LIMIT 10'
  );
  res.json(result.rows);
});

// API: gửi điểm
app.post('/leaderboard', async (req, res) => {
  const { name, score } = req.body;
  if (!name || typeof score !== 'string' && typeof score !== 'number') {
    return res.status(400).json({ error: 'Tên hoặc điểm không hợp lệ' });
  }
  await pool.query(
    'INSERT INTO leaderboard (name, score) VALUES ($1, $2)',
    [name.toString().slice(0, 40), parseInt(score)]
  );
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
