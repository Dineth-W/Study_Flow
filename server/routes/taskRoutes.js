
const express = require("express");
const router = express.Router();

const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

// Every task request must be authenticated.
router.use(authMiddleware);

// GET: return only this user's tasks
router.get("/", async (req, res) => {
    try {
        const tasks = await Task.find({
            userId: req.userId
        }).sort({ createdAt: -1 });

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch tasks." });
    }
});

// POST: create a task owned by the logged-in user
router.post("/", async (req, res) => {
    try {
        const task = await Task.create({
            title: req.body.title,
            description: req.body.description,
            subject: req.body.subject,
            dueDate: req.body.dueDate,
            priority: req.body.priority,
            completed: req.body.completed ?? false,
            userId: req.userId
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({
            message: error.message || "Failed to create task."
        });
    }
});

// PUT: update only a task owned by this user
router.put("/:id", async (req, res) => {
    try {
        const allowedFields = [
            "title",
            "description",
            "subject",
            "dueDate",
            "priority",
            "completed"
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        const task = await Task.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.userId
            },
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found."
            });
        }

        res.json(task);
    } catch (error) {
        res.status(400).json({
            message: error.message || "Failed to update task."
        });
    }
});

// DELETE: delete only a task owned by this user
router.delete("/:id", async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found."
            });
        }

        res.json({ message: "Task deleted successfully." });
    } catch (error) {
        res.status(400).json({ message: "Failed to delete task." });
    }
});

module.exports = router;
