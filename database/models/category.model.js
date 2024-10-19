const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    categoryName: {
        type: String,
        required: true,
    },
    description:{
        type:String,
        required:true
    },
    isActive: {
        type: Boolean,
        required: true,
    },
    fileUrl:{
        type:String
    },

}, { timestamps: true });

const CategoryModel = mongoose.model("warr_utsav_categories", CategorySchema);

module.exports = CategoryModel;
