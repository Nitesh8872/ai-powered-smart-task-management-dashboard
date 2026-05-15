export function renderTaskSkeleton(container, count = 3) {
    if (!container) return;
    
    let html = '<div class="list-view">';
    for (let i = 0; i < count; i++) {
        html += `
            <div class="task-card glass skeleton" style="height: 100px; margin-bottom: 12px; border: none; opacity: 0.5;"></div>
        `;
    }
    html += '</div>';
    container.innerHTML = html;
}

export function renderBoardSkeleton(container) {
    if (!container) return;
    
    container.innerHTML = `
        <div class="kanban-board" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div class="kanban-column">
                <div class="skeleton" style="height: 40px; margin-bottom: 15px; border-radius: 12px;"></div>
                <div class="skeleton" style="height: 120px; margin-bottom: 12px; border-radius: 20px;"></div>
                <div class="skeleton" style="height: 120px; border-radius: 20px;"></div>
            </div>
            <div class="kanban-column">
                <div class="skeleton" style="height: 40px; margin-bottom: 15px; border-radius: 12px;"></div>
                <div class="skeleton" style="height: 120px; border-radius: 20px;"></div>
            </div>
        </div>
    `;
}
