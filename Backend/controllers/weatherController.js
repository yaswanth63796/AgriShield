const weatherService = require('../services/weatherService');

/**
 * @desc    Get live weather data by latitude & longitude coordinates
 * @route   GET /api/weather/live?lat=<lat>&lon=<lon>
 * @access  Public
 */
const getLiveWeather = async (req, res) => {
  try {
    const { lat, lon } = req.query;

    // Validate query parameters presence
    if (lat === undefined || lon === undefined || lat === '' || lon === '') {
      return res.status(400).json({
        success: false,
        message: 'lat and lon query parameters are required'
      });
    }

    // Call Weather Service Layer
    const weatherData = await weatherService.fetchWeatherByCoordinates(lat, lon);

    return res.status(200).json({
      success: true,
      data: weatherData
    });
  } catch (error) {
    if (error.code === 'INVALID_COORDINATES') {
      return res.status(400).json({
        success: false,
        message: 'Invalid latitude or longitude coordinates provided'
      });
    }

    if (error.code === 'WEATHER_SERVICE_UNAVAILABLE') {
      return res.status(503).json({
        success: false,
        message: 'Weather service is temporarily unavailable, please try again'
      });
    }

    console.error('Unexpected error in getLiveWeather controller:', error);
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred while fetching weather data'
    });
  }
};

/**
 * @desc    Get historical weather data for a specific date (e.g., claim upload date 2026-09-16)
 * @route   GET /api/weather/historical?lat=<lat>&lon=<lon>&date=<date>
 * @access  Public
 */
const getHistoricalWeather = async (req, res) => {
  try {
    const { lat, lon, date } = req.query;
    const targetLat = lat !== undefined && lat !== '' ? lat : 11.0045;
    const targetLon = lon !== undefined && lon !== '' ? lon : 76.9616;
    const targetDate = date || '2026-09-16';

    const historicalData = await weatherService.fetchHistoricalWeather(targetLat, targetLon, targetDate);

    return res.status(200).json({
      success: true,
      data: historicalData
    });
  } catch (error) {
    console.error('Error fetching historical date weather:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching weather data for requested date'
    });
  }
};

module.exports = {
  getLiveWeather,
  getHistoricalWeather
};

