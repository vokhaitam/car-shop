const { Pool } = require("pg");

// Kết nối PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// Tạo bảng users nếu chưa có
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        fullname VARCHAR(255),
        phone VARCHAR(20),
        address TEXT,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Database initialized successfully");
  } catch (err) {
    console.error("❌ Error creating table:", err.message);
  }
};

initDB();

// Hàm tạo user mới
async function createUser(email, password, fullname, phone, address) {
  const result = await pool.query(
    `INSERT INTO users (email, password, fullname, phone, address) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING id, email, fullname, phone, address, role`,
    [email, password, fullname, phone, address],
  );
  return result.rows[0];
}

// Hàm tìm user theo email
async function findUserByEmail(email) {
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);
  return result.rows[0];
}

module.exports = { createUser, findUserByEmail, pool };
