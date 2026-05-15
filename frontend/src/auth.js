import { userService } from './api/userService.js';
import { showError, clearErrors } from './utils/dom.js';

export async function login() {
    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;
    
    if (!email || !password) {
        showError("passwordError", "Both fields are required");
        return;
    }

    const { ok, data } = await userService.login(email, password);
    
    if (ok) {
        window.location.href = "dashboard.html";
    } else {
        showError("passwordError", data.message || data.error || "Login failed");
    }
}

export async function register() {
    const name = document.getElementById("name")?.value;
    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;
    const confirm = document.getElementById("confirmPassword")?.value;

    if (password !== confirm) {
        showError("confirmError", "Passwords do not match");
        return;
    }

    const { ok, data } = await userService.register(name, email, password);
    
    if (ok) {
        window.location.href = "login.html";
    } else {
        showError("emailError", data.message || data.error || data.errors?.[0]?.msg || "Registration failed");
    }
}

// Attach to window for legacy HTML onclicks (temporary bridge)
// OR better: Attach event listeners programmatically in the page script
window.auth = { login, register };
