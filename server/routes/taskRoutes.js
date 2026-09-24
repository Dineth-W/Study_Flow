const express = require("express");
const Task = require("../models/Task");

const router = express.Router();


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