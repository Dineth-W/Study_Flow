const express = require("express");
const mongoose = require("mongoose");
const Task = require("../models/Task");

const router = express.Router();
const updateRequestTracker = new Map();
const UPDATE_WINDOW_MS = 60 * 1000;
const UPDATE_MAX_REQUESTS = 60;

const limitTaskUpdates = (req, res, next) => {

    const requestKey = req.ip || "unknown";
    const now = Date.now();

    const existingRecord = updateRequestTracker.get(requestKey);

    if (!existingRecord || now - existingRecord.windowStart >= UPDATE_WINDOW_MS) {
        updateRequestTracker.set(requestKey, {
            count: 1,
            windowStart: now
        });
        return next();
    }

    if (existingRecord.count >= UPDATE_MAX_REQUESTS) {
        return res.status(429).json({
            message: "Too many update requests. Please try again later."
        });
    }

    existingRecord.count += 1;
    updateRequestTracker.set(requestKey, existingRecord);
    next();

};


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

router.put("/:id", limitTaskUpdates, async (req, res) => {

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