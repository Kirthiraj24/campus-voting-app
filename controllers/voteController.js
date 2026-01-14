const db = require("../config/db");



exports.castVote = (req, res) => {
  const { candidate_id, election_id } = req.body;

  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const email = req.session.user;

  // 🔹 Get user ID from email
  db.query(
    "SELECT id FROM users WHERE email = ?",
    [email],
    (err, users) => {
      if (err || users.length === 0) {
        return res.status(500).json({ message: "User not found" });
      }

      const userId = users[0].id;

      // 🔹 Check election active
      db.query(
        "SELECT * FROM elections WHERE id = ? AND status = 'active'",
        [election_id],
        (err, elections) => {
          if (err) return res.status(500).json({ message: "DB error" });

          if (elections.length === 0) {
            return res.status(400).json({ message: "Election is not active" });
          }

          const election = elections[0];
          const now = new Date();
const startTime = new Date(election.start_time);
const endTime = new Date(election.end_time);

if (now < startTime) {
  return res.status(403).json({
    message: "Voting has not started yet"
  });
}

if (now > endTime) {
  return res.status(403).json({
    message: "Voting has ended for this election"
  });
}
          // 🔹 Prevent double voting
          db.query(
            "SELECT id FROM votes WHERE user_id = ? AND election_id = ?",
            [userId, election_id],
            (err, voted) => {
              if (voted.length > 0) {
                return res.status(400).json({ message: "Already voted" });
              }

              // 🔹 Cast vote
              db.query(
                "INSERT INTO votes (user_id, candidate_id, election_id) VALUES (?, ?, ?)",
                [userId, candidate_id, election_id],
                (err) => {
                  if (err) {
                    console.error(err);
                    return res.status(500).json({ message: "Vote failed" });
                  }

                  res.json({ message: "Vote cast successfully" });
                }
              );
            }
          );
        }
      );
    }
  );
};

exports.checkVoteStatus = (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not logged in" });
  }

  const { election_id } = req.query;
  if (!election_id) {
    return res.status(400).json({ message: "Election ID required" });
  }

  const email = req.session.user;

  db.query(
    "SELECT id FROM users WHERE email = ?",
    [email],
    (err, userResult) => {
      if (err || userResult.length === 0) {
        return res.status(500).json({ message: "User not found" });
      }

      const userId = userResult[0].id;

      db.query(
        "SELECT id FROM votes WHERE user_id = ? AND election_id = ?",
        [userId, election_id],
        (err, voteResult) => {
          if (err) {
            return res.status(500).json({ message: "DB error" });
          }

          res.json({ voted: voteResult.length > 0 });
        }
      );
    }
  );
};
