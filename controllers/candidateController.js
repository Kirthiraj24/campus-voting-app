const db = require("../config/db");

exports.addCandidate = (req, res) => {
  if (!req.session.admin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { name, election_id } = req.body || {};

  if (!name || !election_id) {
    return res.status(400).json({ message: "Name and election_id required" });
  }

  db.query(
    "INSERT INTO candidates (name, election_id) VALUES (?, ?)",
    [name, election_id],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "DB error" });
      }
      res.json({ message: "Candidate added successfully" });
    }
  );
};
exports.getAllCandidates = (req,res) =>{
    db.query("SELECT * FROM candidates", (err, results) => {
    if (err) return res.status(500).json({ message: "DB error" });
    res.json(results);
  });
}

exports.getCandidatesByElection = (req, res) => {
  const { election_id } = req.params;

  db.query(
    "SELECT * FROM candidates WHERE election_id = ?",
    [election_id],
    (err, results) => {
      if (err) return res.status(500).json({ message: "DB error" });
      res.json(results);
    }
  );
};
exports.deleteCandidate = (req, res) => {
  const { candidate_id } = req.body;

  if (!candidate_id) {
    return res.status(400).json({ message: "Candidate ID required" });
  }

  db.query(
    "DELETE FROM candidates WHERE id = ?",
    [candidate_id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to delete candidate" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Candidate not found" });
      }

      res.json({ message: "Candidate removed successfully" });
    }
  );
};
