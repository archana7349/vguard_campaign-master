const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const VendorApiSchema = new Schema({
  request: {
    type: Object,
  },
  response: {
    type: Object,
  },
  vendor: {
    type: String,
  },
  success: {
    type: Boolean,
    default: false,
  },
  ip: {
    type: String,
  }
}, { timestamps: true });

const VendorApiModel = mongoose.model("VendorRequest", VendorApiSchema);

module.exports = VendorApiModel;
