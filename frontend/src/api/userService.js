import { storage } from '../utils/storage.js';
import { apiUrl } from '../config.js';

export const userService = {
    login: async (email, password) => {
        const res = await fetch(apiUrl("/users/login"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await parseJson(res);
        if (res.ok) {
            storage.setTokens(data.token, data.refreshToken);
            storage.set("email", email);
        }
        return { ok: res.ok, data };
    },

    register: async (name, email, password) => {
        const res = await fetch(apiUrl("/users/register"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });
        const data = await parseJson(res);
        return { ok: res.ok, data };
    },

    logout: () => {
        storage.clearTokens();
        window.location.href = "login.html";
    }
};

async function parseJson(res) {
    try {
        return await res.json();
    } catch {
        return {
            message: res.ok
                ? "Request completed"
                : "Server did not return a valid JSON response"
        };
    }
}
