const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const connectDB = require('../config/db');
const InsuranceData = require('../models/InsuranceData');
const InsuranceCompany = require('../models/InsuranceCompany');

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();

    // Read dummy JSON data
    const jsonPath = path.join(__dirname, 'pmfby_dummy_data.json');
    const rawData = fs.readFileSync(jsonPath, 'utf-8');
    const data = JSON.parse(rawData);

    // Clear existing collections
    await InsuranceData.deleteMany({});
    await InsuranceCompany.deleteMany({});
    console.log('Cleared existing InsuranceData and InsuranceCompany collections.');

    // Insert insurance companies
    const companies = data.insurance_companies || [];
    let insertedCompanies = [];
    if (companies.length > 0) {
      insertedCompanies = await InsuranceCompany.insertMany(companies);
    }

    // Insert district crop insurance data
    const insuranceRecords = data.district_crop_insurance_data || [];
    let insertedInsuranceData = [];
    if (insuranceRecords.length > 0) {
      insertedInsuranceData = await InsuranceData.insertMany(insuranceRecords);
    }

    console.log(`Successfully seeded ${insertedInsuranceData.length} records into InsuranceData collection.`);
    console.log(`Successfully seeded ${insertedCompanies.length} records into InsuranceCompany collection.`);

    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
