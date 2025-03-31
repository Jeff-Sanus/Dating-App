// src/controllers/authController.js
const User = require('../models/user');

// POST /auth/signup
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Validate input (e.g., check if email is already used)
    // Create and save the user in the database
    const newUser = new User({ username, email, password });
    await newUser.save();

    // Optionally create a token (JWT) for the user
    // const token = ...

    return res.status(201).json({
      message: 'Signup successful',
      // token, // if you generated a JWT
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Server error during signup' });
  }
};

// GET /auth/profile
exports.getProfile = async (req, res) => {
  try {
    // If using JWT, you'd extract the user ID from the token (e.g., req.user.id)
    // For now, assume a user ID is in req.user
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
