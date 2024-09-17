const mongoose = require("mongoose");

// Schema definition
const Schema = mongoose.Schema;

const CouponSchema = new Schema({
  series: {
    type: String,
  },
  coupon: {
    type: String,
    required: true,
  },
  value: {
    type: String,
  },
  model: {
    type: String,
    required: true,
  },
  claimed: {
    type: Boolean,
    default: false,
  },
  claimedOn: {
    type: Date,
  },
  claimedBy: {
    type: String,
  },
  branch: {
    type: String,
    Default: ''
  },
  outlet: {
    type: String,
    Default: ''
  },
  bonus: {
    type: String,
    Default: ''
  },
  bookletNo:{
    type:Number
  }
}, { timestamps: true });

const CouponModel = mongoose.model("Coupons", CouponSchema);

module.exports = CouponModel;
