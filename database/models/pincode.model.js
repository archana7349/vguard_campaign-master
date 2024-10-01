const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PincodeSchema = new Schema({
    pincode:{
        type: Number,
        required: true,
    },
    city:{
        type:String
    },
    district:{
        type:String
    },
    state:{
        type:String
    },
    cityName:{
        type:String,
    },
    districtName:{
        type:String,
    },
    stateName:{
        type:String,
    }
}, { timestamps: true });

const PincodeModel = mongoose.model("pincode_masters", PincodeSchema);

module.exports = PincodeModel;
