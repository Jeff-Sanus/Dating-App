// src/routes/authRoutes.js
const express = require('express');
const router  = express.Router();
const authController = require('../controllers/authController');
const { protect }    = require('../middleware/authMiddleware');

router.post('/signup', authController.signup);
router.post('/login',  authController.login);         // ← new!
router.get('/default', authController.defaultAccount);
router.get('/profile', protect, authController.getProfile);
router.put('/profile', protect, authController.updateProfile);

module.exports = router;