const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes");
const taskRoutes = require("./taskRoutes");
const aiRoutes = require("./aiRoutes");

router.use("/users", userRoutes);
router.use("/tasks", taskRoutes);
router.use("/ai", aiRoutes);

module.exports = router;
