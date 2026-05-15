const taskService = require("../services/taskService");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Add task
// @route   POST /api/tasks/add
// @access  Private
const addTask = asyncHandler(async (req, res) => {
    const task = await taskService.createTask(req.user.id, req.body);
    res.status(201).json({
        success: true,
        data: task
    });
});

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
    const pagination = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 50
    };
    const tasks = await taskService.getAllTasks(req.user, pagination);
    res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks
    });
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = asyncHandler(async (req, res) => {
    const task = await taskService.getTaskById(req.user.id, req.params.id);
    res.status(200).json({
        success: true,
        data: task
    });
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
    const task = await taskService.updateTask(req.user.id, req.params.id, req.body);
    res.status(200).json({
        success: true,
        data: task
    });
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
    const result = await taskService.deleteTask(req.user.id, req.params.id);
    res.status(200).json({
        success: true,
        message: result.message
    });
});

module.exports = {
    addTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask
};
