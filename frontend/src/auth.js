import { userService } from './api/userService.js';
import { showError, clearErrors } from './utils/dom.js';

export async function login() {
    clearErrors();

    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value;
    const loginBtn = document.getElementById("loginBtn");
    
    if (!email || !password) {
        showError("passwordError", "Both fields are required");
        return;
    }

    try {
        setButtonLoading(loginBtn, true, "Signing in...");
        const { ok, data } = await userService.login(email, password);
        
        if (ok) {
            if (document.getElementById("rememberMe")?.checked) {
                localStorage.setItem("rememberedEmail", email);
            } else {
                localStorage.removeItem("rememberedEmail");
            }
            window.location.href = "dashboard.html";
        } else {
            showError("passwordError", data.message || data.error || "Login failed. Check your email and password.");
        }
    } catch (error) {
        showError("passwordError", "Unable to reach the server. Please try again in a moment.");
    } finally {
        setButtonLoading(loginBtn, false, "Sign In");
    }
}

export async function register() {
    clearErrors();

    const name = document.getElementById("name")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value;
    const confirm = document.getElementById("confirmPassword")?.value;
    const registerBtn = document.getElementById("registerBtn");

    if (!name || !email || !password || !confirm) {
        showError("emailError", "All fields are required");
        return;
    }

    if (password !== confirm) {
        showError("confirmError", "Passwords do not match");
        return;
    }

    try {
        setButtonLoading(registerBtn, true, "Creating account...");
        const { ok, data } = await userService.register(name, email, password);
        
        if (ok) {
            window.location.href = "login.html";
        } else {
            showError("emailError", data.message || data.error || data.errors?.[0]?.msg || "Registration failed");
        }
    } catch (error) {
        showError("emailError", "Unable to reach the server. Please try again in a moment.");
    } finally {
        setButtonLoading(registerBtn, false, "Create Account");
    }
}

function setButtonLoading(button, isLoading, text) {
    if (!button) return;
    button.disabled = isLoading;
    button.innerText = text;
}

// Attach to window for legacy HTML onclicks (temporary bridge)
// OR better: Attach event listeners programmatically in the page script
window.auth = { login, register };
