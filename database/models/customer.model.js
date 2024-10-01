const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    mobile:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    updatedAt:{
        type:Date,
        required:true,
        default:Date.now
    },
    alternateMobile:{
        type: String,
    },
    address:{
        type: String,
        required: true,
    },
    landmark:{
        type: String,
        required: true,
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
    }

}, { timestamps: true });

const CustomerModel = mongoose.model("customers", CustomerSchema);

module.exports = CustomerModel;
