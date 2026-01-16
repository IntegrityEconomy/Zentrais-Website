const express = require('express');
const router = express.Router();
const { requireAuth, requireSelf } = require('../middleware/auth');
const {
    getFeed,
    searchFeed,
    getForYouFeed,
    getListingById,
    createListing,
    updateListing,
    deleteListing,
    deleteAllListings,
    saveListing,
    unsaveListing,
    getSavedListings,
} = require('../controllers/listingController');

// Feed routes (public)
router.get('/feed', getFeed);
router.get('/feed/search', searchFeed);
router.get('/feed/for-you', getForYouFeed);

// Listing CRUD routes
router.get('/listings/:id', getListingById); // Public: anyone can view
router.post('/listings', requireAuth, createListing);
router.put('/listings/:id', requireAuth, updateListing);
router.delete('/listings/:id', requireAuth, deleteListing);
router.delete('/listings', deleteAllListings); // Dev only: delete all listings

// Saved listings routes (auth + ownership required)
router.get('/users/:userId/saved-listings', requireAuth, requireSelf, getSavedListings);
router.post('/users/:userId/saved-listings/:listingId', requireAuth, requireSelf, saveListing);
router.delete('/users/:userId/saved-listings/:listingId', requireAuth, requireSelf, unsaveListing);

module.exports = router;
