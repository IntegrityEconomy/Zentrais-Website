const { body, validationResult } = require('express-validator');

const validateSignup = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('username').notEmpty().withMessage('Username is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateProfileUpdate = [
  body('display_name').optional().isString(),
  body('bio').optional().isString(),
  body('avatar_url').optional({ values: 'falsy' }).isURL().withMessage('Avatar URL must be a valid URL'),
  body('location_city').optional().isString(),
  body('location_country').optional().isString(),
  body('location_lat').optional({ values: 'falsy' }).isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
  body('location_lng').optional({ values: 'falsy' }).isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateSignup, validateLogin, validateProfileUpdate };
