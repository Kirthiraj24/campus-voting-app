const db = require("../config/db");
const bcrypt = require("bcrypt");

exports.adminLogin = (req, res) => {
  const { email, password } = req.body || {};

  console.log("Admin login request:", email);

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  db.query(
    "SELECT * FROM admins WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "DB error" });
      }

      if (result.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const admin = result[0];
      const match = await bcrypt.compare(password, admin.password);

      if (!match) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.admin = admin.email;
      res.json({ message: "Admin login successful" });
    }
  );
};
