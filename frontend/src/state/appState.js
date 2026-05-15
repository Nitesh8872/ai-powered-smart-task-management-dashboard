// Central application state
export const state = {
    tasks: [],
    currentView: 'list', // 'list' or 'board'
    currentNavView: 'dashboard',
    currentCalendarDate: new Date(),
    user: {
        name: localStorage.getItem("profileName") || '',
        email: localStorage.getItem("email") || ''
    },

    setTasks(tasks) {
        this.tasks = tasks;
    },

    setNavView(view) {
        this.currentNavView = view;
    },

    setView(view) {
        this.currentView = view;
    }
};
