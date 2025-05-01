// src/controllers/authController.js
const User   = require('../models/user');
const jwt    = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// POST /auth/signup
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (await User.findOne({ email })) {
      return res.status(400).json({ error: 'Email already registered.' });
    }
    const newUser = new User({ username, email, password });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ message: 'Signup successful', token });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error during signup' });
  }
};

// POST /auth/login
exports.login = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.username !== username) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
};

// GET /auth/default
exports.defaultAccount = async (req, res) => {
  // ... your existing defaultAccount logic ...
};

// GET /auth/profile
exports.getProfile = async (req, res) => {
  // ... existing getProfile logic ...
};

// PUT /auth/profile
exports.updateProfile = async (req, res) => {
  // ... existing updateProfile logic ...
};