import { state } from './state/appState.js';
import { taskService } from './api/taskService.js';
import { userService } from './api/userService.js';
import { showToast } from './utils/toast.js';
import { setElementText, setElementHTML, toggleClass } from './utils/dom.js';
import { createTaskHTML } from './components/TaskCard.js';
import { renderCalendar } from './components/Calendar.js';
import { renderPriorityChart, renderVelocityChart } from './components/Charts.js';
import { renderListView, renderBoardView } from './components/TaskGrid.js';
import { renderTaskSkeleton, renderBoardSkeleton } from './components/SkeletonLoader.js';
import { AIChatbot } from './components/AIChatbot.js';
import { Summarizer } from './components/Summarizer.js';

let aiChatbot;
let summarizer;

// --- Initialization ---
if (!localStorage.getItem("token")) {
    window.location.href = "login.html";
}

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

async function initApp() {
    setupEventListeners();
    applyTheme();
    renderUserProfile();
    initAI();
    await loadTasks();
}

function initAI() {
    aiChatbot = new AIChatbot();
    summarizer = new Summarizer();
}

// --- Event Listeners ---
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.sidebar-menu a').forEach(a => {
        a.addEventListener('click', (e) => {
            const viewId = e.currentTarget.id.replace('nav-', '');
            navigate(viewId);
        });
    });

    // Theme dots
    document.querySelectorAll('.theme-dot').forEach(dot => {
        dot.addEventListener('click', (e) => {
            const color = Array.from(e.currentTarget.classList).find(c => c !== 'theme-dot');
            changeTheme(color);
        });
    });

    // Dark mode toggle
    document.querySelector('.icon-btn[aria-label="Toggle Dark Mode"]')?.addEventListener('click', toggleDarkMode);
    
    // Sidebar toggle
    document.querySelector('.menu-toggle')?.addEventListener('click', toggleSidebar);

    // Profile
    document.querySelector('.user-profile')?.addEventListener('click', openProfileModal);

    // Logout
    document.querySelector('.logout-btn')?.addEventListener('click', userService.logout);

    // Task Search
    document.getElementById('searchTask')?.addEventListener('input', renderTasks);

    // View Toggles
    document.getElementById('btnListView')?.addEventListener('click', () => switchView('list'));
    document.getElementById('btnBoardView')?.addEventListener('click', () => switchView('board'));

    // Add Task
    document.querySelector('#view-tasks .btn-primary')?.addEventListener('click', addTask);

    // Export CSV
    document.querySelector('button[onclick="exportCSV()"]')?.removeAttribute('onclick'); // Cleanup
    document.querySelectorAll('button').forEach(btn => {
        if(btn.innerText.includes('Export CSV')) {
            btn.addEventListener('click', exportCSV);
        }
    });

    // Calendar navigation
    document.querySelector('.calendar-controls .icon-btn:first-child')?.addEventListener('click', prevMonth);
    document.querySelector('.calendar-controls .icon-btn:last-child')?.addEventListener('click', nextMonth);

    // Update Task (from modal)
    document.querySelector('#editModal .btn-primary')?.addEventListener('click', updateTask);

    // Profile Save
    document.querySelector('#profileModal .btn-primary')?.addEventListener('click', saveProfile);

    // Modal closes
    document.querySelectorAll('.close-modal, #editModal .btn-outline, #profileModal .btn-outline').forEach(btn => {
        btn.addEventListener('click', () => {
            closeEditModal();
            closeProfileModal();
        });
    });

    // Tab switching in settings
    document.querySelectorAll('.settings-nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const tabId = e.currentTarget.innerText.trim().toLowerCase();
            switchSettingsTab(tabId, e.currentTarget);
        });
    });

    // AI Insight click
    document.getElementById('ai-insights-panel')?.addEventListener('click', () => navigate('analytics'));

    // Recent Tasks "View All"
    document.querySelector('#view-dashboard .btn-outline')?.addEventListener('click', () => navigate('tasks'));

    // Export CSV (specific button)
    document.querySelector('#view-tasks .btn-outline')?.addEventListener('click', exportCSV);

    // Dark mode in settings
    document.querySelector('#settings-appearance .btn-outline')?.addEventListener('click', toggleDarkMode);

    // Task Actions (Event Delegation)
    document.addEventListener('click', handleTaskActions);

    // AI FAB
    document.getElementById('ai-fab')?.addEventListener('click', () => aiChatbot.toggle());
}

// --- App Logic ---

async function loadTasks() {
    const container = document.getElementById("taskContainer");
    if (state.currentView === 'list') renderTaskSkeleton(container);
    else renderBoardSkeleton(container);

    try {
        const tasks = await taskService.getAll();
        state.setTasks(Array.isArray(tasks) ? tasks : []);

        updateDashboardStats();
        renderCharts();
        renderTasks();
        renderDashboardSummary();
        updateAIInsights();
        
        if (state.currentNavView === 'calendar') renderCalendarView();

    } catch (error) {
        console.error("Error loading tasks", error);
    }
}

function updateDashboardStats() {
    const tasks = Array.isArray(state.tasks) ? state.tasks : [];
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    setElementText("totalTasks", total);
    setElementText("completedTasks", completed);
    setElementText("pendingTasks", pending);
}

function navigate(viewId) {
    state.setNavView(viewId);
    
    // Sidebar Active State
    document.querySelectorAll('.sidebar-menu a').forEach(a => a.classList.remove('active'));
    document.getElementById(`nav-${viewId}`)?.classList.add('active');

    // Show/Hide Containers
    document.querySelectorAll('.content-view').forEach(view => view.classList.add('hidden-view'));
    document.getElementById(`view-${viewId}`)?.classList.remove('hidden-view');

    // Title
    const titles = {
        'dashboard': 'Dashboard Overview',
        'tasks': 'Task Management',
        'analytics': 'Advanced Analytics',
        'calendar': 'Task Schedule',
        'ailab': 'AI Productivity Lab'
    };
    setElementText('view-title', titles[viewId]);

    // Trigger specific renders
    if (viewId === 'calendar') {
        renderCalendarView();
    } else if (viewId === 'dashboard') {
        renderDashboardSummary();
        renderCharts();
    } else if (viewId === 'analytics') {
        renderAnalyticsView();
    } else if (viewId === 'ailab') {
        renderAILabView();
    }
}

function renderTasks() {
    const container = document.getElementById("taskContainer");
    if (!container) return;
    
    let tasksToRender = [...state.tasks];
    
    // Search Filtering
    const searchInput = document.getElementById("searchTask");
    if (searchInput && searchInput.value) {
        const searchLower = searchInput.value.toLowerCase();
        tasksToRender = tasksToRender.filter(t => t.title.toLowerCase().includes(searchLower));
    }

    if (tasksToRender.length === 0) {
        container.innerHTML = `<div style="text-align: center; padding: 40px; color: var(--text-muted);">
            <i class="fa-solid fa-clipboard-list" style="font-size: 48px; opacity: 0.3; margin-bottom: 15px;"></i>
            <p>No tasks found. Time to create some!</p>
        </div>`;
        return;
    }

    if (state.currentView === 'list') {
        renderListView(container, tasksToRender);
    } else {
        renderBoardView(container, tasksToRender);
    }
}

async function handleTaskActions(e) {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;
    const id = btn.dataset.id;

    if (action === 'complete') {
        await markDone(id);
    } else if (action === 'delete') {
        await deleteTask(id);
    } else if (action === 'edit') {
        const task = state.tasks.find(t => t._id === id);
        if (task) openEditModal(task);
    }
}

async function addTask() {
    const title = document.getElementById("title").value;
    const deadline = document.getElementById("deadline").value;
    const priority = document.getElementById("priority").value;
    const category = document.getElementById("category") ? document.getElementById("category").value : "Other";

    if (!title.trim()) {
        showToast("Task title cannot be empty", "error");
        return;
    }

    const ok = await taskService.add({ title, deadline, priority, category });
    if (ok) {
        showToast("Task added!", "success");
        document.getElementById("title").value = "";
        document.getElementById("deadline").value = "";
        loadTasks();
    } else {
        showToast("Failed to add task", "error");
    }
}

async function markDone(id) {
    const ok = await taskService.update(id, { completed: true });
    if (ok) {
        showToast("Task completed!", "success");
        if (typeof confetti === 'function') {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
        loadTasks();
    }
}

async function deleteTask(id) {
    if (!confirm("Are you sure you want to delete this task?")) return;
    const ok = await taskService.delete(id);
    if (ok) {
        showToast("Task deleted", "success");
        loadTasks();
    }
}

// --- Charts & Calendar ---

function renderCharts() {
    renderPriorityChart(document.getElementById("taskChart"), state.tasks);
    renderVelocityChart(document.getElementById("velocityChart"), state.tasks);
}

function renderCalendarView() {
    renderCalendar(
        document.getElementById('calendarContainer'),
        document.getElementById('calendarMonth'),
        state.currentCalendarDate,
        state.tasks
    );
}

function prevMonth() {
    state.currentCalendarDate.setMonth(state.currentCalendarDate.getMonth() - 1);
    renderCalendarView();
}

function nextMonth() {
    state.currentCalendarDate.setMonth(state.currentCalendarDate.getMonth() + 1);
    renderCalendarView();
}

// --- Theme Logic ---

function applyTheme() {
    const savedTheme = localStorage.getItem("themeColor") || "indigo";
    document.body.classList.add(`theme-${savedTheme}`);
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }
}

function renderUserProfile() {
    const name = state.user.name || state.user.email.split('@')[0] || "User";
    setElementText("userEmail", name);
}

function changeTheme(color) {
    document.body.classList.remove('theme-indigo', 'theme-emerald', 'theme-rose', 'theme-amber');
    document.body.classList.add(`theme-${color}`);
    localStorage.setItem("themeColor", color);
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
}

function toggleSidebar() {
    toggleClass('.sidebar', 'open');
}

// --- Modals ---

function openEditModal(task) {
    document.getElementById("editTaskId").value = task._id;
    document.getElementById("editTitle").value = task.title;
    document.getElementById("editDeadline").value = task.deadline ? task.deadline.split('T')[0] : '';
    document.getElementById("editPriority").value = task.priority;
    if (document.getElementById("editCategory")) document.getElementById("editCategory").value = task.category || 'Other';
    document.getElementById("editModal").classList.add("show");
}

function closeEditModal() {
    document.getElementById("editModal").classList.remove("show");
}

function openProfileModal() {
    const name = state.user.name || state.user.email.split('@')[0] || "User";
    const email = state.user.email || "Not logged in";
    
    const nameInput = document.getElementById("profileName");
    const emailInput = document.getElementById("profileEmail");
    if (nameInput) nameInput.value = name;
    if (emailInput) emailInput.value = email;
    
    document.getElementById("profileModal").classList.add("show");
}

function closeProfileModal() {
    document.getElementById("profileModal").classList.remove("show");
}

function switchView(view) {
    state.setView(view);
    document.getElementById('btnListView').classList.toggle('active', view === 'list');
    document.getElementById('btnBoardView').classList.toggle('active', view === 'board');
    renderTasks();
}

// --- Export & AI ---

function exportCSV() {
    if (state.tasks.length === 0) {
        showToast("No tasks to export", "error");
        return;
    }
    let csvContent = "data:text/csv;charset=utf-8,Title,Deadline,Priority,Category,Status\n";
    state.tasks.forEach(t => {
        let deadline = t.deadline ? t.deadline.split('T')[0] : 'No deadline';
        let row = `"${t.title}",${deadline},${t.priority},${t.category || 'Other'},${t.completed ? 'Completed' : 'Pending'}`;
        csvContent += row + "\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "tasks_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function updateAIInsights() {
    const aiText = document.getElementById('ai-suggestion-text');
    if (!aiText) return;

    const tasks = state.tasks;
    const pendingTasks = tasks.filter(t => !t.completed);
    const overdue = pendingTasks.filter(t => t.deadline && new Date(t.deadline) < new Date());

    if (tasks.length === 0) {
        aiText.innerText = "Your schedule is clear! It's a great time to plan your next big project.";
    } else if (overdue.length > 0) {
        aiText.innerText = `Attention! You have ${overdue.length} overdue task(s). Tackle them to regain momentum.`;
    } else {
        aiText.innerText = `You're doing great! You have ${pendingTasks.length} tasks remaining. Keep up the steady pace.`;
    }
}

function renderDashboardSummary() {
    const container = document.getElementById('recentTaskContainer');
    if (!container) return;
    
    const recentTasks = [...state.tasks]
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 5);

    if (recentTasks.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:20px; color:var(--text-muted);">No recent tasks</p>';
        return;
    }

    let html = '<div class="list-view">';
    recentTasks.forEach(t => html += createTaskHTML(t));
    html += '</div>';
    container.innerHTML = html;
}

function renderAnalyticsView() {
    const stats = document.getElementById('analytics-stats');
    if (stats) {
        stats.innerHTML = document.querySelector('#view-dashboard .dashboard-grid').innerHTML;
    }
}

function renderAILabView() {
    if (summarizer) summarizer.render();
}

async function updateTask() {
    const id = document.getElementById("editTaskId").value;
    const title = document.getElementById("editTitle").value.trim();
    const deadline = document.getElementById("editDeadline").value;
    const priority = document.getElementById("editPriority").value;
    const category = document.getElementById("editCategory") ? document.getElementById("editCategory").value : "Other";

    if (!title) {
        showToast("Title cannot be empty", "error");
        return;
    }

    const ok = await taskService.update(id, { title, deadline, priority, category });
    if (ok) {
        showToast("Task updated!", "success");
        closeEditModal();
        loadTasks();
    } else {
        showToast("Failed to update task", "error");
    }
}

// Global modal functions for tab switching (needed for inline onclicks in complex modals)
window.switchSettingsTab = function(tabId, el) {
    document.querySelectorAll('.settings-nav-item').forEach(item => item.classList.remove('active'));
    el.classList.add('active');
    document.querySelectorAll('.settings-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(`settings-${tabId}`).classList.add('active');
};

window.saveProfile = function() {
    const newName = document.getElementById("profileName").value.trim();
    if (newName) {
        localStorage.setItem("profileName", newName);
        setElementText("userEmail", newName);
        showToast("Settings saved successfully!", "success");
        closeProfileModal();
    }
};

window.changeTheme = changeTheme;
window.toggleDarkMode = toggleDarkMode;
window.closeEditModal = closeEditModal;
window.closeProfileModal = closeProfileModal;
