const express = require("express");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");
const Task = require("../models/Task");

const router = express.Router();

const updateTaskLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many update requests. Please try again later."
    }
});


// =============================
// GET ALL TASKS
// =============================

router.get("/", async (req, res) => {

    try {

        const tasks = await Task
            .find()
            .sort({ dueDate: 1 });

        res.json(tasks);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch tasks"
        });

    }

});


// =============================
// CREATE TASK
// =============================

router.post("/", async (req, res) => {

    try {

        const task = new Task(req.body);

        const savedTask = await task.save();

        res.status(201).json(savedTask);

    } catch (error) {

        console.error(error);

        res.status(400).json({
            message: "Failed to create task",
            error: error.message
        });

    }

});


// =============================
// UPDATE TASK
// =============================

router.put("/:id", updateTaskLimiter, async (req, res) => {

    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid task ID"
            });
        }

        const allowedFields = [
            "title",
            "description",
            "subject",
            "dueDate",
            "priority",
            "completed"
        ];

        const updateData = {};

        allowedFields.forEach((field) => {
            if (Object.prototype.hasOwnProperty.call(req.body, field)) {
                updateData[field] = req.body[field];
            }
        });

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                message: "No valid fields provided for update"
            });
        }

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        Object.keys(updateData).forEach((field) => {
            task[field] = updateData[field];
        });

        const updatedTask = await task.save();

        res.json(updatedTask);

    } catch (error) {

        console.error(error);

        res.status(400).json({
            message: "Failed to update task",
            error: error.message
        });

    }

});


// =============================
// DELETE TASK
// =============================

router.delete("/:id", async (req, res) => {

    try {

        await Task.findByIdAndDelete(req.params.id);

        res.json({
            message: "Task deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to delete task"
        });

    }

});


module.exports = router;