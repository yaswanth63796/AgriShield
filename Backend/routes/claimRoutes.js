const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { submitClaim, getMyClaims, getClaimById } = require('../controllers/claimController');
const { protect } = require('../middleware/authMiddleware');

// ── Multer configuration for damage photo uploads ──────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'damage-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    // Check extension (if present)
    const hasValidExt = file.originalname
      ? filetypes.test(path.extname(file.originalname).toLowerCase())
      : false;
    // Check mimetype (Flutter web may send application/octet-stream)
    const hasValidMime = filetypes.test(file.mimetype);

    // Accept if EITHER extension or mimetype is valid
    if (hasValidExt || hasValidMime) {
      return cb(null, true);
    }
    cb(new Error('Only image files (jpg, png, gif, webp) are allowed'));
  }
});

// ── Multer error-handling wrapper (returns JSON instead of crashing) ────────
const handleUpload = (req, res, next) => {
  upload.array('damagePhotos', 4)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      const message = err.code === 'LIMIT_FILE_SIZE'
        ? 'File too large. Maximum 5 MB allowed.'
        : err.code === 'LIMIT_UNEXPECTED_FILE'
        ? 'Maximum 4 photos allowed for claim submission.'
        : err.message;
      return res.status(400).json({ success: false, message });
    }
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
};

// ── Claim Routes ───────────────────────────────────────────────────────────

// POST /api/claims/submit — Submit a new claim (with optional damage photo)
router.post('/submit', protect, handleUpload, submitClaim);

// GET /api/claims/my-claims — Get all claims for the logged-in farmer
router.get('/my-claims', protect, getMyClaims);

// GET /api/claims/:id — Get a single claim by ID
router.get('/:id', protect, getClaimById);

// PUT /api/claims/:id/status — Update claim status (Admin/System)
router.put('/:id/status', updateClaimStatus);

module.exports = router;
