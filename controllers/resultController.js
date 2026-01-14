const db = require("../config/db");

exports.getLiveResultsByElection = (req, res) => {
  const { election_id } = req.params;

  if (!election_id) {
    return res.status(400).json({ message: "Election ID required" });
  }

  db.query(
    `
    SELECT c.id, c.name, COUNT(v.id) AS votes
    FROM candidates c
    LEFT JOIN votes v ON c.id = v.candidate_id
    WHERE c.election_id = ?
    GROUP BY c.id
    ORDER BY votes DESC
    `,
    [election_id],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "DB error" });
      }
      res.json(results);
    }
  );
};
