const mongoose = require("mongoose");

// Schema definition
const Schema = mongoose.Schema;

const TransactionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    dateOfpuchase: {
      type: Date,
    },
    model: {
      type: String,
      required: true,
    },
    purchasePrice: {
      type: String,
      // required: true,
    },
    warrantyDays: {
      type: Date,
      default:Date.now()
    },
    points: {
      type: String,
      required: true,
    },
    couponCode: {
      type: String,
      required: true,
      unique: true
    },
    partNumber: {
      type: String,
      required: true,
    },
    customerId: {
      type:String,
      required: true,
    },
    billImage: {
      type: String,
    },
    // WarrantyImage: {
    //   type: String,
    // },
    latitude: {
      type: String,
      // required: true,
    },
    longitude: {
      type: String,
      // required: true,
    },
    comment: {
      type: String,
      // required: true,
    },
    ip: {
      type: String,
    },
    invoiceURL: {
      type: String,
    },
    district:{
      type: String,
      required: true,
  },
   city:{
      type: String,
      required: true,
  },
   state:{
      type: String,
      required: true,
  },
   pincode:{
      type: String,
      required: true,
  },
  address:{
    type: String,
    required: true,
},

  },
  { timestamps: true }
);

const TransactionModel = mongoose.model("transactions", TransactionSchema);

module.exports = TransactionModel;
