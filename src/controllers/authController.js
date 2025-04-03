// src/controllers/authController.js
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// POST /auth/signup
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered.' });
    }
    
    // Create a new user and save it to the database
    const newUser = new User({ username, email, password });
    await newUser.save();
    
    // Generate a token (ensure you have JWT_SECRET in your .env file)
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    return res.status(201).json({
      message: 'Signup successful',
      token,
    });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      return res.status(400).json({ error: 'Email is already registered.' });
    }
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Server error during signup' });
  }
};

// GET /auth/profile
exports.getProfile = async (req, res) => {
  try {
    // Assuming a middleware populates req.user with the authenticated user's info
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password'); // exclude password
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ error: 'Server error fetching profile' });
  }
};

// PUT /auth/profile
exports.updateProfile = async (req, res) => {
  try {
    // Assuming req.user contains the authenticated user's ID
    const userId = req.user.id;
    const { username, email, profilePic } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email, profilePic },
      { new: true } // return the updated user
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ error: 'Server error updating profile' });
  }
};

// GET /auth/default
exports.defaultAccount = async (req, res) => {
  try {
    // Check for a default user by a fixed email
    let user = await User.findOne({ email: 'default@datingapp.com' });
    if (!user) {
      // Create the default user if it doesn't exist
      user = new User({
        username: 'defaultUser',
        email: 'default@datingapp.com',
        password: 'password123', // In production, ensure to hash passwords!
      });
      await user.save();
    }
    // Generate a JWT token for the user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // Return user data without password
    res.json({
      message: 'Default user logged in successfully',
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic || ''
      }
    });
  } catch (error) {
    console.error('Default account error:', error);
    res.status(500).json({ error: 'Server error logging in default account' });
  }
};