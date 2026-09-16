const express = require('express');
const router = express.Router();
const {
  getSchemes,
  getSchemeById,
  createScheme,
  updateScheme,
  activateScheme,
  deactivateScheme,
  deleteScheme
} = require('../controllers/schemeController');
const { protect, adminProtect } = require('../middleware/authMiddleware');

// Public / Farmer routes
router.get('/', getSchemes);
router.get('/:id', getSchemeById);

// Admin routes (Can also be mounted at /api/admin/schemes in server.js)
router.post('/admin', protect, adminProtect, createScheme);
router.put('/admin/:id', protect, adminProtect, updateScheme);
router.patch('/admin/:id/activate', protect, adminProtect, activateScheme);
router.patch('/admin/:id/deactivate', protect, adminProtect, deactivateScheme);
router.delete('/admin/:id', protect, adminProtect, deleteScheme);

module.exports = router;
