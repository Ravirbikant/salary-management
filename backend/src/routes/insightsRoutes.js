const express = require('express');
const router = express.Router();
const { getCountryInsights } = require('../controllers/insightsController');

router.get('/country/:country', getCountryInsights);

module.exports = router;