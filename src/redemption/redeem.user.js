const { UserModel,RedemptionModel } = require("../../database/index.model");
const config = require("../../config/config");
const { createPayout } = require("../../helper/vouch.api");
const { upiSMS } = require("../../helper/sms.service");

async function redeemUPI(req, res, next) {
  try {
    const { amount } = req.body;
    const { mobile } = req.user;

    if (!amount || Number(amount) < 0) throw new Error("Provide valid amount");

    let userDetail = await UserModel.findOne({ mobile });

    if (Number(amount) > Number(userDetail.points_balance))
      throw new Error("Enter amount value is more than available balance");

    await UserModel.updateOne(
      { mobile },
      { $inc: { point_redeemed: Number(amount) } }
    );

    let payout = await createPayout({
      escrow_id: config.VOUCH_WALLET,
      amount: String(amount).trim(),
      vpa: userDetail.upi,
      mobile: mobile,
      name: userDetail.name,
      apikey: config.VOUCH_KEY,
    });
    if (payout.code == 1) {
      const trans = new RedemptionModel({
        mobile,
        status: "success",
        amount: amount,
        payout_ref: payout?.payout_ref
      });
      await trans.save();
      await upiSMS(mobile, amount)
      return res.json({ code: 200, message: "Payout was successfull." });
    } else {
      if (payout.code == 2) {
        const trans = new RedemptionModel({
          mobile,
          status: "failed",
          amount: amount,
          payout_ref: payout?.payout_ref
        });
        await UserModel.updateOne(
          { mobile },
          { $inc: { point_redeemed: -Number(amount) } }
        );
        await trans.save();
      } else {
        const trans = new RedemptionModel({
          mobile,
          status: "pending",
          amount: amount,
          payout_ref: payout?.payout_ref
        });
        await trans.save();
      }
      throw new Error("Redemption failed.");
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  redeemUPI,
};
