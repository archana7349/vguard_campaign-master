const { default: axios } = require("axios");
const { validCouponCode } = require("../../utils/regex");
const { PartMasterModel, TransactionModel } = require("../../database/index.model");

const validateCoupon = async (req, res) => {
  try {
    let getValidateCouponCode = await validateCouponCode(req);
    if (getValidateCouponCode.customFlag) {
      return res.json({ message: "Please register the warranty", code: 200 });
    } else {
      return res.json({
        message: "Something went wrong, please try again",
        code: 500,
      });
    }
  } catch (err) {
    return res.json({
      message: err?.customMessage || "Something went wrong, Please try again",
      code: err?.customCode || 500,
      error: err?.message || "",
    });
  }
};

const validateCouponCode = async (req) => {
  if (
    !process.env.ESEAL_MODULE_ID ||
    !process.env.ESEAL_ACCESS_TOKEN ||
    !process.env.ESEAL_VENDOR_TOKEN || 
    !process.env.ESEAL_URL
  ) {
    throw { customMessage: "Service unavailable", customCode: 503 };
  }
 
  if (!req.body.couponCode) {
    throw { customMessage: "Please enter the coupon code", customCode: 400 };
  }

  if (!validCouponCode(req.body.couponCode)) {
    throw {
      customMessage: "Please enter the valid coupon code",
      customCode: 400,
    };
  }

  const payload = {
     module_id: process.env.ESEAL_MODULE_ID,
    access_token: process.env.ESEAL_ACCESS_TOKEN,
    iot: req.body.couponCode,
    vendor_token: process.env.ESEAL_VENDOR_TOKEN,
  };

  const esealPartDetails = await axios.post(process.env.ESEAL_URL, payload);
  if (esealPartDetails?.data?.Status != 1) {
    if (esealPartDetails?.data?.Data?.length === 0) {
      throw {
        customMessage: "Invalid Coupon, Please provide valid coupon code",
        customCode: 400,
      };
    }

    throw {
      customMessage: "Internal server issue, Please try again",
      customCode: 403,
    };
  }

  console.log(esealPartDetails?.data)
  let partDetails = await PartMasterModel.findOne({
    partNumber: esealPartDetails?.data?.Data?.Material_Code,
    isActive:true
  }).lean();

  if (!partDetails?.partNumber) {
    throw {
      customMessage: "Product is not eligible for the scheme",
      customCode: 400,
    };
  }

  const checkList = await TransactionModel.find({
    mobile: req.user?.mobile
  });

  const checklist2 = await TransactionModel.findOne({
    couponCode : req.body.couponCode 
  })

  if(checklist2?.couponCode){
    throw {
      customMessage: "Coupon has already been scanned",
      customCode: 422,
    };
  }

  if (
    checkList?.length > 4
  ) {
    throw {
      customMessage: "Scan limit for the product has been reached",
      customCode: 422,
    };
  }
  return {
    ...partDetails,
    customFlag:true
  }
};

module.exports = {
  validateCoupon,
  validateCouponCode,
};
