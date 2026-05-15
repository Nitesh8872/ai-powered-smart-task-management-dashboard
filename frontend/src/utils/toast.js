// Toast Notification System
export function showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    if (!container) return; 

    const toast = document.createElement("div");
    // Styling from original app.js
    toast.style.background = type === 'success' ? '#10b981' : '#ef4444';
    toast.style.color = 'white';
    toast.style.padding = '12px 20px';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '10px';
    toast.style.fontWeight = '500';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100px)';
    toast.style.transition = '0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

    const icon = type === "success" ? "fa-circle-check" : "fa-circle-exclamation";
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    }, 10);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
