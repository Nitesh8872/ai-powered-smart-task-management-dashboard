import { createTaskHTML } from './TaskCard.js';

export function renderListView(container, tasks) {
    if (!container) return;
    
    tasks.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed - b.completed;
        const p = { High: 1, Medium: 2, Low: 3 };
        return p[a.priority] - p[b.priority];
    });

    let html = `<div class="list-view">`;
    tasks.forEach(t => html += createTaskHTML(t));
    html += `</div>`;
    container.innerHTML = html;
}

export function renderBoardView(container, tasks) {
    if (!container) return;
    
    let pendingTasks = tasks.filter(t => !t.completed);
    let completedTasks = tasks.filter(t => t.completed);

    container.innerHTML = `
        <div class="kanban-board" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div class="kanban-column kanban-col-todo">
                <div class="kanban-header">
                    <span>To Do</span>
                    <span class="badge" style="background:var(--warning-light); color:var(--warning)">${pendingTasks.length}</span>
                </div>
                <div class="kanban-cards">
                    ${pendingTasks.map(t => createTaskHTML(t)).join('')}
                </div>
            </div>
            <div class="kanban-column kanban-col-done">
                <div class="kanban-header">
                    <span>Done</span>
                    <span class="badge" style="background:var(--success-light); color:var(--success)">${completedTasks.length}</span>
                </div>
                <div class="kanban-cards">
                    ${completedTasks.map(t => createTaskHTML(t)).join('')}
                </div>
            </div>
        </div>
    `;
}
