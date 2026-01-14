require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");

const app = express();

/* ===============================
   MIDDLEWARE
================================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "campus-voting-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false
    }
  })
);

/* ===============================
   TEST ROUTES (IMPORTANT)
================================= */
app.get("/api/test", (req, res) => {
  res.json({ status: "OK", message: "Backend is running" });
});

app.get("/api/test-db", async (req, res) => {
  try {
    const db = require("./config/db");
    const [rows] = await db.query("SELECT 1 AS ok");
    res.json({ status: "DB connected", rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===============================
   API ROUTES
================================= */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/elections", require("./routes/electionRoutes"));
app.use("/api/candidates", require("./routes/candidateRoutes"));
app.use("/api/votes", require("./routes/voteRoutes"));
app.use("/api/results", require("./routes/resultRoutes"));

/* ===============================
   IMPORTANT: NO CRON FOR NOW
   (DO NOT require jobs here)
================================= */

/* ===============================
   START SERVER
================================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("✅ Server running on port", PORT);
});
