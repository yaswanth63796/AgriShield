const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Scheme name is required'],
      trim: true
    },
    fullName: {
      type: String,
      trim: true,
      default: ''
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Full description is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      index: true,
      trim: true
    },
    benefits: {
      type: String,
      default: ''
    },
    eligibility: {
      type: String,
      default: ''
    },
    importantNotes: {
      type: String,
      default: 'Eligibility is subject to official scheme guidelines. Visit the official portal for the latest eligibility and application information.'
    },
    icon: {
      type: String,
      default: '🌾'
    },
    officialUrl: {
      type: String,
      required: [true, 'Official URL is required'],
      validate: {
        validator: function (v) {
          return /^https:\/\//i.test(v);
        },
        message: props => `${props.value} is not a valid HTTPS URL! Official URLs must start with https://`
      }
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Scheme', schemeSchema);
