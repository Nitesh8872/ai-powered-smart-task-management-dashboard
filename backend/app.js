const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const errorHandler = require("./middleware/errorMiddleware");
const routes = require("./routes");
const { corsOptions, allowedOrigins, isProduction } = require("./config/cors");

const app = express();

app.use(
    helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" }
    })
);

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX) || 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many requests from this IP, please try again later." }
});

app.use("/api/", apiLimiter);
app.use(cors(corsOptions));
app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "AI-Powered Smart Task Management Dashboard API is running"
    });
});

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        status: "healthy",
        uptime: process.uptime()
    });
});

app.get("/health/config", (req, res) => {
    res.status(200).json({
        success: true,
        environment: process.env.NODE_ENV || "development",
        cors: {
            allowedOrigins,
            trustVercel: isProduction && process.env.CORS_TRUST_VERCEL !== "false"
        },
        required: {
            mongoUri: Boolean(process.env.MONGO_URI),
            jwtSecret: Boolean(process.env.JWT_SECRET),
            refreshSecret: Boolean(process.env.REFRESH_SECRET)
        }
    });
});

app.use("/api", routes);
app.use(errorHandler);

module.exports = app;
