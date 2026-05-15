const localApiBaseUrl = "http://localhost:5000/api";
const productionApiBaseUrl = "/api";

const configuredApiBaseUrl =
    window.APP_CONFIG?.API_BASE_URL ||
    localStorage.getItem("API_BASE_URL") ||
    (["localhost", "127.0.0.1"].includes(window.location.hostname) || window.location.protocol === "file:"
        ? localApiBaseUrl
        : productionApiBaseUrl);

export const API_BASE_URL = configuredApiBaseUrl.replace(/\/$/, "");

export function apiUrl(path) {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${API_BASE_URL}${normalizedPath}`;
}
