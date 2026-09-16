const InsuranceData = require('../models/InsuranceData');
const InsuranceCompany = require('../models/InsuranceCompany');

// Helper to escape regex special characters
const escapeRegex = (text) => {
  if (!text) return '';
  return String(text).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

/**
 * @desc    Calculate insurance premium for given farmer input
 * @route   POST /api/premium/calculate
 * @access  Public
 */
const calculatePremium = async (req, res) => {
  try {
    const { state, district, season, year, scheme, crop, area } = req.body;

    // Validate required fields
    const requiredFields = { state, district, season, year, scheme, crop, area };
    const missingFields = Object.keys(requiredFields).filter(
      (field) => requiredFields[field] === undefined || requiredFields[field] === null || requiredFields[field] === ''
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Query InsuranceData with case-insensitive matching for string fields
    const query = {
      state: new RegExp(`^${escapeRegex(state)}$`, 'i'),
      district: new RegExp(`^${escapeRegex(district)}$`, 'i'),
      season: new RegExp(`^${escapeRegex(season)}$`, 'i'),
      year: Number(year),
      scheme: new RegExp(`^${escapeRegex(scheme)}$`, 'i'),
      crop: new RegExp(`^${escapeRegex(crop)}$`, 'i')
    };

    const insuranceRecord = await InsuranceData.findOne(query);

    if (!insuranceRecord) {
      return res.status(404).json({
        success: false,
        message: 'No insurance data found for the given combination'
      });
    }

    // Look up matching company name
    const company = await InsuranceCompany.findOne({
      company_id: insuranceRecord.insurance_company_id
    });

    const companyName = company ? company.name : insuranceRecord.insurance_company_id;

    // Premium calculations
    const areaNum = Number(area);
    const sumInsuredPerHectare = insuranceRecord.sum_insured_per_hectare;
    const farmerSharePercent = insuranceRecord.farmer_share_percent;
    const actuarialRatePercent = insuranceRecord.actuarial_rate_percent;

    const totalSumInsured = areaNum * sumInsuredPerHectare;
    const farmerPremium = totalSumInsured * (farmerSharePercent / 100);
    const totalActuarialPremium = totalSumInsured * (actuarialRatePercent / 100);
    const govtPremium = totalActuarialPremium - farmerPremium;

    // Format response
    return res.status(200).json({
      success: true,
      input: {
        state: state,
        district: district,
        season: season,
        year: Number(year),
        scheme: scheme,
        crop: crop,
        area: Number(area)
      },
      result: {
        insurance_company: companyName,
        sum_insured_per_hectare: sumInsuredPerHectare,
        farmer_share_percent: farmerSharePercent,
        actuarial_rate_percent: actuarialRatePercent,
        cutoff_date_actual: insuranceRecord.cutoff_date_actual,
        total_sum_insured: Number(totalSumInsured.toFixed(2)),
        farmer_premium: Number(farmerPremium.toFixed(2)),
        govt_premium: Number(govtPremium.toFixed(2)),
        important_dates: {
          cutoff_date_csc: insuranceRecord.cutoff_date_csc,
          cutoff_date_aide: insuranceRecord.cutoff_date_aide,
          data_entry_date_bank: insuranceRecord.data_entry_date_bank,
          premium_debit_date_bank: insuranceRecord.premium_debit_date_bank,
          challan_date_bank: insuranceRecord.challan_date_bank
        }
      }
    });
  } catch (error) {
    console.error('Error calculating premium:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error occurred while calculating premium'
    });
  }
};

/**
 * @desc    Get distinct list of states
 * @route   GET /api/meta/states
 * @access  Public
 */
const getStates = async (req, res) => {
  try {
    const states = await InsuranceData.distinct('state');
    return res.status(200).json({
      success: true,
      states
    });
  } catch (error) {
    console.error('Error fetching states:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error occurred while fetching states'
    });
  }
};

/**
 * @desc    Get distinct list of districts (optional filter by state)
 * @route   GET /api/meta/districts
 * @access  Public
 */
const getDistricts = async (req, res) => {
  try {
    const { state } = req.query;
    const query = {};
    if (state) {
      query.state = new RegExp(`^${escapeRegex(state)}$`, 'i');
    }
    const districts = await InsuranceData.distinct('district', query);
    return res.status(200).json({
      success: true,
      districts
    });
  } catch (error) {
    console.error('Error fetching districts:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error occurred while fetching districts'
    });
  }
};

/**
 * @desc    Get distinct list of crops (optional filter by state, district, season)
 * @route   GET /api/meta/crops
 * @access  Public
 */
const getCrops = async (req, res) => {
  try {
    const { state, district, season } = req.query;
    const query = {};
    if (state) query.state = new RegExp(`^${escapeRegex(state)}$`, 'i');
    if (district) query.district = new RegExp(`^${escapeRegex(district)}$`, 'i');
    if (season) query.season = new RegExp(`^${escapeRegex(season)}$`, 'i');

    const crops = await InsuranceData.distinct('crop', query);
    return res.status(200).json({
      success: true,
      crops
    });
  } catch (error) {
    console.error('Error fetching crops:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error occurred while fetching crops'
    });
  }
};

/**
 * @desc    Get all insurance companies
 * @route   GET /api/meta/companies
 * @access  Public
 */
const getCompanies = async (req, res) => {
  try {
    const companies = await InsuranceCompany.find({}, { _id: 0, __v: 0 });
    return res.status(200).json({
      success: true,
      companies
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error occurred while fetching companies'
    });
  }
};

module.exports = {
  calculatePremium,
  getStates,
  getDistricts,
  getCrops,
  getCompanies
};
