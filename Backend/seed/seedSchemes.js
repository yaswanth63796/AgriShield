const Scheme = require('../models/Scheme');

const initialSchemes = [
  {
    name: 'PM-KISAN Samman Nidhi',
    fullName: 'Pradhan Mantri Kisan Samman Nidhi',
    shortDescription: 'Provides income support to eligible landholding farmer families subject to applicable scheme rules.',
    description: 'Provides income support to eligible landholding farmer families subject to the scheme\'s eligibility and exclusion rules. Under the scheme, financial benefit of ₹6,000/- per year is provided to eligible farmer families, payable in three equal installments of ₹2,000/- each.',
    category: 'Income Support',
    benefits: 'Direct Bank Transfer of ₹6,000 annually in 3 installments of ₹2,000 directly into bank accounts of eligible farmer families.',
    eligibility: 'All landholding farmer families who have cultivable land in their names, subject to statutory exclusion criteria (such as institutional landholders, high income taxpayers).',
    importantNotes: 'Eligibility is subject to official scheme guidelines. Application availability may vary by state and registration status. Visit the official portal for current eligibility and installment tracking.',
    icon: '🌾',
    officialUrl: 'https://pmkisan.gov.in/',
    active: true
  },
  {
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    fullName: 'Pradhan Mantri Fasal Bima Yojana',
    shortDescription: 'Provides crop insurance protection against specified crop losses and adverse events under scheme rules.',
    description: 'Provides crop insurance protection against specified crop losses and adverse events under the applicable scheme rules. PMFBY aims at supporting sustainable production in agriculture sector by providing financial support to farmers suffering crop loss/damage arising out of unforeseen events.',
    category: 'Crop Insurance',
    benefits: 'Comprehensive risk coverage for pre-sowing to post-harvest losses due to non-preventable natural risks. Low premium rates (2% Kharif, 1.5% Rabi, 5% Commercial/Horticultural crops).',
    eligibility: 'All farmers including sharecroppers and tenant farmers growing notified crops in notified areas are eligible for coverage.',
    importantNotes: 'Claim entitlement is subject to yield estimation tests, localized calamity reporting window, and official crop cutting experiment results.',
    icon: '🛡️',
    officialUrl: 'https://pmfby.gov.in/',
    active: true
  },
  {
    name: 'Kisan Credit Card (KCC)',
    fullName: 'Kisan Credit Card Scheme',
    shortDescription: 'Provides eligible farmers access to agricultural credit and financial support via participating banks.',
    description: 'Provides eligible farmers access to agricultural credit and related financial support through participating financial institutions. The KCC scheme aims at providing adequate and timely credit support from the banking system under a single window.',
    category: 'Agricultural Credit',
    benefits: 'Flexible credit line for cultivation requirements, post-harvest expenses, produce marketing loan, and farm maintenance at subsidized interest rates (with prompt repayment incentive).',
    eligibility: 'All farmers - individuals / joint borrowers who are owner cultivators, tenant farmers, sharecroppers, and Self Help Groups (SHGs) or Joint Liability Groups (JLGs).',
    importantNotes: 'Interest subvention and credit limits depend on RBI guidelines, land holding size, and participating bank rules.',
    icon: '💳',
    officialUrl: 'https://pmkisan.gov.in/',
    active: true
  },
  {
    name: 'PM-KUSUM',
    fullName: 'Pradhan Mantri Kisan Urja Suraksha evam Utthaan Mahabhiyan',
    shortDescription: 'Supports eligible agricultural solarisation initiatives including standalone solar pumps.',
    description: 'Supports eligible agricultural solarisation initiatives including standalone solar pumps and solarisation of agricultural pumps under applicable components. It aims to add solar and other renewable capacity to power agricultural operations.',
    category: 'Solar Energy',
    benefits: 'Subsidies up to 60% for setting up standalone solar agriculture pumps and solarising grid-connected agriculture pumps. Opportunity for farmers to sell surplus solar power back to the grid.',
    eligibility: 'Individual farmers, groups of farmers, cooperatives, panchayats, and Farmer Producer Organizations (FPOs).',
    importantNotes: 'Implementation agency and subsidy disbursal depend on state nodal renewable energy agencies. Official guidelines apply.',
    icon: '☀️',
    officialUrl: 'https://pmkusum.mnre.gov.in/',
    active: true
  },
  {
    name: 'Soil Health Card Scheme',
    fullName: 'Soil Health Card Scheme',
    shortDescription: 'Provides information about soil nutrient status and recommendations for fertilizers and soil amendments.',
    description: 'Provides information about soil nutrient status and recommendations for fertilizers and soil amendments. The card contains status of soil with respect to 12 parameters (Macro-nutrients, Micro-nutrients, and physical parameters).',
    category: 'Soil & Farm Management',
    benefits: 'Customized crop-wise fertilizer recommendations based on soil test results, helping farmers reduce input costs and improve soil fertility.',
    eligibility: 'All farmers across all states and Union Territories are covered under periodic soil sample collection cycles.',
    importantNotes: 'Sample collection schedules are managed by district agriculture departments and soil testing laboratories.',
    icon: '🌱',
    officialUrl: 'https://soilhealth.dac.gov.in/',
    active: true
  },
  {
    name: 'e-NAM',
    fullName: 'National Agriculture Market',
    shortDescription: 'Electronic agricultural market platform connecting APMC markets for transparent price discovery.',
    description: 'Provides an electronic agricultural market platform connecting APMC markets and supporting transparent price discovery and agricultural commodity trading across India.',
    category: 'Agricultural Marketing',
    benefits: 'Access to pan-India online trading network, direct online payment transfer, transparent price bidding, and reduced transaction costs for farm produce.',
    eligibility: 'Farmers, traders, and FPOs registered with participating APMC mandis across India.',
    importantNotes: 'Commodity grading, quality testing, and trade settlement rules follow target APMC guidelines.',
    icon: '📊',
    officialUrl: 'https://enam.gov.in/',
    active: true
  },
  {
    name: 'Sub-Mission on Agricultural Mechanization (SMAM)',
    fullName: 'Sub-Mission on Agricultural Mechanization',
    shortDescription: 'Supports agricultural mechanization through assistance for eligible farm machinery.',
    description: 'Supports agricultural mechanization through assistance for eligible farm machinery and related mechanization infrastructure under applicable guidelines. It aims to increase reach of farm mechanization to small and marginal farmers.',
    category: 'Farm Mechanization',
    benefits: 'Financial assistance / subsidy ranging from 40% to 80% for purchasing farm machinery, implements, and establishing Custom Hiring Centres (CHCs).',
    eligibility: 'Small and marginal farmers, women farmers, SC/ST farmers, FPOs, and registered self-help groups.',
    importantNotes: 'DPT portal registration and state allocation windows determine equipment subsidy eligibility.',
    icon: '🚜',
    officialUrl: 'https://agrimachinery.nic.in/',
    active: true
  },
  {
    name: 'PMFME',
    fullName: 'Pradhan Mantri Formalisation of Micro Food Processing Enterprises',
    shortDescription: 'Supports eligible micro food-processing enterprises through financial and formalisation support.',
    description: 'Supports eligible micro food-processing enterprises and related groups through the scheme\'s applicable financial and formalisation support under the Atmanirbhar Bharat Abhiyan.',
    category: 'Food Processing',
    benefits: 'Credit-linked capital subsidy of 35% of eligible project cost (max ₹10 Lakh per unit), seed capital support for SHG members, and branding/marketing assistance.',
    eligibility: 'Existing micro food processing units, SHGs, Co-operatives, FPOs, and new micro enterprises.',
    importantNotes: 'Project proposals must align with One District One Product (ODOP) focus or approved micro-enterprise categories.',
    icon: '🏭',
    officialUrl: 'https://pmfme.mofpi.gov.in/',
    active: true
  },
  {
    name: 'Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)',
    fullName: 'Pradhan Mantri Krishi Sinchayee Yojana',
    shortDescription: 'Supports irrigation development and efficient water management through applicable PMKSY components.',
    description: 'Supports irrigation development and efficient water management through applicable PMKSY components with the motto of "Har Khet Ko Pani" and "More Crop Per Drop".',
    category: 'Irrigation',
    benefits: 'Financial assistance for micro-irrigation systems (drip and sprinkler irrigation), farm ponds, water harvesting structures, and secondary storage tanks.',
    eligibility: 'Farmers of all categories having cultivable land with an accessible water source.',
    importantNotes: 'Subsidies are routed through state horticulture/agriculture departments according to land holding criteria.',
    icon: '💧',
    officialUrl: 'https://pmksy.gov.in/',
    active: true
  },
  {
    name: 'Agriculture Infrastructure Fund (AIF)',
    fullName: 'Agriculture Infrastructure Fund',
    shortDescription: 'Provides financing support for eligible agricultural infrastructure projects.',
    description: 'Provides financing support for eligible agricultural infrastructure projects under the applicable scheme guidelines. It mobilizes medium-to-long term debt financing for post-harvest management infrastructure.',
    category: 'Agricultural Infrastructure',
    benefits: 'Interest subvention of 3% per annum on loans up to ₹2 Crore for a maximum period of 7 years, alongside credit guarantee coverage.',
    eligibility: 'Primary Agricultural Credit Societies (PACS), Marketing Cooperative Societies, FPOs, SHGs, Farmers, Agri-entrepreneurs, and Startups.',
    importantNotes: 'Project financing approval and interest subvention disbursal are processed through participating commercial and cooperative banks.',
    icon: '🏗️',
    officialUrl: 'https://agriinfra.dac.gov.in/',
    active: true
  }
];

const seedSchemes = async () => {
  try {
    const count = await Scheme.countDocuments();
    if (count === 0) {
      await Scheme.insertMany(initialSchemes);
      console.log('Successfully seeded 10 initial government schemes into MongoDB.');
    } else {
      console.log(`Schemes table already contains ${count} records. Skipping initial seeding.`);
    }
  } catch (error) {
    console.error('Error seeding schemes into MongoDB:', error.message);
  }
};

module.exports = seedSchemes;
