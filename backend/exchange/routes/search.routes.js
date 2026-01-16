const express = require("express");
const listings = require("../data/listings.mock");
const parseAIIntent = require("../utils/aiParser");

const router = express.Router();

// STANDARD SEARCH GET /api/search
router.get("/search", (req, res) => {
    const { keyword, category, location, page = 1, limit = 10 } = req.query;

    let results = listings;

    if (keyword) {
        results = results.filter(item =>
            item.title.toLowerCase().includes(keyword.toLowerCase())
            );
    }

    if (category) {
        results = results.filter(item => item.category === category);
    }

    if (location) {
        results = results.filter(item => item.location === location);
    }

    const start = (page - 1) * limit;
    const paginated = results.slice(start, start + Number(limit));

    res.json({
        success: true,
        total: results.length,
        page: Number(page),
        data: paginated,
    });
});

// AI-ASSISTED DISCOVERY

router.post("/search/ai", (req, res) => {
    const {query} = req.body;
    const intent = parseAIIntent(query);

    let results = listings;

    if (intent.category) {
        results = results.filter(i => i.category === intent.category);
    }

    if (intent.location) {
        results = results.filter(i => i.location === intent.location);
    }

    res.json({
        success:true,
        parsedIntent: intent,
        data: results,
    });
});

// REPORT LISTINIG
router.post("/listings/:id/report", (req, res) => {
    const { reason, reporter} = req.body;

    res.json({
        success: true,
        message: "Listing reported",
        data: { listingId: req.params.id, reason, reporter},
    });
});

// BLOCK USER
router.post("/users/:id/block", (req, res) => {
    res.json({
        success: true,
        message: `User ${req.params.id} blocked`,
    });
});

router.post("/listings/:id/flag", (req, res) => {
    res.json({
        success: true,
        message: "Listing flagged for review",
    });
});

module.exports = router;