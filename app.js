require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");

const app = express();
// app.use(express.static(path.join(__dirname, "..", "client")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: "campus-voting-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: false   
  }
}));


const db = require("./config/db");
require("./jobs/electionNotification");

const testRoutes = require("./routes/testRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const electionRoutes = require("./routes/electionRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const voteRoutes = require("./routes/voteRoutes");
const resultRoutes = require("./routes/resultRoutes");

app.use("/api", testRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/elections",electionRoutes);
app.use("/api/candidates",candidateRoutes);
app.use("/api/votes",voteRoutes);
app.use("/api/results", resultRoutes);

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "..", "client", "index.html"));
// });

const PORT = process.env.PORT || 3000;

// app.get("/results", (req, res) => {
//   res.sendFile(path.join(__dirname, "..", "client", "results.html"));
// });

// app.get("/login", (req, res) => {
//   res.sendFile(path.join(__dirname, "..", "client", "login.html"));
// });

// app.get("/dashboard", (req, res) => {
//   res.sendFile(path.join(__dirname, "..", "client", "dashboard.html"));
// });

// app.get("/vote", (req, res) => {
//   res.sendFile(path.join(__dirname, "..", "client", "vote.html"));
// });

// app.get("/receipt", (req, res) => {
//   res.sendFile(path.join(__dirname, "..", "client", "receipt.html"));
// });

// app.get("/results", (req, res) => {
//   res.sendFile(path.join(__dirname, "..", "client", "results.html"));
// });

// app.get("/admin/login", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/admin-login.html"));
// });

// app.get("/admin/dashboard", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/admin-dashboard.html"));
// });


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
