const Task = require("../models/task");
const ErrorResponse = require("../utils/ErrorResponse");

const createTask = async (userId, taskData) => {
    const task = new Task({
        userId,
        ...taskData
    });
    await task.save();
    return task;
};

const getAllTasks = async (user, pagination) => {
    const { page = 1, limit = 50 } = pagination;
    const skip = (page - 1) * limit;

    let query = {};
    if (user.role !== "admin") {
        query.userId = user.id;
    }

    const tasks = await Task.find(query).skip(skip).limit(limit);
    return tasks;
};

const getTaskById = async (userId, taskId) => {
    const task = await Task.findOne({
        _id: taskId,
        userId: userId
    });
    if (!task) {
        throw new ErrorResponse("Task not found or not authorized", 404);
    }
    return task;
};

const updateTask = async (userId, taskId, updateData) => {
    const task = await Task.findOneAndUpdate(
        {
            _id: taskId,
            userId: userId
        },
        updateData,
        { new: true, runValidators: true }
    );
    if (!task) {
        throw new ErrorResponse("Task not found or not authorized", 404);
    }
    return task;
};

const deleteTask = async (userId, taskId) => {
    const task = await Task.findOneAndDelete({
        _id: taskId,
        userId: userId
    });
    if (!task) {
        throw new ErrorResponse("Task not found or not authorized", 404);
    }
    return { message: "Task deleted successfully" };
};

module.exports = {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask
};
