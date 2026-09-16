const satelliteDataService = require('./satelliteDataService');
const weatherService = require('./weatherService');

/**
 * NdviService
 * 
 * Responsibility:
 * - Calculate time-series window (30 days before & 30 days after damage date)
 * - Fetch Sentinel-2 satellite observation data
 * - Compute baseline before-damage NDVI and after-damage NDVI
 * - Calculate NDVI absolute change & percentage change
 * - Classify NDVI status based on configurable threshold rules
 */
class NdviService {
  constructor() {
    this.significantDeclineThreshold = parseFloat(process.env.NDVI_SIGNIFICANT_DECLINE_THRESHOLD || '-30');
    this.moderateDeclineThreshold = parseFloat(process.env.NDVI_MODERATE_DECLINE_THRESHOLD || '-10');
    this.noChangeUpperThreshold = parseFloat(process.env.NDVI_NO_CHANGE_UPPER_THRESHOLD || '10');
  }

  /**
   * Perform NDVI Validation Analysis for a Claim
   * 
   * @param {string} claimId - Claim ID string
   * @param {number} latitude - Latitude coordinate
   * @param {number} longitude - Longitude coordinate
   * @param {string|Date} rawDamageDate - Reported crop damage date
   * @returns {Promise<Object>} Formatted NDVI Analysis Response
   */
  async analyzeClaimNdvi(claimId, latitude, longitude, rawDamageDate) {
    const latNum = parseFloat(latitude);
    const lngNum = parseFloat(longitude);

    if (isNaN(latNum) || isNaN(lngNum)) {
      throw new Error('Location coordinates (latitude and longitude) are missing or invalid.');
    }

    const damageDateObj = rawDamageDate ? new Date(rawDamageDate) : new Date();
    if (isNaN(damageDateObj.getTime())) {
      throw new Error('Damage date is missing or invalid.');
    }

    const damageDateFormatted = damageDateObj.toISOString().split('T')[0];

    // Define analysis window: 10 days before and 10 days after damage upload date
    const startDate = new Date(damageDateObj.getTime() - 10 * 24 * 60 * 60 * 1000);
    const endDate = new Date(damageDateObj.getTime() + 10 * 24 * 60 * 60 * 1000);

    // Fetch satellite observations from Sentinel-2 provider
    const observations = await satelliteDataService.fetchSentinel2Observations(
      latNum,
      lngNum,
      startDate,
      endDate,
      damageDateObj
    );

    if (!observations || observations.length < 2) {
      throw new Error('Insufficient clear satellite observations available for NDVI analysis.');
    }

    // Split observations into Pre-damage and Post-damage
    const preDamageObs = observations.filter(o => o.isPreDamage || o.date < damageDateFormatted);
    const postDamageObs = observations.filter(o => !o.isPreDamage || o.date >= damageDateFormatted);

    // Calculate baseline before-damage NDVI (Mean of pre-damage observations)
    let beforeDamageNdvi;
    if (preDamageObs.length > 0) {
      const sumPre = preDamageObs.reduce((acc, o) => acc + o.ndvi, 0);
      beforeDamageNdvi = parseFloat((sumPre / preDamageObs.length).toFixed(2));
    } else {
      beforeDamageNdvi = parseFloat(observations[0].ndvi.toFixed(2));
    }

    // Calculate after-damage NDVI (Mean of post-damage observations)
    let afterDamageNdvi;
    if (postDamageObs.length > 0) {
      const sumPost = postDamageObs.reduce((acc, o) => acc + o.ndvi, 0);
      afterDamageNdvi = parseFloat((sumPost / postDamageObs.length).toFixed(2));
    } else {
      afterDamageNdvi = parseFloat(observations[observations.length - 1].ndvi.toFixed(2));
    }

    // Calculate NDVI absolute change: afterDamageNdvi - beforeDamageNdvi
    const ndviChange = parseFloat((afterDamageNdvi - beforeDamageNdvi).toFixed(2));

    // Calculate percentage change: ((after - before) / before) * 100
    const rawPercentage = beforeDamageNdvi !== 0
      ? ((afterDamageNdvi - beforeDamageNdvi) / Math.abs(beforeDamageNdvi)) * 100
      : 0;

    const ndviChangePercentage = parseFloat(rawPercentage.toFixed(1));

    // Determine NDVI Status Classification
    let status;
    let statusExplanation;

    if (ndviChangePercentage <= this.significantDeclineThreshold) {
      status = 'SIGNIFICANT_DECLINE';
      statusExplanation = 'Vegetation index shows a significant decline after the reported damage date.';
    } else if (ndviChangePercentage <= this.moderateDeclineThreshold) {
      status = 'MODERATE_DECLINE';
      statusExplanation = 'Vegetation index shows a moderate decline after the reported damage date.';
    } else if (ndviChangePercentage <= this.noChangeUpperThreshold) {
      status = 'NO_SIGNIFICANT_CHANGE';
      statusExplanation = 'No significant NDVI decline was detected in the analyzed period.';
    } else {
      status = 'INCREASE';
      statusExplanation = 'NDVI increased after the reported damage date.';
    }

    // Map clean observations array for frontend time series graph
    const timeSeriesObservations = observations.map(o => ({
      date: o.date,
      ndvi: o.ndvi,
      cloudCoverage: o.cloudCoverage
    }));

    const damageUploadTimestamp = damageDateObj.toISOString();
    const damageUploadTime = `${damageDateFormatted} ${String(damageDateObj.getHours()).padStart(2, '0')}:${String(damageDateObj.getMinutes()).padStart(2, '0')}:${String(damageDateObj.getSeconds()).padStart(2, '0')}`;

    // Fetch Historical Weather Detection for exact crop damage upload date
    const damageDateWeather = await weatherService.fetchHistoricalWeather(
      latNum,
      lngNum,
      damageDateFormatted
    );

    return {
      claimId,
      latitude: latNum,
      longitude: lngNum,
      damageDate: damageDateFormatted,
      damageUploadTimestamp,
      damageUploadTime,
      beforeDamageNdvi,
      afterDamageNdvi,
      ndviChange,
      ndviChangePercentage,
      status,
      statusExplanation,
      damageDateWeather,
      observations: timeSeriesObservations
    };
  }
}

module.exports = new NdviService();
