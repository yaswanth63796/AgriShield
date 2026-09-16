const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllFarmers,
  getAllCrops,
  getCropById,
  getAllClaims
} = require('../controllers/adminController');

// ── Admin Live MongoDB Routes ──────────────────────────────────────────────
router.get('/dashboard-stats', getDashboardStats);
router.get('/farmers', getAllFarmers);
router.get('/crops', getAllCrops);
router.get('/crops/:id', getCropById);
router.get('/claims', getAllClaims);

module.exports = router;
