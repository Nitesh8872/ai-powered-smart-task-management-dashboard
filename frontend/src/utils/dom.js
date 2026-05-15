// DOM Helpers
export function showError(id, message) {
    const el = document.getElementById(id);
    if (el) el.innerText = message;
}

export function clearErrors() {
    document.querySelectorAll('.error-text').forEach(el => el.innerText = "");
}

export function toggleClass(selector, className) {
    const el = document.querySelector(selector);
    if (el) el.classList.toggle(className);
}

export function setElementText(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
}

export function setElementHTML(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
}
