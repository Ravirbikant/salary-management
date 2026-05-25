const express = require('express');
const router = express.Router();
const { getCountryInsights, getJobTitleInsights } = require('../controllers/insightsController');

router.get('/country/:country', getCountryInsights);
router.get('/jobtitle', getJobTitleInsights);

module.exports = router;