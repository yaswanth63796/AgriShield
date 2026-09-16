const Scheme = require('../models/Scheme');

// Helper URL validator
const isValidHttpsUrl = (urlString) => {
  if (!urlString || typeof urlString !== 'string') return false;
  try {
    const url = new URL(urlString);
    return url.protocol === 'https:';
  } catch (err) {
    return false;
  }
};

// @desc    Get all active schemes (or all schemes for admin)
// @route   GET /api/schemes
// @access  Public / Farmer
const getSchemes = async (req, res) => {
  try {
    const { category, search, includeInactive } = req.query;

    let query = {};
    // Only show active schemes to non-admins unless explicitly allowed
    if (!includeInactive || req.user?.role !== 'admin') {
      query.active = true;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { fullName: searchRegex },
        { category: searchRegex },
        { shortDescription: searchRegex },
        { description: searchRegex }
      ];
    }

    const schemes = await Scheme.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: schemes.length,
      data: schemes
    });
  } catch (error) {
    console.error('Error in getSchemes:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching government schemes',
      error: error.message
    });
  }
};

// @desc    Get scheme by ID
// @route   GET /api/schemes/:id
// @access  Public / Farmer
const getSchemeById = async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Government scheme not found'
      });
    }

    // Non-admin cannot view inactive schemes directly
    if (!scheme.active && req.user?.role !== 'admin') {
      return res.status(404).json({
        success: false,
        message: 'This scheme is currently inactive'
      });
    }

    return res.status(200).json({
      success: true,
      data: scheme
    });
  } catch (error) {
    console.error('Error in getSchemeById:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching scheme details',
      error: error.message
    });
  }
};

// @desc    Create new scheme
// @route   POST /api/admin/schemes (or POST /api/schemes for admin)
// @access  Private/Admin
const createScheme = async (req, res) => {
  try {
    const {
      name,
      fullName,
      shortDescription,
      description,
      category,
      benefits,
      eligibility,
      importantNotes,
      icon,
      officialUrl,
      active
    } = req.body;

    if (!name || !shortDescription || !description || !category || !officialUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, shortDescription, description, category, officialUrl'
      });
    }

    if (!isValidHttpsUrl(officialUrl)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid officialUrl. Must be a valid HTTPS URL (e.g. https://pmkisan.gov.in/)'
      });
    }

    const scheme = await Scheme.create({
      name,
      fullName: fullName || name,
      shortDescription,
      description,
      category,
      benefits: benefits || '',
      eligibility: eligibility || '',
      importantNotes: importantNotes || 'Eligibility is subject to official scheme guidelines. Visit the official portal for current eligibility and application information.',
      icon: icon || '🌾',
      officialUrl,
      active: active !== undefined ? active : true
    });

    return res.status(201).json({
      success: true,
      message: 'Scheme created successfully',
      data: scheme
    });
  } catch (error) {
    console.error('Error in createScheme:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to create scheme',
      error: error.message
    });
  }
};

// @desc    Update scheme
// @route   PUT /api/admin/schemes/:id
// @access  Private/Admin
const updateScheme = async (req, res) => {
  try {
    const { officialUrl } = req.body;

    if (officialUrl && !isValidHttpsUrl(officialUrl)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid officialUrl. Must be a valid HTTPS URL starting with https://'
      });
    }

    const scheme = await Scheme.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Scheme updated successfully',
      data: scheme
    });
  } catch (error) {
    console.error('Error in updateScheme:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to update scheme',
      error: error.message
    });
  }
};

// @desc    Activate scheme
// @route   PATCH /api/admin/schemes/:id/activate
// @access  Private/Admin
const activateScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findByIdAndUpdate(
      req.params.id,
      { active: true },
      { new: true }
    );

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Scheme activated successfully',
      data: scheme
    });
  } catch (error) {
    console.error('Error in activateScheme:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to activate scheme',
      error: error.message
    });
  }
};

// @desc    Deactivate scheme
// @route   PATCH /api/admin/schemes/:id/deactivate
// @access  Private/Admin
const deactivateScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Scheme deactivated successfully',
      data: scheme
    });
  } catch (error) {
    console.error('Error in deactivateScheme:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to deactivate scheme',
      error: error.message
    });
  }
};

// @desc    Delete scheme
// @route   DELETE /api/admin/schemes/:id
// @access  Private/Admin
const deleteScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findByIdAndDelete(req.params.id);

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Scheme deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteScheme:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete scheme',
      error: error.message
    });
  }
};

module.exports = {
  getSchemes,
  getSchemeById,
  createScheme,
  updateScheme,
  activateScheme,
  deactivateScheme,
  deleteScheme
};
