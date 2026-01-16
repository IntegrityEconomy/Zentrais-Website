const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Listing = sequelize.define('Listing', {
    listing_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    seller_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    engine_source: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'marketplace',
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    price: {
        type: DataTypes.DECIMAL(12, 2),
    },
    currency: {
        type: DataTypes.STRING(10),
    },
    category: {
        type: DataTypes.STRING(100),
    },
    status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'active',
    },
    credibility_indicator: {
        type: DataTypes.STRING(50),
    },
    integrity_flags: {
        type: DataTypes.TEXT,
    },
    latitude: {
        type: DataTypes.DECIMAL(10, 8),
    },
    longitude: {
        type: DataTypes.DECIMAL(11, 8),
    },
    location_name: {
        type: DataTypes.STRING(255),
    },
}, {
    tableName: 'listings',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = Listing;
