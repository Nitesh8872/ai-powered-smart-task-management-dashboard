const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const errorHandler = require("./middleware/errorMiddleware");
const routes = require("./routes");

const app = express();

const defaultDevOrigins = "http://localhost:3000,http://localhost:5000,http://127.0.0.1:5500";
const corsOriginConfig = process.env.CORS_ORIGIN || (process.env.NODE_ENV === "production" ? "" : defaultDevOrigins);

const allowedOrigins = corsOriginConfig
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

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

app.use(
    cors({
        origin(origin, callback) {
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error("Not allowed by CORS"));
        },
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

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
        required: {
            mongoUri: Boolean(process.env.MONGO_URI),
            jwtSecret: Boolean(process.env.JWT_SECRET),
            refreshSecret: Boolean(process.env.REFRESH_SECRET),
            corsOrigin: Boolean(process.env.CORS_ORIGIN)
        }
    });
});

app.use("/api", routes);

app.use(errorHandler);

module.exports = app;
