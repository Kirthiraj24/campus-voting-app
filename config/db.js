const mysql = require("mysql2/promise");

const pool = mysql.createPool(process.env.MYSQL_URL);

pool.getConnection()
  .then(conn => {
    console.log("✅ MySQL connected");
    conn.release();
  })
  .catch(err => {
    console.error("❌ Database connection failed:", err.message);
  });

module.exports = pool;
