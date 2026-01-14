const express = require("express");
const router = express.Router();

const electionController = require("../controllers/electionController");

router.post("/create", electionController.createElection);

router.get("/all", electionController.getAllElections);

router.get("/active", electionController.getActiveElections);

router.post("/end", electionController.endElection);

router.get("/stats", electionController.getElectionStats);

router.post("/activate", electionController.activateElection);

router.post("/deactivate", electionController.deactivateElection);

router.post("/delete", electionController.deleteElection);


module.exports = router;
