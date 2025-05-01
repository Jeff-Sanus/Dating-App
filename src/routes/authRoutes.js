const express = require('express');
const router  = express.Router();
const authController = require('../controllers/authController');
const { protect }    = require('../middleware/authMiddleware');

// Public routes
router.post('/signup', authController.signup);
router.post('/login',  authController.login);
router.get('/default', authController.defaultAccount);

// Protected routes
router.get('/profile', protect, authController.getProfile);
router.put('/profile', protect, authController.updateProfile);

module.exports = router;
