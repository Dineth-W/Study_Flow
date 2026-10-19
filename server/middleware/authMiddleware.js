
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Authentication required. Please log in."
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Support the user ID field used in the JWT payload.
        const userId = decoded.userId || decoded.id || decoded._id;

        if (!userId) {
            return res.status(401).json({
                message: "Invalid authentication token."
            });
        }

        req.userId = userId;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token. Please log in again."
        });
    }
};

module.exports = authMiddleware;
