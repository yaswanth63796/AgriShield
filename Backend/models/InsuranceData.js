const mongoose = require('mongoose');

const insuranceDataSchema = new mongoose.Schema(
  {
    state: { type: String, required: true },
    district: { type: String, required: true },
    season: { type: String, required: true }, // "Kharif" or "Rabi"
    year: { type: Number, required: true },
    scheme: { type: String, required: true },
    crop: { type: String, required: true },
    insurance_company_id: { type: String, required: true },
    sum_insured_per_hectare: { type: Number, required: true },
    farmer_share_percent: { type: Number, required: true },
    actuarial_rate_percent: { type: Number, required: true },
    cutoff_date_actual: { type: String },
    cutoff_date_csc: { type: String },
    cutoff_date_aide: { type: String },
    data_entry_date_bank: { type: String },
    premium_debit_date_bank: { type: String },
    challan_date_bank: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('InsuranceData', insuranceDataSchema);
