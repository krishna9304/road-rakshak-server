const mongoose = require("mongoose");

const News = mongoose.Schema({
  headline: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    required: true,
  },
  timestamp: {
    type: String,
    required: true,
  },
  references: [
    {
      type: String,
      required: false,
    },
  ],
});

module.exports = mongoose.model("news", News);
