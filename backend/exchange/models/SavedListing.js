const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Listing = require('./Listing');

const SavedListing = sequelize.define('SavedListing', {
    saved_listing_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id',
        },
    },
    listing_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Listing,
            key: 'listing_id',
        },
    },
}, {
    tableName: 'saved_listings',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            unique: true,
            fields: ['user_id', 'listing_id'],
        },
    ],
});

// Define associations
User.hasMany(SavedListing, { foreignKey: 'user_id', onDelete: 'CASCADE' });
SavedListing.belongsTo(User, { foreignKey: 'user_id' });

Listing.hasMany(SavedListing, { foreignKey: 'listing_id', onDelete: 'CASCADE' });
SavedListing.belongsTo(Listing, { foreignKey: 'listing_id' });

module.exports = SavedListing;
