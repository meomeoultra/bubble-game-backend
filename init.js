const { Pool } = require('pg');

const pool = new Pool({
  user: 'your_db_user',
  host: 'your_db_host',
  database: 'your_db_name',
  password: 'your_db_password',
  port: 5432
});

(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS leaderboard (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50),
        score INT
      )
    `);
    console.log("Bảng leaderboard đã tạo hoặc tồn tại.");
    process.exit(0);
  } catch(err) {
    console.error(err);
    process.exit(1);
  }
})();
