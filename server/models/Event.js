const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        
        title: {
            type: String,
            required: true
        },

        subject: {
            type: String,
            default: ""
        },

        date: {
            type: Date,
            required: true
        },

        startTime: {
            type: String,
            required: true
        },

        endTime: {
            type: String,
            required: true
        },

        location: {
            type: String,
            default: ""
        },

        type: {
            type: String,
            default: "Other"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Event", eventSchema);