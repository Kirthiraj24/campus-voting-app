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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})