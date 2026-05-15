import { storage } from '../utils/storage.js';
import { apiUrl } from '../config.js';

export async function fetchWithAuth(url, options = {}) {
    let token = storage.getToken();
    if (!options.headers) options.headers = {};
    if (token) options.headers["Authorization"] = `Bearer ${token}`;

    let res = await fetch(url, options);

    // If unauthorized, try to refresh token
    if (res.status === 401 || res.status === 403) {
        const refreshToken = storage.getRefreshToken();
        if (refreshToken) {
            try {
                const refreshRes = await fetch(apiUrl("/users/refresh"), {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ refreshToken })
                });

                if (refreshRes.ok) {
                    const data = await refreshRes.json();
                    storage.setTokens(data.token, data.refreshToken);

                    // Retry original request with new token
                    options.headers["Authorization"] = `Bearer ${data.token}`;
                    res = await fetch(url, options);

                    // If retry still fails, session is truly expired
                    if (res.status === 401 || res.status === 403) {
                        handleLogout();
                        throw new Error("Session expired. Please log in again.");
                    }
                } else {
                    handleLogout();
                    throw new Error("Session expired. Please log in again.");
                }
            } catch (e) {
                // Only logout + rethrow if it's an auth error, not a network error we already wrapped
                if (e.message === "Session expired. Please log in again.") throw e;
                handleLogout();
                throw new Error("Session expired. Please log in again.");
            }
        } else {
            handleLogout();
            throw new Error("Not authenticated. Please log in.");
        }
    }
    return res;
}

function handleLogout() {
    storage.clearTokens();
    window.location.href = "login.html";
}
