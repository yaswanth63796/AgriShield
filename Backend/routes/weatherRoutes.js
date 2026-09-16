const express = require('express');
const router = express.Router();
const { getLiveWeather } = require('../controllers/weatherController');

// GET API - Live Weather Data
router.get('/live', getLiveWeather);

module.exports = router;
