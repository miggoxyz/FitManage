const express = require("express");
const { getUsersByRole } = require("../controllers/userController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticateToken, getUsersByRole);

module.exports = router;
