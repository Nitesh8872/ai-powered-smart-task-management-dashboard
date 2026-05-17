const isProduction = process.env.NODE_ENV === "production";

const defaultDevOrigins = [
    "http://localhost:3000",
    "http://localhost:5000",
    "http://localhost:5500",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5000",
    "http://127.0.0.1:5500"
];

function normalizeOrigin(value) {
    const trimmed = String(value).trim();
    if (!trimmed) return "";
    if (trimmed.startsWith("*.")) return trimmed;

    try {
        const url = new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`);
        return `${url.protocol}//${url.host}`;
    } catch {
        return trimmed.replace(/\/+$/, "");
    }
}

const corsOriginConfig =
    process.env.CORS_ORIGIN || (isProduction ? "*" : defaultDevOrigins.join(","));

const allowedOrigins = corsOriginConfig
    .split(",")
    .map(normalizeOrigin)
    .filter(Boolean);

function isLocalDevOrigin(origin) {
    if (!origin || origin === "null") {
        return true;
    }

    try {
        const { hostname } = new URL(origin);
        return (
            hostname === "localhost" ||
            hostname === "127.0.0.1" ||
            hostname === "[::1]" ||
            hostname === "0.0.0.0"
        );
    } catch {
        return false;
    }
}

function isOriginAllowed(origin) {
    if (!origin) {
        return true;
    }

    if (!isProduction && isLocalDevOrigin(origin)) {
        return true;
    }

    // Production: allow every browser origin (fixes Vercel/GitHub URL changes forever)
    if (isProduction && process.env.STRICT_CORS !== "true") {
        return true;
    }

    return allowedOrigins.includes(normalizeOrigin(origin));
}

const corsOptions = {
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    origin(origin, callback) {
        if (isOriginAllowed(origin)) {
            return callback(null, true);
        }

        const corsError = new Error(`CORS origin not allowed: ${origin}`);
        corsError.statusCode = 403;
        return callback(corsError);
    }
};

module.exports = {
    corsOptions,
    allowedOrigins,
    isProduction,
    isOriginAllowed
};
