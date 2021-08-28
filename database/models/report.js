const mongoose = require("mongoose");

const Report = mongoose.Schema({
  reportId: {
    type: String,
    required: true,
  },
  reportedBy: {
    type: mongoose.Schema.Types._ObjectId,
    required: true,
  },
  hurdleType: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  locationCoords: {
    type: Object,
    default: {
      longitude: 0,
      latitude: 0,
    },
  },
  description: {
    type: String,
    required: true,
  },
  siteImages: [
    {
      type: String,
      required: true,
    },
  ],
  isVerified: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("report", Report);
