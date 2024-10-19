const mongoose = require("mongoose");

// Schema definition
const Schema = mongoose.Schema;

const RedemptionSchema = new Schema(
  {
    amount: {
      type: String,
      required: true,
    },
    upiId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
    },
    mobile: {
      type: String,
    },
    comment:{
      type:String,
      default:''
    },
    transactedOn: {
      type: Date,
      default: Date.now,
    },
    updatedOn: {
      type: Date,
    },
    updatedBy: {
      type:String,
    }
  },
  { timestamps: true }
);

const RedemptionModel  = mongoose.model("warr_utsav_redemptions", RedemptionSchema);

module.exports =  RedemptionModel;
