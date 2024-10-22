const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const PartMasterSchema = new Schema({
    partNumber: {
        type: Number,
        required: true,
    },
    partDescription: {
        type: String,
        required: true,
    },
    points: {
        type: String,
        required: true,
        default:'0'
    },
    categoryId: {
        type:Schema.Types.ObjectId,
        ref:'CategoryModel',
        required:true
    },
    subCategoryId: {
        type:Schema.Types.ObjectId,
        ref:'SubCategoryModel',
        required:true
    },
    isActive: {
        type: Boolean,
        default:true,
        required: true,
    },
    warrantyDays: {
        type: String,
        required: true,
        default:'0'
    },
}, { timestamps: true });

const PartMasterModel = mongoose.model("warr_utsav_part_masters", PartMasterSchema);

module.exports = PartMasterModel;
