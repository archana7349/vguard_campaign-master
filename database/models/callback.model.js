const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CallbackSchema = new Schema({
    callback: {
        type: Object,
    },
    event_type: {
        type: String
    }
}, { timestamps: true });

const CallbackModel = mongoose.model("call_backs", CallbackSchema);

module.exports = CallbackModel;
