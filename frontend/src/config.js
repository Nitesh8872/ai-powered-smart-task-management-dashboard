const localApiBaseUrl = "http://localhost:5000/api";

function isLocalDevHost(hostname) {
    return hostname === "localhost" || hostname === "127.0.0.1";
}

/**
 * Same-origin /api whenever the page is served by our Express app (Render)
 * or by Vercel (vercel.json proxy). Only Live Server uses localhost:5000.
 */
function resolveApiBaseUrl() {
    const { hostname, protocol, port } = window.location;

    const isLiveServer =
        isLocalDevHost(hostname) &&
        port &&
        port !== "5000";

    const isFileOpen = protocol === "file:";

    if (isFileOpen || isLiveServer) {
        return (
            window.APP_CONFIG?.API_BASE_URL ||
            localStorage.getItem("API_BASE_URL") ||
            localApiBaseUrl
        );
    }

    // Render, Vercel, or any host serving /api on the same domain
    return "/api";
}

export const API_BASE_URL = resolveApiBaseUrl().replace(/\/$/, "");

export function apiUrl(path) {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${API_BASE_URL}${normalizedPath}`;
}

// Stale test overrides break production login — remove them outside local dev
if (
    !isLocalDevHost(window.location.hostname) &&
    window.location.protocol !== "file:" &&
    localStorage.getItem("API_BASE_URL")
) {
    localStorage.removeItem("API_BASE_URL");
}
