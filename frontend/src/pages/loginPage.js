import { login } from "/src/auth.js";

document.getElementById("loginBtn")?.addEventListener("click", login);

document.querySelectorAll("input").forEach((input) => {
    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") login();
    });
});

const rememberedEmail = localStorage.getItem("rememberedEmail");
if (rememberedEmail) {
    const emailInput = document.getElementById("email");
    const rememberMe = document.getElementById("rememberMe");
    if (emailInput) emailInput.value = rememberedEmail;
    if (rememberMe) rememberMe.checked = true;
}

window.togglePassword = function (id, icon) {
    const input = document.getElementById(id);
    if (!input) return;

    if (input.type === "password") {
        input.type = "text";
        icon.classList.replace("fa-eye", "fa-eye-slash");
    } else {
        input.type = "password";
        icon.classList.replace("fa-eye-slash", "fa-eye");
    }
};
