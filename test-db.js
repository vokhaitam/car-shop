const pool = require('./config/database');

(async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ DB Connected:', result.rows[0]);
    process.exit(0);
  } catch (err) {
    console.error('❌ DB Error:', err.message);
    process.exit(1);
  }
})();
