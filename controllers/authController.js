const db = require("../config/db");
const nodemailer = require("nodemailer");

let otpStore = {}; 

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendOtp = (req, res) => {
  const { email } = req.body || {};

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  if (!email.endsWith("@kce.ac.in")) {
    return res.status(403).json({
      message: "Only official college email IDs are allowed"
    });
  }

  // 🔒 CHECK IF USER IS REGISTERED BEFORE SENDING OTP
  db.query(
    "SELECT id FROM users WHERE email = ?",
    [email],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "DB error" });
      }

      if (result.length === 0) {
        return res.status(403).json({
          message: "You are not registered to vote. Contact admin."
        });
      }

      const otp = Math.floor(100000 + Math.random() * 900000);
      otpStore[email] = otp;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Campus Voting App - OTP Verification",
        text: `Your OTP is ${otp}`
      };

      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: "OTP sending failed" });
        }
        res.json({ message: "OTP sent successfully" });
      });
    }
  );
};

exports.verifyOtp = (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP required" });
  }

  if (!email.endsWith("@kce.ac.in")) {
    return res.status(403).json({
      message: "Unauthorized email domain"
    });
  }

  if (otpStore[email] != otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  // 🔒 FINAL CHECK — USER MUST EXIST
  db.query(
    "SELECT id FROM users WHERE email = ?",
    [email],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "DB error" });
      }

      if (result.length === 0) {
        return res.status(403).json({
          message: "You are not registered to vote"
        });
      }

      // ✅ LOGIN SUCCESS
      req.session.user = email;
      delete otpStore[email];

      res.json({ message: "Login successful" });
    }
  );
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out successfully" });
  });
};

exports.getMe = (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not logged in" });
  }

  res.json({
    email: req.session.user
  });
};
