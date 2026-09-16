const express = require('express');
const router = express.Router();
const { getLiveWeather, getHistoricalWeather } = require('../controllers/weatherController');

// GET API - Live Weather Data
router.get('/live', getLiveWeather);

// GET API - Historical Date Weather Data
router.get('/historical', getHistoricalWeather);

module.exports = router;

