const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    cropId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RegisteredCrop',
      required: true
    },
    damageType: {
      type: String,
      required: [true, 'Damage type is required'],
      enum: ['Flood', 'Heavy Rain', 'Drought', 'Pest Attack', 'Disease', 'Storm', 'Hailstorm', 'Other']
    },
    damageDate: {
      type: Date,
      required: [true, 'Damage date is required']
    },
    damageDescription: {
      type: String,
      required: [true, 'Damage description is required'],
      maxlength: 1000
    },
    latitude: {
      type: Number,
      required: [true, 'Latitude is required']
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required']
    },
    damagePhotoUrl: {
      type: String,
      default: ''
    },
    damagePhotoUrls: {
      type: [String],
      default: []
    },
    status: {
      type: String,
      enum: ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'],
      default: 'PENDING'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Claim', claimSchema);
