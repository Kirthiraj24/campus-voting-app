const express = require("express");
const router = express.Router();
const voteController = require("../controllers/voteController");

router.post("/cast", voteController.castVote);
router.get("/status", voteController.checkVoteStatus);

module.exports = router;
