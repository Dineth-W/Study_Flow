
const express = require("express");
const router = express.Router();

const Event = require("../models/Event");
const authMiddleware = require("../middleware/authMiddleware");

// Every event request must be authenticated.
router.use(authMiddleware);

// GET: return only this user's calendar events
router.get("/", async (req, res) => {
    try {
        const events = await Event.find({
            userId: req.userId
        }).sort({ date: 1, startTime: 1 });

        res.json(events);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch events."
        });
    }
});

// POST: create an event owned by the logged-in user
router.post("/", async (req, res) => {
    try {
        const event = await Event.create({
            title: req.body.title,
            subject: req.body.subject,
            date: req.body.date,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            location: req.body.location,
            type: req.body.type,
            userId: req.userId
        });

        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({
            message: error.message || "Failed to create event."
        });
    }
});

// PUT: update only an event owned by this user
router.put("/:id", async (req, res) => {
    try {
        const allowedFields = [
            "title",
            "subject",
            "date",
            "startTime",
            "endTime",
            "location",
            "type"
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        const event = await Event.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.userId
            },
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!event) {
            return res.status(404).json({
                message: "Event not found."
            });
        }

        res.json(event);
    } catch (error) {
        res.status(400).json({
            message: error.message || "Failed to update event."
        });
    }
});

// DELETE: delete only an event owned by this user
router.delete("/:id", async (req, res) => {
    try {
        const event = await Event.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });

        if (!event) {
            return res.status(404).json({
                message: "Event not found."
            });
        }

        res.json({ message: "Event deleted successfully." });
    } catch (error) {
        res.status(400).json({
            message: "Failed to delete event."
        });
    }
});

module.exports = router;
