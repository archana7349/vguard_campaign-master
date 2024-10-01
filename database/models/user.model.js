const mongoose = require("mongoose");

// Schema definition
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  mobile: {
    type: String,
    required: true,
    unique: true
  },
  token: {
    type: String,
  },
  points_earned: {
    type: Number,
    default: 0,
  },
  point_redeemed: {
    type: Number,
    default: 0,
  },
  bonus: {
    type: Number,
    default: 0,
  },
  ip: {
    type: String,
  },
  upi: {
    type: String,
  },
  role: {
    type: String,
    default: "user"
  },
  block:{
    type:Boolean,
    default:false
  }
}, { timestamps: true });

UserSchema.virtual("points_balance").get(function () {
  return this.points_earned - this.point_redeemed;
});

UserSchema.set("toJSON", { virtuals: true });

const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;
