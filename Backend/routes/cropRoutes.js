const express = require('express');
const router = express.Router();
const { registerCrop, getUserCrops } = require('../controllers/cropController');
const { protect } = require('../middleware/authMiddleware');

// Optional auth token extractor middleware
const optionalAuth = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
};

// Crop Registration Routes
router.post('/register', optionalAuth, registerCrop);
router.get('/my-crops', protect, getUserCrops);

module.exports = router;
