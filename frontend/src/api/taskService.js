import { fetchWithAuth } from './apiClient.js';
import { apiUrl } from '../config.js';

export const taskService = {
    getAll: async () => {
        const res = await fetchWithAuth(apiUrl("/tasks"));
        if (!res.ok) throw new Error("Failed to fetch tasks");
        const json = await res.json();
        return json.data || [];
    },

    add: async (taskData) => {
        const res = await fetchWithAuth(apiUrl("/tasks/add"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(taskData)
        });
        return res.ok;
    },

    update: async (id, taskData) => {
        const res = await fetchWithAuth(apiUrl(`/tasks/${id}`), {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(taskData)
        });
        return res.ok;
    },

    delete: async (id) => {
        const res = await fetchWithAuth(apiUrl(`/tasks/${id}`), {
            method: "DELETE"
        });
        return res.ok;
    }
};
