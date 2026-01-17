const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const prisma = require('../config/prisma');

exports.signup = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const emailHash = crypto.createHash('sha256').update(email.toLowerCase()).digest('hex');

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        email_hash: emailHash,
        profile: {
          create: {
            display_name: username,
          },
        },
      },
      include: { profile: true },
    });

    const token = jwt.sign(
      { user_id: user.id, role: user.role },
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

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { user_id: user.id, role: user.role },
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
    const user = await prisma.user.findUnique({
      where: { id: req.user.user_id },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        account_status: true,
        profile: {
          select: {
            id: true,
            display_name: true,
            bio: true,
            avatar_url: true,
            location_city: true,
            location_country: true,
            location_lat: true,
            location_lng: true,
          },
        },
      },
    });
    
    // Map id to user_id for backwards compatibility
    res.json({
      user_id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      account_status: user.account_status,
      Profile: user.profile ? {
        profile_id: user.profile.id,
        display_name: user.profile.display_name,
        bio: user.profile.bio,
        avatar_url: user.profile.avatar_url,
        location_city: user.profile.location_city,
        location_country: user.profile.location_country,
        location_lat: user.profile.location_lat,
        location_lng: user.profile.location_lng,
      } : null,
    });
  } catch (err) {
    next(err);
  }
};
