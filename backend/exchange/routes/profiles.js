const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { validateProfileUpdate } = require('../middleware/validation');
const {
  getMyProfile,
  updateMyProfile,
  getPublicProfile,
} = require('../controllers/profileController');

router.get('/me', requireAuth, getMyProfile);
router.put('/me', requireAuth, validateProfileUpdate, updateMyProfile);
router.get('/:userId', getPublicProfile);

module.exports = router;
