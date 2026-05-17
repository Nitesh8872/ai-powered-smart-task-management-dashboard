const localApiBaseUrl = "http://localhost:5000/api";
const productionApiBaseUrl = "/api";
const renderApiBaseUrl = "https://smart-task-dashboard-api.onrender.com/api";

function isLocalDevHost(hostname) {
    return hostname === "localhost" || hostname === "127.0.0.1";
}

function isVercelHost(hostname) {
    return hostname.endsWith(".vercel.app") || hostname === "vercel.app";
}

function isGitHubPagesHost(hostname) {
    return hostname.endsWith(".github.io");
}

function resolveApiBaseUrl() {
    const { hostname, protocol } = window.location;

    // Vercel: same-origin /api proxy (see vercel.json)
    if (isVercelHost(hostname)) {
        return productionApiBaseUrl;
    }

    // GitHub Pages: no /api proxy — call Render directly
    if (isGitHubPagesHost(hostname)) {
        return window.APP_CONFIG?.API_BASE_URL || renderApiBaseUrl;
    }

    if (isLocalDevHost(hostname) || protocol === "file:") {
        return (
            window.APP_CONFIG?.API_BASE_URL ||
            localStorage.getItem("API_BASE_URL") ||
            localApiBaseUrl
        );
    }

    return window.APP_CONFIG?.API_BASE_URL || productionApiBaseUrl;
}

export const API_BASE_URL = resolveApiBaseUrl().replace(/\/$/, "");

export function apiUrl(path) {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${API_BASE_URL}${normalizedPath}`;
}
