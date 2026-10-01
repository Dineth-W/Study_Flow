const express = require("express");
const Event = require("../models/Event");

const router = express.Router();


// =============================
// GET ALL EVENTS
// =============================

router.get("/", async (req, res) => {

    try {

        const events = await Event
            .find()
            .sort({ date: 1, startTime: 1 });

        res.json(events);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch events"
        });

    }

});


// =============================
// CREATE EVENT
// =============================

router.post("/", async (req, res) => {

    try {

        const event = new Event(req.body);

        const savedEvent = await event.save();

        res.status(201).json(savedEvent);

    } catch (error) {

        console.error(error);

        res.status(400).json({
            message: "Failed to create event",
            error: error.message
        });

    }

});


// =============================
// DELETE EVENT
// =============================

router.delete("/:id", async (req, res) => {

    try {

        const deletedEvent = await Event.findByIdAndDelete(
            req.params.id
        );

        if (!deletedEvent) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        res.json({
            message: "Event deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to delete event"
        });

    }

});


module.exports = router;