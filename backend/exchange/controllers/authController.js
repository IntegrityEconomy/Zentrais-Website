const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Profile = require('../models/Profile');

exports.signup = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, username, password_hash });

    // create empty profile
    await Profile.create({ user_id: user.user_id, display_name: username });

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
    );

    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
    );

    res.json({ token });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.user_id, {
      attributes: ['user_id', 'email', 'username', 'role', 'account_status'],
      include: {
        model: Profile,
        attributes: [
          'profile_id',
          'display_name',
          'bio',
          'avatar_url',
          'location_city',
          'location_country',
          'location_lat',
          'location_lng',
        ],
      },
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
};
