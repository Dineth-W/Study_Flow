const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const taskRoutes = require("./routes/taskRoutes");

const app = express();


// Middleware
app.use(cors());
app.use(express.json());


// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.error("MongoDB connection error:");
        console.error(error.message);
    });


// Home route
app.get("/", (req, res) => {
    res.json({
        message: "StudyFlow API is running"
    });
});


// Task routes
app.use("/api/tasks", taskRoutes);


// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});