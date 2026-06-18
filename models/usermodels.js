const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// Tạo user mới
const createUser = async (
  email,
  passwordHash,
  fullname,
  phone = null,
  address = null,
  dob = null,
) => {
  const query = `INSERT INTO users (email, password, fullname, phone, address, dob, role) 
                 VALUES ($1, $2, $3, $4, $5, $6, 'user') RETURNING id`;
  const values = [email, passwordHash, fullname, phone, address, dob];
  const res = await pool.query(query, values);
  return res.rows[0];
};

// Tìm user theo email
const findUserByEmail = async (email) => {
  const res = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return res.rows[0];
};

module.exports = { createUser, findUserByEmail };
