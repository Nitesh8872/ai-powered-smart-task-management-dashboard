const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const token = req.header("Authorization");

        if (!token) {
            return res.status(401).json({
                message: "No token, authorization denied"
            });
        }

        const actualToken = token.startsWith("Bearer ")
            ? token.split(" ")[1]
            : token;

        if (!process.env.JWT_SECRET && process.env.NODE_ENV === "production") {
            throw new Error("JWT_SECRET is required in production");
        }

        const jwtSecret = process.env.JWT_SECRET || "dev-jwt-secret-change-me";
        const decoded = jwt.verify(actualToken, jwtSecret);

        req.user = decoded;

        next();

    } catch (err) {
        console.error('Auth Middleware Error:', err.message);
        res.status(401).json({
            message: "Invalid token"
        });

    }

};

module.exports = authMiddleware;
