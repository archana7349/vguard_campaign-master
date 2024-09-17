const { CouponModel, FormModel, UserModel } = require("../../database/index.model");
const { formSMS } = require("../../helper/sms.service");

async function submitForm(req, res, next) {
  const triggeredIp = req.headers["x-forwarded-for"] || "0.0.0.0";
  let errorcode;
  try {
    let {
      name,
      email,
      mobile,
      dateOfpuchase,
      model,
      purchasePrice,
      scratchCode,
      comment,
    } = req.body;
    if (
      !name ||
      !mobile ||
      !dateOfpuchase ||
      !model ||
      !purchasePrice ||
      !scratchCode ||
      !comment
    ) {
      throw new Error("Please provide required fields.");
    }
    if (String(mobile).trim() != req.user?.mobile) {
      errorcode = new Error("Token did not match with provided mobile.");
      errorcode.code = 404;
      throw errorcode;
    }

    const checkCoupon = await CouponModel.findOne({ coupon: scratchCode, model });
    if (!checkCoupon) {
      errorcode = new Error("No Coupon code found.");
      errorcode.code = 404;
      throw errorcode;
    }
    if (checkCoupon.claimed) {
      errorcode = new Error("Coupon already claimed.");
      errorcode.code = 404;
      throw errorcode;
    }
    const saveForm = new FormModel({
      name: name,
      email: email || "dummy@gmail.com",
      mobile: req.user?.mobile || mobile,
      dateOfpuchase: dateOfpuchase,
      model: model,
      purchasePrice: purchasePrice,
      scratchCode: scratchCode,
      comment: comment,
      ip: triggeredIp,
    });
    await saveForm.save();

    await UserModel.updateOne(
      { mobile },
      { $inc: { points_earned: Number(checkCoupon.value) } }
    );

    await CouponModel.updateOne(
      { coupon: scratchCode },
      {
        $set: {
          claimed: true,
          claimedOn: Date.now(),
          claimedBy: req.user?.mobile || mobile,
        },
      }
    );
    await formSMS(req.user?.mobile || mobile, checkCoupon.value)
    return res.json({
      status: 200,
      message: "Coupon claimed successfully.",
      redeemed_points: checkCoupon.value
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  submitForm,
};
