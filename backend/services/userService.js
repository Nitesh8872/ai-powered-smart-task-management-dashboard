const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/ErrorResponse");

const generateTokens = (user) => {
    if ((!process.env.JWT_SECRET || !process.env.REFRESH_SECRET) && process.env.NODE_ENV === "production") {
        throw new Error("JWT_SECRET and REFRESH_SECRET are required in production");
    }

    const jwtSecret = process.env.JWT_SECRET || "dev-jwt-secret-change-me";
    const refreshSecret = process.env.REFRESH_SECRET || "dev-refresh-secret-change-me";

    const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: user._id }, refreshSecret, { expiresIn: "7d" });

    return { token, refreshToken };
};

const register = async (userData) => {
    const { name, email, password } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ErrorResponse("User already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
        name,
        email,
        password: hashedPassword
    });

    await user.save();
    return { message: "User Registered Successfully" };
};

const login = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new ErrorResponse("Invalid credentials", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new ErrorResponse("Invalid credentials", 401);
    }

    const { token, refreshToken } = generateTokens(user);
    user.refreshToken = refreshToken;
    await user.save();

    return {
        token,
        refreshToken,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
};

const refreshUserToken = async (refreshToken) => {
    if (!refreshToken) {
        throw new ErrorResponse("No refresh token provided", 401);
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
        throw new ErrorResponse("Invalid refresh token", 403);
    }

    if (!process.env.REFRESH_SECRET && process.env.NODE_ENV === "production") {
        throw new Error("REFRESH_SECRET is required in production");
    }

    const refreshSecret = process.env.REFRESH_SECRET || "dev-refresh-secret-change-me";
    try {
        const decoded = jwt.verify(refreshToken, refreshSecret);
        const tokens = generateTokens(user);

        user.refreshToken = tokens.refreshToken;
        await user.save();

        return tokens;
    } catch (err) {
        throw new ErrorResponse("Refresh token expired or invalid", 403);
    }
};

module.exports = {
    register,
    login,
    refreshUserToken
};
