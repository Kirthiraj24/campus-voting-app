const db = require("../config/db");

exports.createElection = (req, res) => {
  if (!req.session.admin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { title, start_time, end_time } = req.body;

  if (!title || !start_time || !end_time) {
    return res.status(400).json({ message: "All fields required" });
  }

  db.query(
    `
    INSERT INTO elections (title, start_time, end_time, status)
    VALUES (?, ?, ?, 'inactive')
    `,
    [title, start_time, end_time],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "DB error" });
      }
      res.json({ message: "Election created successfully" });
    }
  );
};



exports.getAllElections = (req, res) => {
  db.query("SELECT * FROM elections", (err, results) => {
    if (err) return res.status(500).json({ message: "DB error" });
    res.json(results);
  });
};
exports.getActiveElections = (req, res) => {
  db.query(
    `
    SELECT * FROM elections
    WHERE status = 'active'
      AND NOW() BETWEEN start_time AND end_time
    `,
    (err, results) => {
      if (err) return res.status(500).json({ message: "DB error" });
      res.json(results);
    }
  );
};


exports.endElection = (req, res) => {
  const { election_id } = req.body;

  if (!election_id) {
    return res.status(400).json({ message: "Election ID required" });
  }

  db.query(
    "UPDATE elections SET status = 'closed', end_time = NOW() WHERE id = ?",
    [election_id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to end election" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Election not found" });
      }

      res.json({ message: "Election ended successfully" });
    }
  );
};
exports.getElectionStats = (req, res) => {
  const { election_id } = req.query;

  if (!election_id) {
    return res.status(400).json({ message: "Election ID required" });
  }

  const stats = {};

  db.query(
    "SELECT COUNT(*) AS candidateCount FROM candidates WHERE election_id = ?",
    [election_id],
    (err, cResult) => {
      if (err) return res.status(500).json({ message: "DB error" });

      stats.candidates = cResult[0].candidateCount;

      db.query(
        "SELECT COUNT(*) AS voteCount FROM votes WHERE election_id = ?",
        [election_id],
        (err, vResult) => {
          if (err) return res.status(500).json({ message: "DB error" });

          stats.votes = vResult[0].voteCount;

          res.json(stats);
        }
      );
    }
  );
};

exports.activateElection = (req, res) => {
  if (!req.session.admin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { election_id } = req.body;

  if (!election_id) {
    return res.status(400).json({ message: "Election ID required" });
  }

  db.query(
    "UPDATE elections SET status = 'inactive' WHERE status = 'active'",
    err => {
      if (err) return res.status(500).json({ message: "DB error" });

      db.query(
        "UPDATE elections SET status = 'active' WHERE id = ?",
        [election_id],
        err2 => {
          if (err2) return res.status(500).json({ message: "DB error" });

          res.json({ message: "Election activated (manual override)" });
        }
      );
    }
  );
};

exports.deactivateElection = (req, res) => {
  if (!req.session.admin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { election_id } = req.body;

  db.query(
    "UPDATE elections SET status = 'inactive' WHERE id = ?",
    [election_id],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "DB error" });
      }

      res.json({ message: "Election deactivated" });
    }
  );
};
exports.getElectionStatus = (req, res) => {
  const { election_id } = req.params;

  db.query(
    "SELECT end_time, status FROM elections WHERE id = ?",
    [election_id],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "DB error" });

      if (rows.length === 0) {
        return res.status(404).json({ message: "Election not found" });
      }

      const now = new Date();
      const endTime = new Date(rows[0].end_time);

      res.json({
        status: rows[0].status,
        ended: now > endTime
      });
    }
  );
};


exports.deleteElection = (req, res) => {
  if (!req.session.admin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { election_id } = req.body;

  if (!election_id) {
    return res.status(400).json({ message: "Election ID required" });
  }

  db.query(
    "DELETE FROM elections WHERE id = ?",
    [election_id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "DB error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Election not found" });
      }

      res.json({ message: "Election deleted successfully" });
    }
  );
};
