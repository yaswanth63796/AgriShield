const express = require('express');
const router = express.Router();
const {
  calculatePremium,
  getStates,
  getDistricts,
  getCrops,
  getCompanies
} = require('../controllers/premiumController');

// POST API - Premium Calculation
router.post('/premium/calculate', calculatePremium);

// Helper GET APIs for metadata / frontend dropdowns
router.get('/meta/states', getStates);
router.get('/meta/districts', getDistricts);
router.get('/meta/crops', getCrops);
router.get('/meta/companies', getCompanies);

module.exports = router;
