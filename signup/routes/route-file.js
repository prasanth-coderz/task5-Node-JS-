// IT USES TO REDIRECT THE API

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authcontroller");
const authenticateToken = require("../middleware/authenticateToken");

// Signup Route
router.post("/signup", authController.signup);

// Login Route
router.post("/login", authController.login);

// Change Password Route
router.post("/changepwd", authenticateToken, authController.changePassword);

// Customer List Route
router.post("/customer/list", authenticateToken, authController.customerList);

module.exports = router;
