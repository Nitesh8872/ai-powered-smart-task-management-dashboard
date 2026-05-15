export function renderCalendar(container, monthYearLabel, date, tasks) {
    if (!container || !monthYearLabel || !Array.isArray(tasks)) return;

    const year = date.getFullYear();
    const month = date.getMonth();
    
    monthYearLabel.innerText = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    let html = `
        <div class="calendar-day-header">Sun</div>
        <div class="calendar-day-header">Mon</div>
        <div class="calendar-day-header">Tue</div>
        <div class="calendar-day-header">Wed</div>
        <div class="calendar-day-header">Thu</div>
        <div class="calendar-day-header">Fri</div>
        <div class="calendar-day-header">Sat</div>
    `;

    // Padding for first week
    for (let i = 0; i < firstDay; i++) {
        html += '<div class="calendar-day other-month"></div>';
    }

    const today = new Date();
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
        
        // Find tasks for this day
        const dayTasks = tasks.filter(t => t.deadline && t.deadline.startsWith(dateStr));
        
        html += `
            <div class="calendar-day ${isToday ? 'today' : ''}">
                <span class="day-number">${day}</span>
                <div class="calendar-tasks">
                    ${dayTasks.map(t => `
                        <div class="calendar-task-item cal-${t.priority}" title="${t.title}">
                            ${t.title}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    container.innerHTML = html;
}
