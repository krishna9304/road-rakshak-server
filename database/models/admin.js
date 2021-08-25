const mongoose = require("mongoose");

const Admin = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  phoneNo: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("admin", Admin);
