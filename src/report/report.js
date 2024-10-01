const { title } = require("process");
const {
  CallbackModel,
  CouponModel,
 TransactionModel,
  OtpModel,
  RedemptionModel,
  UserModel,
  VendorApiModel,
} = require("../../database/index.model");
const createxlsx = require("../../helper/excel.service");

async function generateReport(req, res, next) {
  try {
    const reportType = req.params.type;

    let {
      page = 1,
      pageSize = 10,
      type = "json",
      max = false,
      secret,
    } = req.query;

    if (max) {
      page = 0;
      pageSize = 0;
    }

    let reportData;

    switch (reportType) {
      case "otp-success":
        console.log("OTP report")
        reportData = await otpSuccessReport(page, pageSize);
        break;
      case "otp-failure":
        console.log("OTP Failed")
        reportData = await otpFailureReport(page, pageSize);
        break;
      case "otp-active":
        console.log("Active")
        reportData = await otpActiveReport(page, pageSize);
        break;
      case "login-success":
        console.log("Successfully logged in")
        reportData = await loginSuccessReport(page, pageSize);
        break;
      case "users":
        reportData = await usersReport(page, pageSize);
        break;
        console.log("users report")
      case "payout":
        reportData = await payoutReport(page, pageSize,req);
        break;
      case "coupon-claimed":
        reportData = await couponClaimed(page, pageSize);
        break;
      case "slogan":
        reportData = await sloganReport(page, pageSize);
        break;
      case "redemption-request":
        reportData = await redemptionRequest(page, pageSize,req);
        break;
      default:
        console.log("undefined")
        throw new Error("Invalid report requested.");
    }
    if (type == "xlsx") {
      const { paginatedData } = reportData;
      let buffer_xlsxdata = await createxlsx(
        `REPORT - ${reportType}`,
        paginatedData
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${reportType}_${Date.now()}.xlsx`
      );
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      return res.send(buffer_xlsxdata);
    }
    return res.json({ status: 200, ...reportData });
  } catch (error) {
    next(error);
  }
}

const otpSuccessReport = async (page, pageSize) => {
  try {
    const query = { verified: true, active: false };
    const dataRestrict = { mobile: 1, otp: 1, createdAt: 1, _id: 0 };
    const startIndex = (page - 1) * pageSize;

    const totalCount = await OtpModel.countDocuments(query);
    const paginatedData = await OtpModel.find(query, dataRestrict)
      .sort({ _id: -1 })
      .skip(startIndex)
      .limit(pageSize);
    if (totalCount == 0) throw new Error("No result found.");
    return {
      totalCount,
      paginatedData,
    };
  } catch (error) {
    throw error;
  }
};

const otpFailureReport = async (page, pageSize) => {
  try {
    const query = { verified: false, active: false };
    const dataRestrict = { mobile: 1, otp: 1, createdAt: 1, _id: 0 };
    const startIndex = (page - 1) * pageSize;

    const totalCount = await OtpModel.countDocuments(query);
    const paginatedData = await OtpModel.find(query, dataRestrict)
      .sort({ _id: -1 })
      .skip(startIndex)
      .limit(pageSize);
    if (totalCount == 0) throw new Error("No result found.");

    return {
      totalCount,
      paginatedData,
    };
  } catch (error) {
    throw error;
  }
};

const otpActiveReport = async (page, pageSize) => {
  try {
    const query = { verified: false, expiresAt: { $gte: new Date() } };
    const dataRestrict = { mobile: 1, otp: 1, createdAt: 1, _id: 0 };
    const startIndex = (page - 1) * pageSize;
    const totalCount = await OtpModel.countDocuments(query);
    const paginatedData = await OtpModel.find(query, dataRestrict)
      .sort({ _id: -1 })
      .skip(startIndex)
      .limit(pageSize);

    if (totalCount == 0) throw new Error("No result found.");

    return {
      totalCount,
      paginatedData,
    };
  } catch (error) {
    throw error;
  }
};

const loginSuccessReport = async (page, pageSize) => {
  try {
    const query = {};
    const dataRestrict = {
      mobile: 1,
      ip: 1,
      createdAt: 1,
      updatedAt: 1,
      _id: 0,
    };
    const startIndex = (page - 1) * pageSize;
    const totalCount = await UserModel.countDocuments(query);
    const paginatedData = await UserModel.find(query, dataRestrict)
      .sort({ _id: -1 })
      .skip(startIndex)
      .limit(pageSize);

    if (totalCount == 0) throw new Error("No result found.");

    return {
      totalCount,
      paginatedData,
    };
  } catch (error) {
    throw error;
  }
};

const usersReport = async (page, pageSize) => {
  try {
    const query = {};
    const dataRestrict = { __v: 0, token: 0, _id: 0 };
    const startIndex = (page - 1) * pageSize;
    const totalCount = await UserModel.countDocuments(query);
    const paginatedData = await UserModel.find(query, dataRestrict)
      .sort({ _id: -1 })
      .skip(startIndex)
      .limit(pageSize);

    if (totalCount == 0) throw new Error("No result found.");

    return {
      totalCount,
      paginatedData,
    };
  } catch (error) {
    throw error;
  }
};

const couponClaimed = async (page, pageSize) => {
  try {
    const query = { claimed: true };
    const dataRestrict = {
      __v: 0,
      _id: 0,
      createdAt: 0,
      updatedAt: 0,
      branch: 0,
      outlet: 0,
      bonus: 0,
    };
    const startIndex = (page - 1) * pageSize;
    const totalCount = await CouponModel.countDocuments(query);
    const paginatedData = await CouponModel.aggregate([
      {
        $match: query
      },
      {
       $lookup: {
         from: "claims",
         localField: "coupon",
         foreignField: "scratchCode",
         as: 'result'
       },
      },
      {
        $unwind: '$result'
      },
      {
        $sort: {
          _id:-1
        }
      },
      {
        $skip: startIndex || 0
      },
      {
        $limit: Number(pageSize) || totalCount
      },
      {
        $project:{
          series:'$bookletNo',
          coupon:"$coupon",
          couponCode:"$result.couponCode",
          value:1,
          model:1,
          claimed:1,
          claimedOn:1,
          updatedAt:1
        }
      }
    ])

    if (totalCount == 0) throw new Error("No result found.");

    return {
      totalCount,
      paginatedData,
    };
  } catch (error) {
    throw error;
  }
};

const payoutReport = async (page, pageSize,req) => {
  try {    
    const query = {
      status: req?.query?.status ? req?.query?.status : { $in: ["Approved", "Rejected"] },
      mobile: { $regex: `${req?.query?.mobileNo || ""}`, $options: "i" },
    };
    console.log(query)
    const dataRestrict = { __v: 0, _id: 0, createdAt: 0, updatedAt: 0 };
    const startIndex = (page - 1) * pageSize;
    const totalCount = await RedemptionModel.countDocuments(query);
    const paginatedData = await RedemptionModel.find(query, dataRestrict)
      .sort({ _id: -1 })
      .skip(startIndex)
      .limit(pageSize);

    if (totalCount == 0) throw new Error("No result found.");

    return {
      totalCount,
      paginatedData,
    };
  } catch (error) {
    throw error;
  }
};

const sloganReport = async (page, pageSize) => {
  try {
    const query = {};
    const dataRestrict = { __v: 0, _id: 0, createdAt: 0, updatedAt: 0, partDetails:0 };
    const startIndex = (page - 1) * pageSize;
    const totalCount = await TransactionModel.countDocuments(query);
    const paginatedData = await TransactionModel.aggregate([
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $limit: Number(pageSize) || totalCount,
      },
      {
        $skip: startIndex || 0,
      },
      {
        $lookup: {
          from: "coupons",
          localField: "scratchCode",
          foreignField: "coupon",
          as: "valueOfCoupon",
        },
      },
      {
        $unwind: {
          path: "$valueOfCoupon",
        },
      },
      {
        $lookup: {
          from: "partmasters",
          let: {
            partNumberLocal: {
              $toInt: "$partNumber",
            },
          },
          pipeline: [
            {
              $addFields: {
                partNumberInt: {
                  $toInt: "$partNumber",
                },
              },
            },
            {
              $match: {
                $expr: {
                  $eq: ["$partNumberInt", "$$partNumberLocal"],
                },
              },
            },
          ],
          as: "partDetails",
        },
      },
      {
        $unwind: {
          path: "$partDetails",
        },
      },
      {
        $addFields: {
          valueOfCoupon: { $ifNull: ["$valueOfCoupon.value", ""] },
          seriesOfCoupon: { $ifNull: ["$valueOfCoupon.bookletNo", ""] },
          branchOfCoupon: { $ifNull: ["$valueOfCoupon.branch", ""] },
          outletOfCoupon: { $ifNull: ["$valueOfCoupon.outlet", ""] },
          dateOfpuchase: { $ifNull: ["$valueOfCoupon.claimedOn", ""] },
          model: { $ifNull: ["$partDetails.partDescription", ""] },
          partNumber: { $ifNull: ["$partDetails.partNumber", ""] },
        },
      },
      {
        $project: dataRestrict,
      },
    ]);

    if (totalCount == 0) throw new Error("No result found.");

    return {
      totalCount,
      paginatedData,
    };
  } catch (error) {
    throw error;
  }
};

const redemptionRequest = async (page, pageSize, req) => {
  try {
    const query = {
      status: "Pending",
      mobile: { $regex: `${req?.query?.mobileNo || ""}`, $options: "i" },
    };
    const startIndex = Math.abs((page - 1) * pageSize);
    const totalCount = await RedemptionModel.countDocuments(query);
    console.log(startIndex, totalCount, pageSize);
    const paginatedData = await RedemptionModel.aggregate([
      {
        $match: query,
      },
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $lookup: {
          from: "customers",
          localField: "mobile",
          foreignField: "mobile",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $limit: Number(pageSize) || totalCount,
      },
      {
        $skip: startIndex || 0,
      },
      {
        $project: {
          name: { $ifNull: ["$user.name", ""] },
          mobile: { $ifNull: ["$mobile", ""] },
          upiId: { $ifNull: ["$upiId", ""] },
          createdAt: { $ifNull: ["$transactedOn", ""] },
          amount: { $ifNull: ["$amount", ""] },
          email: { $ifNull: ["$user.email", ""] },
        },
      },
    ]);

    if (totalCount == 0) throw new Error("No result found.");

    return {
      totalCount,
      paginatedData,
    };
  } catch (error) {
    throw error;
  }
};
module.exports = {
  generateReport,
};
