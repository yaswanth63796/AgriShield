const RegisteredCrop = require('../models/RegisteredCrop');

/**
 * @desc    Register a new crop for insurance & loss assessment
 * @route   POST /api/crops/register
 * @access  Public / Protected
 */
const registerCrop = async (req, res) => {
  try {
    const {
      cropType,
      season,
      landAreaHectare,
      sowingDate,
      latitude,
      longitude,
      photoUrl,
      photoUrls
    } = req.body;

    // Validate required fields
    if (!cropType || !season || !landAreaHectare || !sowingDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide cropType, season, landAreaHectare, and sowingDate'
      });
    }

    const areaNum = parseFloat(landAreaHectare);
    if (isNaN(areaNum) || areaNum <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Land area must be a positive number'
      });
    }

    const normalizedPhotoUrls = Array.isArray(photoUrls) ? photoUrls.slice(0, 4) : (photoUrl ? [photoUrl] : []);
    const normalizedPhotoUrl = normalizedPhotoUrls.length > 0 ? normalizedPhotoUrls[0] : (photoUrl || '');

    // Create Crop Registration Record
    const newCrop = await RegisteredCrop.create({
      userId: req.user ? req.user._id : null,
      cropType: cropType.trim(),
      season: season.trim(),
      landAreaHectare: areaNum,
      sowingDate: new Date(sowingDate),
      latitude: latitude !== undefined ? parseFloat(latitude) : undefined,
      longitude: longitude !== undefined ? parseFloat(longitude) : undefined,
      photoUrl: normalizedPhotoUrl,
      photoUrls: normalizedPhotoUrls,
      status: 'Pending'
    });

    return res.status(201).json({
      success: true,
      message: 'Crop registered successfully in PMFBY database',
      data: newCrop
    });
  } catch (error) {
    console.error('Error registering crop:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error occurred while registering crop'
    });
  }
};

/**
 * @desc    Get registered crops list
 * @route   GET /api/crops/my-crops
 * @access  Protected
 */
const getUserCrops = async (req, res) => {
  try {
    let query = {};
    if (req.user && req.user.role !== 'admin') {
      query.userId = req.user._id;
    }

    const crops = await RegisteredCrop.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: crops.length,
      crops
    });
  } catch (error) {
    console.error('Error fetching crops:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error occurred while fetching crops'
    });
  }
};

module.exports = {
  registerCrop,
  getUserCrops
};
