const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const {verifyUser , verifyAdmin, verifySelfOrAdmin} = require('../authMiddleware');

// Define routes
router.post('/', userController.createUser);              // Create a new user
router.get('/', verifyAdmin,userController.getUsers);                // Get all users
router.get('/:id', verifyAdmin,userController.getUserById);          // Get a user by ID
router.put('/:id',verifyUser,userController.updateUser);           // Update a user by ID
router.delete('/:id',verifySelfOrAdmin,userController.deleteUser);        // Delete a user by ID
router.post('/login', userController.loginUser);
// Login user
// Export the router
module.exports = router;
