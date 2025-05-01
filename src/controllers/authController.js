const User = require('../models/user');
const jwt  = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// POST /auth/signup
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if a user with this email already exists
    if (await User.findOne({ email })) {
      return res.status(400).json({ error: 'Email is already registered.' });
    }

    // Create and save user (password gets hashed by pre-save hook)
    const newUser = new User({ username, email, password });
    await newUser.save();

    // Issue JWT
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ message: 'Signup successful', token });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error during signup' });
  }
};

// POST /auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare password
    if (!(await user.matchPassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Issue JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

// GET /auth/default
exports.defaultAccount = async (req, res) => {
  try {
    let user = await User.findOne({ email: 'default@datingapp.com' });
    if (!user) {
      user = new User({
        username: 'defaultUser',
        email: 'default@datingapp.com',
        password: 'password123',
      });
      await user.save();
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.json({
      message: 'Default user logged in successfully',
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic || '',
        bio: user.bio || '',
      },
    });
  } catch (error) {
    console.error('Default account error:', error);
    res.status(500).json({ error: 'Server error logging in default account' });
  }
};

// GET /auth/profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select(
      'username email profilePic bio'
    );
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error fetching profile' });
  }
};

// PUT /auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, email, profilePic, bio } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email, profilePic, bio },
      { new: true }
    ).select('username email profilePic bio');

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error updating profile' });
  }
};