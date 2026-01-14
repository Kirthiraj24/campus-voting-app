const mysql = require("mysql2");

const pool = mysql.createPool(process.env.DATABASE_URL);

pool.getConnection((err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("Database connected successfully");
  }
});

module.exports = pool;
