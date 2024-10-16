const express = require("express");
const { authenticateToken, isAdmin } = require("../middleware/authMiddleware");
const {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");
const router = express.Router();

// Apply the authenticateToken and isAdmin middlewares to protect routes
router.post("/", authenticateToken, isAdmin, createCustomer);
router.get("/", authenticateToken, isAdmin, getCustomers);
router.get("/:id", authenticateToken, isAdmin, getCustomerById);
router.put("/:id", authenticateToken, isAdmin, updateCustomer);
router.delete("/:id", authenticateToken, isAdmin, deleteCustomer);

module.exports = router;
