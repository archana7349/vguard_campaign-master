const { OtpModel } = require("../../database/index.model");
const { sendSMS } = require("../../helper/sms.service");

async function sendOTP(req, res, next) {
  try {
    let { mobile } = req.body;
    mobile = String(mobile).trim();

    if (!mobile) {
      throw new Error("Please enter a phone number.");
    }

    if (!mobile.match(/^[6789]\d{9}$/)) {
      throw new Error("Please enter a valid 10-digit phone number.");
    }

    if (mobile.length < 10) {
      throw new Error("Mobile number should not be less than 10 digits.");
    }

    await OtpModel.updateMany({ mobile }, { $set: { active: false } });

    const OTP = Math.floor(100000 + Math.random() * 900000);

    const result = await sendSMS(mobile, OTP);

    if (!result.status === 'success') throw new Error('Unable to send SMS')
    const otpUser = new OtpModel({
      mobile: mobile,
      otp: OTP,
    });
    await otpUser.save();

    return res.json({
      status: 200,
      message: "OTP sent successfully. OTP will be valid for next 5mins",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  sendOTP,
};
