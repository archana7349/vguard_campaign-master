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
        default:'91'
    },
    sizeDescription:{
        type: String,
        required: true,  
    },
    seriesDescription  :{
        type: String,
        required: true,  
    },
    subSeriesDescription:{
        type: String,
        required: true, 
    },
    subDivision:{
        type: String,
        required: true, 
    },
    positionDescription:{
        type: String,
        required: true,  
    },
    unit:{
        type: String,
        required: true, 
    },
    price:{
        type: String,
        required: true, 
    },
    subSegmentDescription:{
        type: String,
        required: true, 
    }

    
}, { timestamps: true });

const PartMasterModel = mongoose.model("part_masters", PartMasterSchema);

module.exports = PartMasterModel;
