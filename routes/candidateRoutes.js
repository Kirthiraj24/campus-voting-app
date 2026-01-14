const express = require("express");
const router = express.Router();
const candidateController = require("../controllers/candidateController");

router.post("/add", candidateController.addCandidate);
router.get("/all", candidateController.getAllCandidates);
router.get("/election/:election_id", candidateController.getCandidatesByElection);
router.post("/delete", candidateController.deleteCandidate);


module.exports = router;
