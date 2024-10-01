const { default: mongoose } = require("mongoose");
const { RedemptionModel, UserModel } = require("../../database/index.model");

const processRedeemRequest = async (req, res) => {

  try {
    const requestList = req.body;
    let responseList = [];
    if (!Array.isArray(requestList)) {
      throw {
        customMessage: "Invalid redemption list",
        code: 400,
      };
    }
    if (requestList.length < 1) {
      throw {
        customMessage: "Redemption list cannot be empty",
        code: 400,
      };
    }

    for await (let tran of requestList) {
      if (!mongoose.Types.ObjectId.isValid(tran?.transactionId)) {
        responseList.push({
          amount:tran?.amount,
          upiId:tran?.upiId,
          name:tran?.name,
          message: "Unprocessable Redemption",
        });
        continue;
      }

      const transactionData = await RedemptionModel.findOne({
        _id: tran?.transactionId,
      });

      if (!transactionData) {
        responseList.push({
          amount:tran?.amount,
          upiId:tran?.upiId,
          name:tran?.name,
          message: "Redemption not found",
        });
        continue;
      }

      const isBlock = await UserModel.findOne({mobile:transactionData?.mobile});

      if(isBlock?.block){
        responseList.push({
          amount:tran?.amount,
          upiId:tran?.upiId,
          name:tran?.name,
          status:"Failed",
          message: "Redemption is currently unavailable for this account",
        });
        continue;
      }

      if (transactionData?.status != "Pending") {
        responseList.push({
          amount:tran?.amount,
          upiId:tran?.upiId,
          name:tran?.name,
          message: `Request is already been ${
            transactionData?.status || "processed"
          }`,
        });
      }

      if (tran?.status == "Approved") {
        const updatedTransaction = await RedemptionModel.updateOne(
          {
            _id: tran?.transactionId,
            status: "Pending",
          },
          {
            $set: {
              status: tran?.status,
              comment: tran?.comment || "",
              updatedOn: Date.now(),
              updatedBy: req?.user?.mobile,
            },
          }
        );

        if (
          updatedTransaction?.matchedCount &&
          updatedTransaction?.modifiedCount
        ) {
          responseList.push({
            amount:transactionData?.amount,
            upiId:transactionData?.upiId,
            name:tran?.name,
            status: tran?.status,
            message: `Success`,
          });
        }
      }

      if (tran?.status == "Rejected") {
        const updatedTransaction = await RedemptionModel.updateOne(
          {
            _id: tran?.transactionId,
            status: "Pending",
          },
          {
            $set: {
              status: tran?.status,
              comment: tran?.comment || "",
              updatedOn: Date.now(),
              updatedBy: req?.user?.mobile,
            },
          }
        );

        if (
          updatedTransaction?.matchedCount &&
          updatedTransaction?.modifiedCount
        ) {
          await UserModel.updateOne(
            { mobile: transactionData?.mobile },
            {
              $inc: {
                point_redeemed: -Number(transactionData?.amount) || 0,
              },
            }
          );

          responseList.push({
            amount:transactionData?.amount,
            upiId:transactionData?.upiId,
            name:tran?.name,
            status: tran?.status,
            message: `Success`,
          });
        }
      }
    }
    return res.json({
        message:"Status updated sucessfully",
        code:200,
        responseList
    })
  } catch (err) {Redemption
    console.log("error",err)
    return res.json({
      message: err?.customMessage || "Something went wrong, Please try again",
      code: err?.customCode || 500,
      error: !err?.customMessage && err?.message,
    });
  }
};

module.exports = {
  processRedeemRequest
}