const { UserModel,RedemptionModel } = require("../../database/index.model");
const { upiSMS } = require("../../helper/sms.service");

const raiseRedeemRequest = async (req, res) => {
  try {

    const isBlock = await UserModel.findOne({mobile:req.user?.mobile});

    if(isBlock?.block){
      throw {
        customMessage: "Cannot redeem at this moment. Please try again later.",
        customCode: 400,
      };
    }

    if (isNaN(req.body?.amount)) {
      throw {
        customMessage: "Provide valid amount to redeem",
        customCode: 400,
      };
    }

    const userData = await UserModel.findOne({ mobile: req?.user?.mobile });

    if (!userData) {
      throw {
        customMessage: "Mobile number not found",
        customCode: 422,
      };
    }

    if (
      isNaN(userData?.points_balance) ||
      userData?.points_balance < 1 ||
      userData?.points_balance < req.body?.amount
    ) {
      throw {
        customMessage: "Insufficient balance",
        customCode: 400,
      };
    }

    const newTransaction = new RedemptionModel({
      amount: String(req.body?.amount),
      status: "Pending",
      mobile: req?.user?.mobile,
      upiId: userData?.upi,
    });

    const updatedData = await UserModel.updateOne(
      {
        mobile: req?.user?.mobile,
        $expr: { $gte: [{ $subtract: ["$points_earned", "$point_redeemed"] }, Number(req.body?.amount)] }
      },
      {
        $inc: {
          point_redeemed: Number(req.body?.amount),
        },
      }
    );

    if (updatedData.matchedCount && updatedData.modifiedCount) {
      await newTransaction.save();
      upiSMS(req?.user?.mobile, req.body?.amount)
      return res.json({
        message: "Request for Redemption is sucessfully raised",
        code: 200,
      });
    }

    throw {
      customMessage: "Something went wrong, Please try again",
      customCode: 500,
    };
  } catch (err) {
    console.log(err)
    return res.json({
      message: err?.customMessage || "Something went wrong, Please try again",
      code: err?.customCode || 500,
      error: !err?.customMessage ? err?.message : '',
    });
  }
};

module.exports = {
  raiseRedeemRequest,
};
