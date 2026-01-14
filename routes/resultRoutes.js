const express = require("express");
const router = express.Router();
const resultController = require("../controllers/resultController");

router.get("/:election_id", resultController.getLiveResultsByElection);

module.exports = router;
