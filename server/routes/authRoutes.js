
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

const requireAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Please log in again." });
    try {
        req.userId = jwt.verify(token, process.env.JWT_SECRET).userId;
        next();
    } catch {
        return res.status(401).json({ message: "Your session has expired. Please log in again." });
    }
};

const createToken = (userId) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is missing from the server environment");
    }

    return jwt.sign(
        { userId: userId.toString() },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

// REGISTER
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string" ||
            !name.trim() ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: "Name, email and password are required."
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters."
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                message: "An account with this email already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword
        });

        const token = createToken(user._id);

        return res.status(201).json({
            message: "Account created successfully.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profileImage: user.profileImage || ""
            }
        });
    } catch (error) {
        console.error("Registration error:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: "An account with this email already exists."
            });
        }

        return res.status(500).json({
            message: "Failed to create account."
        });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: "Email and password are required."
            });
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase()
        }).select("+password");

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const passwordMatches = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatches) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const token = createToken(user._id);

        return res.json({
            message: "Login successful.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profileImage: user.profileImage || ""
            }
        });
    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Failed to log in."
        });
    }
});


// UPDATE PROFILE PICTURE
router.put("/profile", requireAuth, async (req, res) => {
    try {
        const { profileImage } = req.body;
        if (typeof profileImage !== "string") {
            return res.status(400).json({ message: "A valid profile image is required." });
        }
        if (profileImage && !/^data:image\/(jpeg|png|webp|gif);base64,/.test(profileImage)) {
            return res.status(400).json({ message: "Please upload a supported image file." });
        }
        if (profileImage.length > 2_100_000) {
            return res.status(413).json({ message: "The image is too large. Choose an image smaller than 1.5 MB." });
        }
        const user = await User.findByIdAndUpdate(
            req.userId,
            { profileImage },
            { new: true, runValidators: true }
        ).select("name email profileImage");
        if (!user) return res.status(404).json({ message: "User not found." });
        return res.json({ message: "Profile updated.", user: { id: user._id, name: user.name, email: user.email, profileImage: user.profileImage || "" } });
    } catch (error) {
        console.error("Profile update error:", error);
        return res.status(500).json({ message: "Failed to update profile." });
    }
});

// CHANGE PASSWORD
router.put("/change-password", requireAuth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (typeof currentPassword !== "string" || typeof newPassword !== "string" || !currentPassword || !newPassword) {
            return res.status(400).json({ message: "Enter your current password and a new password." });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ message: "The new password must be at least 6 characters." });
        }
        const user = await User.findById(req.userId).select("+password");
        if (!user) return res.status(404).json({ message: "User not found." });
        if (!(await bcrypt.compare(currentPassword, user.password))) {
            return res.status(400).json({ message: "Your current password is incorrect." });
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        return res.json({ message: "Password changed successfully." });
    } catch (error) {
        console.error("Password change error:", error);
        return res.status(500).json({ message: "Failed to change password." });
    }
});

module.exports = router;
