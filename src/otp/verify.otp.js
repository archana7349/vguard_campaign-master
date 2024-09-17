const { OtpModel, UserModel } = require("../../database/index.model");

const { authService } = require("../../helper/auth.service");

async function verifyOTP(req, res, next) {
  let ip = req.headers["x-forwarded-for"] || "0.0.0.0";
  try {
    let { mobile, otp } = req.body;
    mobile = String(mobile).trim();
    otp = String(otp).trim();

    if (!mobile || !otp) {
      throw new Error("Please provide valid otp or phone number.");
    }

    if (!mobile.match(/^[6789]\d{9}$/)) {
      throw new Error("Please enter a valid 10-digit phone number.");
    }

    if (!otp.match(/^\d{6}$/)) {
      throw new Error("Please enter a valid 6-digit OTP.");
    }

    if (mobile.length < 10) {
      throw new Error("Mobile number should not be less than 10 digits.");
    }

    if (otp.length < 6) {
      throw new Error("OTP number should not be less than 6 digits.");
    }

    let search = await OtpModel.findOne({ mobile, active: true });
    if (!search) {
      const error = new Error("Please reintiate OTP again.");
      error.code = 404;
      throw error;
    }

    if (search && search.otp !== otp) {
      await search.incrementAttempt();
      const error = new Error(
        `Please enter valid OTP again.${3 - search.attempt} attempt left`
      );
      error.code = 400;
      throw error;
    }

    await search.verifyOTP();

    let { generateToken } = authService();

    let user = await UserModel.findOne({ mobile })

    let token = await generateToken({ mobile, ip, role: user?.role || 'user' });

    let uodate = await UserModel.findOneAndUpdate({ mobile }, {
      token, mobile, ip
    }, { upsert: true })

    return res.json({
      status: 200,
      message: "User validated succeeded.",
      user_role: user?.role || 'user',
      token,
    });
  } catch (error) {
    console.log(error)
    next(error);
  }
}

module.exports = {
  verifyOTP,
};
