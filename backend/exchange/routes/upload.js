const express = require('express');
const router = express.Router();
const multer = require('multer');
const { requireAuth } = require('../middleware/auth');
const { uploadAvatar, uploadListingImage } = require('../utils/s3');

// Configure multer for memory storage (files stored in buffer)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: (req, file, cb) => {
    // Only allow images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

/**
 * POST /upload/avatar
 * Upload a profile avatar
 * Requires authentication
 */
router.post('/avatar', requireAuth, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const result = await uploadAvatar(req.file, req.user.user_id);
    res.json(result);
  } catch (err) {
    console.error('Avatar upload error:', err);
    next(err);
  }
});

/**
 * POST /upload/listing
 * POST /upload/listing/:listingId
 * Upload a listing image
 * Requires authentication
 * listingId is optional (defaults to 'new')
 */
router.post('/listing', requireAuth, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const listingId = req.body.listingId || 'new';
    const result = await uploadListingImage(req.file, req.user.user_id, listingId);
    res.json(result);
  } catch (err) {
    console.error('Listing image upload error:', err);
    next(err);
  }
});

router.post('/listing/:listingId', requireAuth, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const listingId = req.params.listingId || 'new';
    const result = await uploadListingImage(req.file, req.user.user_id, listingId);
    res.json(result);
  } catch (err) {
    console.error('Listing image upload error:', err);
    next(err);
  }
});

/**
 * POST /upload/listings
 * Upload multiple listing images (up to 10)
 * Requires authentication
 */
router.post('/listings', requireAuth, upload.array('files', 10), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }

    const listingId = req.body.listingId || 'new';
    const results = await Promise.all(
      req.files.map(file => uploadListingImage(file, req.user.user_id, listingId))
    );
    
    res.json({ uploads: results });
  } catch (err) {
    console.error('Listing images upload error:', err);
    next(err);
  }
});

module.exports = router;
