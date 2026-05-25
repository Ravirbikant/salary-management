const express = require('express');
const router = express.Router();
const { getCountryInsights, getJobTitleInsights, getDepartmentInsights } = require('../controllers/insightsController');

router.get('/country/:country', getCountryInsights);
router.get('/jobtitle', getJobTitleInsights);
router.get('/department', getDepartmentInsights);

module.exports = router;