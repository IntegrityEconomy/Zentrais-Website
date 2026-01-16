const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Profile = sequelize.define('Profile', {
  profile_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  display_name: {
    type: DataTypes.TEXT,
  },
  bio: {
    type: DataTypes.TEXT,
  },
  avatar_url: {
    type: DataTypes.TEXT,
  },
  // MVP location fields
  location_city: {
    type: DataTypes.TEXT,
  },
  location_country: {
    type: DataTypes.TEXT,
  },
  location_lat: {
    type: DataTypes.DECIMAL(10, 7), // optional
  },
  location_lng: {
    type: DataTypes.DECIMAL(10, 7),
  },
}, {
  tableName: 'profiles',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

User.hasOne(Profile, {
  foreignKey: { name: 'user_id', allowNull: false },
  onDelete: 'CASCADE',
});
Profile.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Profile;
