const prisma = require('../config/prisma');

// Private: current user's profile
exports.getMyProfile = async (req, res, next) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { user_id: req.user.user_id },
      include: {
        user: {
          select: { id: true, username: true },
        },
      },
    });
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    res.json({
      ...profile,
      profile_id: profile.id,
      User: profile.user ? { user_id: profile.user.id, username: profile.user.username } : null,
    });
  } catch (err) {
    next(err);
  }
};

// Private: update own profile (incl. location)
exports.updateMyProfile = async (req, res, next) => {
  try {
    const { display_name, bio, avatar_url, location_city, location_country, location_lat, location_lng } = req.body;

    const profile = await prisma.profile.findUnique({ where: { user_id: req.user.user_id } });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const updated = await prisma.profile.update({
      where: { user_id: req.user.user_id },
      data: {
        display_name: display_name ?? profile.display_name,
        bio: bio ?? profile.bio,
        avatar_url: avatar_url ?? profile.avatar_url,
        location_city: location_city ?? profile.location_city,
        location_country: location_country ?? profile.location_country,
        location_lat: location_lat ?? profile.location_lat,
        location_lng: location_lng ?? profile.location_lng,
      },
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// Public profile view by user id (limited fields)
exports.getPublicProfile = async (req, res, next) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { user_id: req.params.userId },
      select: {
        display_name: true,
        avatar_url: true,
        location_city: true,
        location_country: true,
        user: {
          select: { id: true, username: true },
        },
      },
    });
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    res.json({
      ...profile,
      User: profile.user ? { user_id: profile.user.id, username: profile.user.username } : null,
    });
  } catch (err) {
    next(err);
  }
};
