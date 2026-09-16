const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const premiumRoutes = require('./routes/premiumRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const authRoutes = require('./routes/authRoutes');
const cropRoutes = require('./routes/cropRoutes');
const claimRoutes = require('./routes/claimRoutes');
const schemeRoutes = require('./routes/schemeRoutes');
const adminRoutes = require('./routes/adminRoutes');
const seedSchemes = require('./seed/seedSchemes');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB database
connectDB().then(() => {
  // Seed initial government schemes into MongoDB
  seedSchemes();
});

// Middleware with 50mb body limit for base64 photo payloads
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve uploaded damage photos as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/admin/schemes', schemeRoutes);
app.use('/api', premiumRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ status: 'PMFBY Dummy API running' });
});

// 404 JSON Handler for API routes
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route ${req.method} ${req.originalUrl} not found`
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
