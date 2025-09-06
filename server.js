const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// ==========================
// CẤU HÌNH DATABASE
// Thay đổi theo thông tin Postgres của bạn trên Render
const pool = new Pool({
  user: 'your_db_user',
  host: 'your_db_host',
  database: 'your_db_name',
  password: 'your_db_password',
  port: 5432
});
// ==========================

// Test server
app.get('/', (req, res) => res.send('Server Bubble Game Online chạy OK!'));

// Lưu điểm
app.post('/score', async (req, res) => {
  const { name, score } = req.body;
  if (!name || !score) return res.status(400).json({ error: 'Thiếu name hoặc score' });
  try {
    await pool.query('INSERT INTO leaderboard(name, score) VALUES($1, $2)', [name, score]);
    res.json({ status: 'ok' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Lấy top 10 leaderboard
app.get('/leaderboard', async (req, res) => {
  try {
    const result = await pool.query('SELECT name, score FROM leaderboard ORDER BY score DESC LIMIT 10');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Chạy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
