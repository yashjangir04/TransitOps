const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const authController = require('../controllers/authController');

router.get('/me', authController.getMe);
router.post('/login', authController.loginUser);
module.exports = router;