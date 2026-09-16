const Claim = require('../models/Claim');
const RegisteredCrop = require('../models/RegisteredCrop');
const mongoose = require('mongoose');

/**
 * @desc    Submit a new insurance claim for a registered crop
 * @route   POST /api/claims/submit
 * @access  Private (protect middleware)
 */
const submitClaim = async (req, res) => {
  try {
    const {
      cropId,
      damageType,
      damageDate,
      damageDescription,
      latitude,
      longitude
    } = req.body;

    // Validate required fields
    if (!cropId || !damageType || !damageDate || !damageDescription ||
        latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: cropId, damageType, damageDate, damageDescription, latitude, longitude'
      });
    }

    // Verify crop exists
    let crop = null;
    if (mongoose.Types.ObjectId.isValid(cropId)) {
      crop = await RegisteredCrop.findById(cropId);
    }
    if (!crop) {
      const allCrops = await RegisteredCrop.find();
      const cleanCropId = cropId.replace('CRP-', '').toUpperCase();
      crop = allCrops.find(c => c._id.toString() === cropId || c._id.toString().substring(18).toUpperCase() === cleanCropId);
    }

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    // SECURITY: Verify crop belongs to the authenticated farmer
    if (crop.userId && crop.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to raise a claim for this crop'
      });
    }

    // Handle uploaded damage photos (array up to 4 photos)
    let damagePhotoUrls = [];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      damagePhotoUrls = req.files.slice(0, 4).map(file => `/uploads/${file.filename}`);
    } else if (req.file) {
      damagePhotoUrls = [`/uploads/${req.file.filename}`];
    }

    const damagePhotoUrl = damagePhotoUrls.length > 0 ? damagePhotoUrls[0] : '';

    // Create claim record in database
    const newClaim = await Claim.create({
      userId: req.user._id,
      cropId: cropId,
      damageType: damageType.trim(),
      damageDate: new Date(damageDate),
      damageDescription: damageDescription.trim(),
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      damagePhotoUrl,
      damagePhotoUrls,
      status: 'PENDING'
    });

    return res.status(201).json({
      success: true,
      message: 'Claim submitted successfully',
      claim: newClaim
    });
  } catch (error) {
    console.error('Error submitting claim:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error occurred while submitting claim'
    });
  }
};

/**
 * @desc    Get all claims for the logged-in farmer
 * @route   GET /api/claims/my-claims
 * @access  Private (protect middleware)
 */
const getMyClaims = async (req, res) => {
  try {
    const claims = await Claim.find({ userId: req.user._id })
      .populate('cropId', 'cropType season landAreaHectare sowingDate')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: claims.length,
      claims
    });
  } catch (error) {
    console.error('Error fetching claims:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error occurred while fetching claims'
    });
  }
};

/**
 * @desc    Get a single claim by ID (with ownership check)
 * @route   GET /api/claims/:id
 * @access  Private (protect middleware)
 */
const getClaimById = async (req, res) => {
  try {
    const rawId = req.params.id;
    let claim = null;

    if (mongoose.Types.ObjectId.isValid(rawId)) {
      claim = await Claim.findById(rawId).populate('cropId', 'cropType season landAreaHectare sowingDate');
    }

    if (!claim) {
      const allClaims = await Claim.find().populate('cropId', 'cropType season landAreaHectare sowingDate');
      const cleanClaimId = rawId.replace('CLM-', '').toUpperCase();
      claim = allClaims.find(c => c._id.toString() === rawId || c._id.toString().substring(18).toUpperCase() === cleanClaimId);
    }

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found'
      });
    }

    // SECURITY: Verify the claim belongs to the authenticated farmer
    if (claim.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this claim'
      });
    }

    return res.status(200).json({
      success: true,
      claim
    });
  } catch (error) {
    console.error('Error fetching claim:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error occurred while fetching claim'
    });
  }
};

/**
 * @desc    Update claim status directly
 * @route   PUT /api/claims/:id/status
 * @access  Public / Admin
 */
const updateClaimStatus = async (req, res) => {
  try {
    const rawId = req.params.id;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    let claim = null;
    if (mongoose.Types.ObjectId.isValid(rawId)) {
      claim = await Claim.findById(rawId);
    }

    if (!claim) {
      const allClaims = await Claim.find();
      const cleanClaimId = rawId.replace('CLM-', '').toUpperCase();
      claim = allClaims.find(c => c._id.toString() === rawId || c._id.toString().substring(18).toUpperCase() === cleanClaimId);
    }

    if (!claim) {
      return res.status(404).json({ success: false, message: 'Claim not found' });
    }

    const validStatuses = ['Pending', 'Under review', 'Approved', 'Rejected'];
    const matched = validStatuses.find(s => s.toLowerCase() === status.toLowerCase());
    claim.status = matched || status;
    await claim.save();

    return res.status(200).json({
      success: true,
      message: `Claim status updated to ${claim.status}`,
      claim
    });
  } catch (error) {
    console.error('Error updating claim status:', error);
    return res.status(500).json({ success: false, message: 'Server error updating claim status' });
  }
};

module.exports = { submitClaim, getMyClaims, getClaimById, updateClaimStatus };
