const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const createUser = async (req, res) => {
    try {
      // Create a user instance without userId
      const user = new User(req.body);
  
      // Calculate the new userId
      let nuserId = 1;  // Default to 1 if there are no existing users
  
      if (await User.countDocuments() > 0) {
        const lastUser = await User.findOne().sort('-userId').select('userId');
        nuserId = lastUser.userId + 1;
      }
  
      // Assign the calculated userId to the user instance
      user.userId = nuserId;
  
      // Save the user
      await user.save();
  
      // Respond with the newly created user
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };  

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
    try {
      const user = await User.findOne({ userId: req.params.id });
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

  const updateUser = async (req, res) => {
    try {
      // Extract userId from request parameters
      const { id } = req.params;
      // Find user by userId and update
      const user = await User.findOneAndUpdate({ userId: id }, req.body, { new: true, runValidators: true });
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  

  const deleteUser = async (req, res) => {
    try {
      // Extract userId from request parameters
      const { id } = req.params;
      // Find user by userId and delete
      const user = await User.findOneAndDelete({ userId: id });
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


  const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Find user by email
      const user = await User.findOne({ email });
  
      // Check if user exists and if the password matches
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
  
      // Generate JWT token with user ID and role
      const token = jwt.sign(
        { _id: user._id, role: user.role }, // Include user role in the token
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Token expires in 1 hour
      );
  
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
};
