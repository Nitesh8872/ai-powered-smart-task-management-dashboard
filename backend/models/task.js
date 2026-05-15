const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    deadline: {
        type: Date
    },
    priority: {
        type: String,
        enum: ["High", "Medium", "Low"],
        default: "Medium"
    },
    completed: {
        type: Boolean,
        default: false
    },
    category: {
        type: String,
        default: "Other"
    }
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);