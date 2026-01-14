const mysql = require("mysql2/promise");

if (!process.env.MYSQL_URL) {
  console.error("❌ MYSQL_URL is missing");
  process.exit(1);
}

const pool = mysql.createPool({
  uri: process.env.MYSQL_URL,
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = pool;
