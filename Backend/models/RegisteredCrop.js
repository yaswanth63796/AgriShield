const mongoose = require('mongoose');

const registeredCropSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    cropType: {
      type: String,
      required: [true, 'Crop type is required'],
      trim: true
    },
    season: {
      type: String,
      required: [true, 'Season is required'],
      enum: ['Kharif', 'Rabi'],
      trim: true
    },
    landAreaHectare: {
      type: Number,
      required: [true, 'Land area in hectares is required'],
      min: [0.01, 'Land area must be greater than 0']
    },
    sowingDate: {
      type: Date,
      required: [true, 'Sowing date is required']
    },
    latitude: {
      type: Number,
      required: false
    },
    longitude: {
      type: Number,
      required: false
    },
    photoUrl: {
      type: String,
      required: false,
      default: ''
    },
    photoUrls: {
      type: [String],
      default: []
    },
    status: {
      type: String,
      enum: ['Pending', 'Verified', 'Approved', 'Rejected'],
      default: 'Pending'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('RegisteredCrop', registeredCropSchema);
