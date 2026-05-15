export function createTaskHTML(task) {
    let deadlineDate = task.deadline ? task.deadline.split('T')[0] : 'No deadline';
    const isCompleted = task.completed;
    
    // Note: We use global functions for now to keep it simple, but in a full refactor 
    // we would attach listeners after rendering. 
    // For this migration, we'll keep the onclicks but they must refer to exported functions.
    // However, since it's a module, we can't easily use inline onclicks for non-global functions.
    // BETTER APPROACH: Add data attributes and use event delegation or post-render attachment.
    
    return `
        <div class="task-card priority-${task.priority}" draggable="true" data-id="${task._id}" id="task-${task._id}">
            <div class="task-card-body">
                <div>
                    <div class="task-card-title" style="${isCompleted ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${task.title}</div>
                    <div class="task-card-meta">
                        <span class="badge badge-category">${task.category || 'Other'}</span>
                        <span><i class="fa-regular fa-clock"></i> ${deadlineDate}</span>
                    </div>
                </div>
            </div>
            <div class="task-card-actions">
                ${!isCompleted ? `<button class="action-icon done" data-action="complete" data-id="${task._id}" title="Complete"><i class="fa-solid fa-check"></i></button>` : ''}
                <button class="action-icon" data-action="edit" data-id="${task._id}" title="Edit"><i class="fa-solid fa-pen"></i></button>
                <button class="action-icon delete" data-action="delete" data-id="${task._id}" title="Delete"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>
    `;
}
