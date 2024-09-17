const mongoose = require("mongoose");

// Schema definition
const Schema = mongoose.Schema;

const OtpSchema = new Schema({
  mobile: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  attempt: {
    type: Number,
    default: 0,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
  expiresAt: {
    type: Date,
    default: () => Date.now() + 5 * 60 * 1000,
  },
}, { timestamps: true });

// Custom method to update 'attempt' by 1
OtpSchema.methods.incrementAttempt = async function () {
  try {
    const currentDate = new Date();
    if (this.expiresAt <= currentDate) {
      this.active = false;
      await this.save();
      const error = new Error("OTP expired.Please reinitiate otp again.");
      error.code = "OTP_EXPIRED";
      throw error;
    }
    if (this.attempt >= 2) {
      this.active = false;
      await this.save();
      const error = new Error(
        "Max attempt reached. Please reintiate otp again."
      );
      error.code = "MAX_RETRY_REACHED";
      throw error;
    }
    this.attempt += 1;
    await this.save();
    return this;
  } catch (error) {
    throw error;
  }
};

OtpSchema.methods.verifyOTP = async function () {
  try {
    this.verified = true;
    this.active = false;
    this.save();
  } catch (error) {
    throw error;
  }
};

const OtpModel = mongoose.model("OTP", OtpSchema);

module.exports = OtpModel;
