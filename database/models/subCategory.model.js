const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SubCategorySchema = new Schema({
    subCategoryName: {
        type: String,
        required: true,
    },
    description:{
        type:String,
        required:true
    },
    isActive: {
        type: String,
        required: true,
    },
    fileUrl:{
        type:String
    },
    categoryId:{
        type:Schema.Types.ObjectId,
        ref:'CategoryModel',
        required:true
    }
    
}, { timestamps: true });

const SubCategoryModel = mongoose.model("warr_utsav_sub_categories", SubCategorySchema);

module.exports = SubCategoryModel;
