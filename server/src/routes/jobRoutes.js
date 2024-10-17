const express = require("express");
const {
  createJob,
  getJob,
  getJobs,
  updateJob,
  assignJobToFitter,
  proposeDates,
  acceptProposal,
  createRemedial,
  markRemedialAsCompleted,
} = require("../controllers/jobController");
const { authenticateToken, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authenticateToken, isAdmin, createJob);
router.get("/", authenticateToken, getJobs);
router.get("/:id", authenticateToken, getJob);
router.put("/:id", authenticateToken, isAdmin, updateJob);
router.post("/assign", authenticateToken, isAdmin, assignJobToFitter);
router.post("/propose-dates", authenticateToken, proposeDates);
router.post("/accept-proposal", authenticateToken, isAdmin, acceptProposal);
router.post("/remedial", authenticateToken, createRemedial);
router.post("/remedial-complete", authenticateToken, markRemedialAsCompleted);

module.exports = router;
