const mysql = require("mysql2");

if (!process.env.MYSQL_URL) {
  console.error("❌ MYSQL_URL is missing");
  process.exit(1);
}

const pool = mysql.createPool(process.env.MYSQL_URL);

pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ MySQL connected successfully");
    connection.release();
  }
});

module.exports = pool.promise();
