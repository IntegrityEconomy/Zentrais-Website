const { Op, literal } = require('sequelize');
const Listing = require('../models/Listing');
const SavedListing = require('../models/SavedListing');

// GET /feed - Paginated listing feed
exports.getFeed = async (req, res, next) => {
    try {
        const {
            page = '1',
            limit = '20',
            category,
            min_price,
            max_price,
            status = 'active',
            sort_by = 'created_at',
            sort_order = 'desc',
        } = req.query;

        const pageNum = Math.max(1, parseInt(page, 10));
        const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
        const offset = (pageNum - 1) * limitNum;

        const where = { status };

        if (category) {
            where.category = category;
        }

        if (min_price || max_price) {
            where.price = {};
            if (min_price) {
                where.price[Op.gte] = parseFloat(min_price);
            }
            if (max_price) {
                where.price[Op.lte] = parseFloat(max_price);
            }
        }

        const { count, rows } = await Listing.findAndCountAll({
            where,
            limit: limitNum,
            offset,
            order: [[sort_by, sort_order.toUpperCase()]],
        });

        const totalPages = Math.ceil(count / limitNum);

        res.json({
            data: rows,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total: count,
                total_pages: totalPages,
                has_next: pageNum < totalPages,
                has_prev: pageNum > 1,
            },
        });
    } catch (err) {
        next(err);
    }
};

// GET /feed/search - Search listings
exports.searchFeed = async (req, res, next) => {
    try {
        const {
            q = '',
            page = '1',
            limit = '20',
            category,
            min_price,
            max_price,
            sort_by = 'created_at',
            sort_order = 'desc',
        } = req.query;

        const query = q.toLowerCase();
        const pageNum = Math.max(1, parseInt(page, 10));
        const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
        const offset = (pageNum - 1) * limitNum;

        const where = { status: 'active' };

        if (query) {
            where[Op.or] = [
                { title: { [Op.iLike]: `%${query}%` } },
                { description: { [Op.iLike]: `%${query}%` } },
            ];
        }

        if (category) {
            where.category = category;
        }

        if (min_price || max_price) {
            where.price = {};
            if (min_price) {
                where.price[Op.gte] = parseFloat(min_price);
            }
            if (max_price) {
                where.price[Op.lte] = parseFloat(max_price);
            }
        }

        const { count, rows } = await Listing.findAndCountAll({
            where,
            limit: limitNum,
            offset,
            order: [[sort_by, sort_order.toUpperCase()]],
        });

        const totalPages = Math.ceil(count / limitNum);

        res.json({
            data: rows,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total: count,
                total_pages: totalPages,
                has_next: pageNum < totalPages,
                has_prev: pageNum > 1,
            },
        });
    } catch (err) {
        next(err);
    }
};

// GET /feed/for-you - Location-based feed
exports.getForYouFeed = async (req, res, next) => {
    try {
        const {
            lat,
            lng,
            radius = '50',
            page = '1',
            limit = '20',
            category,
        } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({ error: 'lat and lng are required' });
        }

        const userLat = parseFloat(lat);
        const userLng = parseFloat(lng);
        const radiusKm = parseFloat(radius);
        const pageNum = Math.max(1, parseInt(page, 10));
        const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
        const offset = (pageNum - 1) * limitNum;

        // Haversine formula for distance calculation in PostgreSQL
        const distanceFormula = literal(`
      6371 * acos(
        cos(radians(${userLat})) * cos(radians(latitude)) *
        cos(radians(longitude) - radians(${userLng})) +
        sin(radians(${userLat})) * sin(radians(latitude))
      )
    `);

        const where = {
            status: 'active',
            latitude: { [Op.ne]: null },
            longitude: { [Op.ne]: null },
        };

        if (category) {
            where.category = category;
        }

        const { count, rows } = await Listing.findAndCountAll({
            attributes: {
                include: [[distanceFormula, 'distance']],
            },
            where,
            having: literal(`
        6371 * acos(
          cos(radians(${userLat})) * cos(radians(latitude)) *
          cos(radians(longitude) - radians(${userLng})) +
          sin(radians(${userLat})) * sin(radians(latitude))
        ) <= ${radiusKm}
      `),
            order: [[literal('distance'), 'ASC']],
            limit: limitNum,
            offset,
            subQuery: false,
        });

        const totalPages = Math.ceil(count / limitNum);

        res.json({
            data: rows,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total: count,
                total_pages: totalPages,
                has_next: pageNum < totalPages,
                has_prev: pageNum > 1,
            },
        });
    } catch (err) {
        next(err);
    }
};

// GET /listings/:id - Get single listing
exports.getListingById = async (req, res, next) => {
    try {
        const listing = await Listing.findByPk(req.params.id);
        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }
        res.json(listing);
    } catch (err) {
        next(err);
    }
};

// POST /listings - Create listing
exports.createListing = async (req, res, next) => {
    try {
        const {
            seller_id,
            engine_source = 'marketplace',
            title,
            description,
            price,
            currency,
            category,
            status = 'active',
            credibility_indicator,
            integrity_flags,
            latitude,
            longitude,
            location_name,
        } = req.body;

        if (!seller_id) {
            return res.status(400).json({ error: 'seller_id is required' });
        }
        if (!title) {
            return res.status(400).json({ error: 'title is required' });
        }

        const listing = await Listing.create({
            seller_id,
            engine_source,
            title,
            description: description || null,
            price: price || null,
            currency: currency || null,
            category: category || null,
            status,
            credibility_indicator: credibility_indicator || null,
            integrity_flags: integrity_flags || null,
            latitude: latitude || null,
            longitude: longitude || null,
            location_name: location_name || null,
        });

        res.status(201).json(listing);
    } catch (err) {
        next(err);
    }
};

// PUT /listings/:id - Update listing
exports.updateListing = async (req, res, next) => {
    try {
        const listing = await Listing.findByPk(req.params.id);
        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }

        const {
            title,
            description,
            price,
            currency,
            category,
            status,
            credibility_indicator,
            integrity_flags,
        } = req.body;

        await listing.update({
            title: title ?? listing.title,
            description: description ?? listing.description,
            price: price ?? listing.price,
            currency: currency ?? listing.currency,
            category: category ?? listing.category,
            status: status ?? listing.status,
            credibility_indicator: credibility_indicator ?? listing.credibility_indicator,
            integrity_flags: integrity_flags ?? listing.integrity_flags,
        });

        res.json(listing);
    } catch (err) {
        next(err);
    }
};

// DELETE /listings/:id - Delete listing
exports.deleteListing = async (req, res, next) => {
    try {
        const listing = await Listing.findByPk(req.params.id);
        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }

        await listing.destroy();
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

// POST /users/:userId/saved-listings/:listingId - Save a listing
exports.saveListing = async (req, res, next) => {
    try {
        const { userId, listingId } = req.params;

        const listing = await Listing.findByPk(listingId);
        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }

        const existingSave = await SavedListing.findOne({
            where: { user_id: userId, listing_id: listingId },
        });
        if (existingSave) {
            return res.status(409).json({ error: 'Listing already saved' });
        }

        const savedListing = await SavedListing.create({
            user_id: userId,
            listing_id: listingId,
        });

        res.status(201).json(savedListing);
    } catch (err) {
        next(err);
    }
};

// DELETE /users/:userId/saved-listings/:listingId - Unsave a listing
exports.unsaveListing = async (req, res, next) => {
    try {
        const { userId, listingId } = req.params;

        const savedListing = await SavedListing.findOne({
            where: { user_id: userId, listing_id: listingId },
        });

        if (!savedListing) {
            return res.status(404).json({ error: 'Saved listing not found' });
        }

        await savedListing.destroy();
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

// GET /users/:userId/saved-listings - Get user's saved listings
exports.getSavedListings = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const savedListings = await SavedListing.findAll({
            where: { user_id: userId },
            include: [{ model: Listing }],
            order: [['created_at', 'DESC']],
        });

        const result = savedListings.map((saved) => ({
            ...saved.Listing.toJSON(),
            saved_at: saved.created_at,
        }));

        res.json(result);
    } catch (err) {
        next(err);
    }
};
