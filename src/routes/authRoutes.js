// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Sign up
router.post('/signup', authController.signup);

// Get profile
router.get('/profile', authController.getProfile);

// Update profile
router.put('/profile', authController.updateProfile);

module.exports = router;