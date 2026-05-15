const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");

// All routes here are protected
router.use(authMiddleware);

// ➜ CREATE TASK
router.post("/add", taskController.addTask);

// ➜ GET ALL TASKS
router.get("/", taskController.getTasks);

// ➜ GET TASK BY ID
router.get("/:id", taskController.getTaskById);

// ➜ UPDATE TASK
router.put("/:id", taskController.updateTask);

// ➜ DELETE TASK
router.delete("/:id", taskController.deleteTask);

module.exports = router;