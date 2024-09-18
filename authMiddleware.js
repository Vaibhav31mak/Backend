const jwt = require('jsonwebtoken');
const User = require('./Models/User');
require('dotenv').config(); // To use environment variables for JWT secret

// Middleware to verify if the user is authenticated and an admin
const verifyAdmin = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifies the JWT token
        const user = await User.findOne({ _id: decoded._id });

        if (!user) {
            throw new Error('Authentication failed');
        }

        // Check if the user has an admin role
        if (user.isAdmin !==  true) {
            return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
        }

        req.user = user; // Attach the user object to the request
        next(); // Proceed to the next middleware or controller function
    } catch (error) {
        res.status(401).json({ error: 'Not authorized' });
    }
};

// Middleware to verify if the user is authenticated
const verifyUser = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id });

        if (!user) {
            throw new Error('Authentication failed');
        }

        req.user = user; // Attach the user object to the request
        next(); // Proceed to the next middleware or controller function
    } catch (error) {
        res.status(401).json({ error: 'Not authorized' });
    }
};

const verifySelfOrAdmin = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id });

        if (!user) {
            throw new Error('Authentication failed');
        }

        // Check if the user is either deleting their own account or is an admin
        if (user._id.toString() === req.params.id || user.role === 'admin') {
            req.user = user; // Attach the user object to the request
            next(); // Allow the request to proceed
        } else {
            return res.status(403).json({ error: 'Access denied. You can only delete your own account or be an admin.' });
        }
    } catch (error) {
        res.status(401).json({ error: 'Not authorized' });
    }
};


module.exports = { verifyAdmin, verifyUser, verifySelfOrAdmin };
