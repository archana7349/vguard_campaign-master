const mongoose = require("mongoose");

// Schema definition
const Schema = mongoose.Schema;

const FormSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    mobile: {
      type: String,
      required: true,
    },
    // dateOfpuchase: {
    //   type: Date,
    //   required: true,
    // },
    // model: {
    //   type: String,
    //   required: true,
    // },
    purchasePrice: {
      type: String,
      // required: true,
    },
    // warrantyDays: {
    //   type: Date,
    // },
    points: {
      type: String,
      reuired: true,
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

const FormModel = mongoose.model("Claims", FormSchema);

module.exports = FormModel;
