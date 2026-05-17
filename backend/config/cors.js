const isProduction = process.env.NODE_ENV === "production";

const defaultDevOrigins = [
    "http://localhost:3000",
    "http://localhost:5000",
    "http://localhost:5500",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5000",
    "http://127.0.0.1:5500"
];

/** Browser Origin headers never include a trailing slash; normalize env values to match. */
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
    process.env.CORS_ORIGIN || (isProduction ? "*.vercel.app" : defaultDevOrigins.join(","));

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

function isVercelHostname(hostname) {
    return hostname === "vercel.app" || hostname.endsWith(".vercel.app");
}

function isGitHubPagesHostname(hostname) {
    return hostname.endsWith(".github.io");
}

function matchesConfiguredWildcard(hostname) {
    return allowedOrigins.some((allowed) => {
        if (!allowed.startsWith("*.")) {
            return false;
        }
        const domain = allowed.slice(2);
        return hostname === domain || hostname.endsWith(`.${domain}`);
    });
}

function isOriginAllowed(origin) {
    if (!origin) {
        return true;
    }

    if (!isProduction && isLocalDevOrigin(origin)) {
        return true;
    }

    const normalizedOrigin = normalizeOrigin(origin);

    if (allowedOrigins.includes(normalizedOrigin)) {
        return true;
    }

    try {
        const { hostname, protocol } = new URL(normalizedOrigin);
        if (protocol !== "http:" && protocol !== "https:") {
            return false;
        }

        if (matchesConfiguredWildcard(hostname)) {
            return true;
        }

        // Vercel gives each deploy its own URL; allow all *.vercel.app in production
        if (isProduction && process.env.CORS_TRUST_VERCEL !== "false" && isVercelHostname(hostname)) {
            return true;
        }

        // GitHub Pages: https://username.github.io/repo-name/
        if (isProduction && process.env.CORS_TRUST_GITHUB_PAGES !== "false" && isGitHubPagesHostname(hostname)) {
            return true;
        }
    } catch {
        return false;
    }

    return false;
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
