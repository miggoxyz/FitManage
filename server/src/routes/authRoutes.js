const express = require("express");
const {
  registerUser,
  loginUser,
  verifyCode,
  resendVerificationCode,
} = require("../controllers/authController");
const { authenticateToken } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-code", authenticateToken, verifyCode);
router.post("/resend-verification", authenticateToken, resendVerificationCode);

module.exports = router;
