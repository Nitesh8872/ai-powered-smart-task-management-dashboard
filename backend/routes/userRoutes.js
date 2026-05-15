const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const userController = require("../controllers/userController");
const validateRequest = require("../middleware/validationMiddleware");

// REGISTER
router.post(
    "/register",
    [
        body("name", "Name is required").notEmpty(),
        body("email", "Please include a valid email").isEmail(),
        body("password", "Please enter a password with 6 or more characters").isLength({ min: 6 })
    ],
    validateRequest,
    userController.registerUser
);

// LOGIN
router.post(
    "/login",
    [
        body("email", "Please include a valid email").isEmail(),
        body("password", "Password is required").exists()
    ],
    validateRequest,
    userController.loginUser
);

// REFRESH TOKEN
router.post("/refresh", userController.refreshToken);

module.exports = router;