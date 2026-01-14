const mysql = require("mysql2");

const pool = mysql.createPool(process.env.MYSQL_URL);

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("MySQL connected successfully");
    connection.release();
  }
});

module.exports = pool.promise();
