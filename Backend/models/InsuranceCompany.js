const mongoose = require('mongoose');

const insuranceCompanySchema = new mongoose.Schema(
  {
    company_id: { type: String, required: true, unique: true },
    name: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('InsuranceCompany', insuranceCompanySchema);
