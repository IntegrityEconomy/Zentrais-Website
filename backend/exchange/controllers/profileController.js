const Profile = require('../models/Profile');
const User = require('../models/User');

// Private: current user's profile
exports.getMyProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({
      where: { user_id: req.user.user_id },
      include: {
        model: User,
        attributes: ['user_id', 'username'],
      },
    });
    res.json(profile);
  } catch (err) {
    next(err);
  }
};

// Private: update own profile (incl. location)
exports.updateMyProfile = async (req, res, next) => {
  try {
    const { display_name, bio, avatar_url, location_city, location_country, location_lat, location_lng } = req.body;

    const profile = await Profile.findOne({ where: { user_id: req.user.user_id } });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    Object.assign(profile, {
      display_name: display_name ?? profile.display_name,
      bio: bio ?? profile.bio,
      avatar_url: avatar_url ?? profile.avatar_url,
      location_city: location_city ?? profile.location_city,
      location_country: location_country ?? profile.location_country,
      location_lat: location_lat ?? profile.location_lat,
      location_lng: location_lng ?? profile.location_lng,
    });

    await profile.save();
    res.json(profile);
  } catch (err) {
    next(err);
  }
};

// Public profile view by user id (limited fields)
exports.getPublicProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({
      where: { user_id: req.params.userId },
      attributes: ['display_name', 'avatar_url', 'location_city', 'location_country'],
      include: {
        model: User,
        attributes: ['user_id', 'username'],
      },
    });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(profile);
  } catch (err) {
    next(err);
  }
};
