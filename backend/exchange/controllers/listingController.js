const prisma = require('../config/prisma');
const { Prisma } = require('@prisma/client');

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
        const skip = (pageNum - 1) * limitNum;

        const where = { status };

        if (category) {
            where.category = category;
        }

        if (min_price || max_price) {
            where.price = {};
            if (min_price) {
                where.price.gte = parseFloat(min_price);
            }
            if (max_price) {
                where.price.lte = parseFloat(max_price);
            }
        }

        const [count, rows] = await Promise.all([
            prisma.listing.count({ where }),
            prisma.listing.findMany({
                where,
                take: limitNum,
                skip,
                orderBy: { [sort_by]: sort_order.toLowerCase() },
            }),
        ]);

        const totalPages = Math.ceil(count / limitNum);

        res.json({
            data: rows.map(r => ({ ...r, listing_id: r.id })),
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
        const skip = (pageNum - 1) * limitNum;

        const where = { status: 'active' };

        if (query) {
            where.OR = [
                { title: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
            ];
        }

        if (category) {
            where.category = category;
        }

        if (min_price || max_price) {
            where.price = {};
            if (min_price) {
                where.price.gte = parseFloat(min_price);
            }
            if (max_price) {
                where.price.lte = parseFloat(max_price);
            }
        }

        const [count, rows] = await Promise.all([
            prisma.listing.count({ where }),
            prisma.listing.findMany({
                where,
                take: limitNum,
                skip,
                orderBy: { [sort_by]: sort_order.toLowerCase() },
            }),
        ]);

        const totalPages = Math.ceil(count / limitNum);

        res.json({
            data: rows.map(r => ({ ...r, listing_id: r.id })),
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

        // Use raw SQL for Haversine formula
        const categoryFilter = category ? Prisma.sql`AND category = ${category}` : Prisma.sql``;
        
        const rows = await prisma.$queryRaw`
            SELECT *, 
                6371 * acos(
                    cos(radians(${userLat})) * cos(radians(latitude)) *
                    cos(radians(longitude) - radians(${userLng})) +
                    sin(radians(${userLat})) * sin(radians(latitude))
                ) AS distance
            FROM exchange.listings
            WHERE status = 'active'
                AND latitude IS NOT NULL
                AND longitude IS NOT NULL
                ${categoryFilter}
                AND 6371 * acos(
                    cos(radians(${userLat})) * cos(radians(latitude)) *
                    cos(radians(longitude) - radians(${userLng})) +
                    sin(radians(${userLat})) * sin(radians(latitude))
                ) <= ${radiusKm}
            ORDER BY distance ASC
            LIMIT ${limitNum}
            OFFSET ${offset}
        `;

        const countResult = await prisma.$queryRaw`
            SELECT COUNT(*)::int as count
            FROM exchange.listings
            WHERE status = 'active'
                AND latitude IS NOT NULL
                AND longitude IS NOT NULL
                ${categoryFilter}
                AND 6371 * acos(
                    cos(radians(${userLat})) * cos(radians(latitude)) *
                    cos(radians(longitude) - radians(${userLng})) +
                    sin(radians(${userLat})) * sin(radians(latitude))
                ) <= ${radiusKm}
        `;

        const count = countResult[0]?.count || 0;
        const totalPages = Math.ceil(count / limitNum);

        res.json({
            data: rows.map(r => ({ ...r, listing_id: r.listing_id })),
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
        const listing = await prisma.listing.findUnique({ where: { id: req.params.id } });
        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }
        res.json({ ...listing, listing_id: listing.id });
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
            images,
        } = req.body;

        if (!seller_id) {
            return res.status(400).json({ error: 'seller_id is required' });
        }
        if (!title) {
            return res.status(400).json({ error: 'title is required' });
        }

        const listing = await prisma.listing.create({
            data: {
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
                images: images || [],
            },
        });

        res.status(201).json({ ...listing, listing_id: listing.id });
    } catch (err) {
        next(err);
    }
};

// PUT /listings/:id - Update listing
exports.updateListing = async (req, res, next) => {
    try {
        const existing = await prisma.listing.findUnique({ where: { id: req.params.id } });
        if (!existing) {
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

        const listing = await prisma.listing.update({
            where: { id: req.params.id },
            data: {
                title: title ?? existing.title,
                description: description ?? existing.description,
                price: price ?? existing.price,
                currency: currency ?? existing.currency,
                category: category ?? existing.category,
                status: status ?? existing.status,
                credibility_indicator: credibility_indicator ?? existing.credibility_indicator,
                integrity_flags: integrity_flags ?? existing.integrity_flags,
            },
        });

        res.json({ ...listing, listing_id: listing.id });
    } catch (err) {
        next(err);
    }
};

// DELETE /listings/:id - Delete listing
exports.deleteListing = async (req, res, next) => {
    try {
        const listing = await prisma.listing.findUnique({ where: { id: req.params.id } });
        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }

        await prisma.listing.delete({ where: { id: req.params.id } });
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

// POST /users/:userId/saved-listings/:listingId - Save a listing
exports.saveListing = async (req, res, next) => {
    try {
        const { userId, listingId } = req.params;

        const listing = await prisma.listing.findUnique({ where: { id: listingId } });
        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }

        const existingSave = await prisma.savedListing.findUnique({
            where: { user_id_listing_id: { user_id: userId, listing_id: listingId } },
        });
        if (existingSave) {
            return res.status(409).json({ error: 'Listing already saved' });
        }

        const savedListing = await prisma.savedListing.create({
            data: {
                user_id: userId,
                listing_id: listingId,
            },
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

        const savedListing = await prisma.savedListing.findUnique({
            where: { user_id_listing_id: { user_id: userId, listing_id: listingId } },
        });

        if (!savedListing) {
            return res.status(404).json({ error: 'Saved listing not found' });
        }

        await prisma.savedListing.delete({
            where: { user_id_listing_id: { user_id: userId, listing_id: listingId } },
        });
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

// GET /users/:userId/saved-listings - Get user's saved listings
exports.getSavedListings = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const savedListings = await prisma.savedListing.findMany({
            where: { user_id: userId },
            include: { listing: true },
            orderBy: { created_at: 'desc' },
        });

        const result = savedListings.map((saved) => ({
            ...saved.listing,
            listing_id: saved.listing.id,
            saved_at: saved.created_at,
        }));

        res.json(result);
    } catch (err) {
        next(err);
    }
};
