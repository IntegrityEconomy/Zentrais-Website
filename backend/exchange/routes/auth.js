const express = require('express');
const router = express.Router();
const { signup, login, me } = require('../controllers/authController');
const { validateSignup, validateLogin } = require('../middleware/validation');
const { requireAuth } = require('../middleware/auth');

router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);
router.get('/me', requireAuth, me);

module.exports = router;
