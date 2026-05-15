import { register } from "/src/auth.js";

document.getElementById("registerBtn")?.addEventListener("click", register);

document.querySelectorAll("input").forEach((input) => {
    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") register();
    });
});

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

const passInput = document.getElementById("password");
if (passInput) {
    passInput.addEventListener("input", checkStrength);
}

function checkStrength() {
    const password = document.getElementById("password")?.value || "";
    const container = document.getElementById("strengthContainer");
    const text = document.getElementById("strengthText");
    const bars = [
        document.getElementById("bar1"),
        document.getElementById("bar2"),
        document.getElementById("bar3")
    ].filter(Boolean);

    if (!container || !text || bars.length === 0) return;

    if (!password) {
        container.style.display = "none";
        text.innerText = "";
        return;
    }

    container.style.display = "flex";
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.match(/[A-Z]/) && password.match(/[0-9]/)) strength++;
    if (password.match(/[^A-Za-z0-9]/)) strength++;

    bars.forEach((bar) => {
        bar.style.background = "#e2e8f0";
    });

    if (strength === 1) {
        bars[0].style.background = "#ef4444";
        text.innerText = "Weak password";
        text.style.color = "#ef4444";
    } else if (strength === 2) {
        bars[0].style.background = "#f59e0b";
        bars[1].style.background = "#f59e0b";
        text.innerText = "Getting better...";
        text.style.color = "#f59e0b";
    } else {
        bars.forEach((bar) => {
            bar.style.background = "#22c55e";
        });
        text.innerText = "Strong password";
        text.style.color = "#22c55e";
    }
}
