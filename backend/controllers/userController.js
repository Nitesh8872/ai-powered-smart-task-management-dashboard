const userService = require("../services/userService");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Register user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const result = await userService.register(req.body);
    res.status(201).json({
        success: true,
        message: result.message
    });
});

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await userService.login(email, password);

    res.status(200).json({
        success: true,
        message: "Login successful",
        token: result.token,
        refreshToken: result.refreshToken,
        user: result.user
    });
});

// @desc    Refresh token
// @route   POST /api/users/refresh
// @access  Public
const refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    const tokens = await userService.refreshUserToken(refreshToken);

    res.status(200).json({
        success: true,
        token: tokens.token,
        refreshToken: tokens.refreshToken
    });
});

module.exports = {
    registerUser,
    loginUser,
    refreshToken
};
