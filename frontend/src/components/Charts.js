export function renderPriorityChart(ctx, tasks) {
    if (!ctx || !Array.isArray(tasks)) return;
    if (window.myPriorityChart) window.myPriorityChart.destroy();
    
    let high = tasks.filter(t => t.priority === 'High' && !t.completed).length;
    let med = tasks.filter(t => t.priority === 'Medium' && !t.completed).length;
    let low = tasks.filter(t => t.priority === 'Low' && !t.completed).length;

    window.myPriorityChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["High", "Medium", "Low"],
            datasets: [{
                data: [high, med, low],
                backgroundColor: ["#ef4444", "#f59e0b", "#10b981"],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } },
            cutout: '75%'
        }
    });
}

export function renderVelocityChart(ctx, tasks) {
    if (!ctx || !Array.isArray(tasks)) return;
    if (window.myVelocityChart) window.myVelocityChart.destroy();
    
    let completedCount = tasks.filter(t => t.completed).length;
    let velocityData = [0, 0, 0, 0, 0, 0, completedCount]; 
    
    window.myVelocityChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [{
                label: 'Tasks Completed',
                data: velocityData,
                backgroundColor: "#6366f1",
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, grid: { display: false } },
                x: { grid: { display: false } }
            },
            plugins: { legend: { display: false } }
        }
    });
}
