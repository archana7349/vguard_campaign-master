const CustomerModel = require("../../database/models/customer.model");
const PincodeModel = require("../../database/models/pincode.model");
const { validPincode } = require("../../utils/regex");

const getCustomerDetails = async (req, res) => {
  try {
    const customerData = await CustomerModel.findOne(
      { mobile: req.user?.mobile },
      { _id: 0, name: 1, mobile: 1, email: 1, pincode: 1, city: 1 }
    );

    if (!customerData) {
      throw {
        customMessage: "Mobile number not found",
        customCode: 422,
      };
    }

    return res.json({
      message: "Data fetched sucessfully",
      code: 200,
      customerData,
    });
  } catch (err) {
    return res.json({
      message: err?.customMessage || "Something went wrong, Please try again",
      code: err?.customCode || 500,
      error: !err?.customMessage && err?.message,
    });
  }
};

const getCitiesByPincode = async (req, res) => {
  try {
    if (!validPincode(req.params.pincode)) {
      throw {
        customMessage: "Please provide valid 6 digit pincode",
        customCode: 400,
      };
    }
    const pincodeData = await PincodeModel.aggregate([
      {
        $match: {
          pincode: Number(req.params.pincode),
        },
      },
      {
        $group: {
          _id: "$pincode",
          cities: {
            $push: {
              cityName: "$cityName",
              id: "$cityId",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          pincode: "$_id",
          cities: "$cities.cityName",
        },
      },
    ]);

    if (!pincodeData || !pincodeData?.length) {
      throw {
        customMessage: "Pincode not found",
        customCode: 422,
      };
    }

    return res.json({
      message: "Data fetched sucessfully",
      code: 200,
      cityDetails: pincodeData?.[0] || {}
    });
  } catch (err) {
    return res.json({
      message: err?.customMessage || "Something went wrong, Please try again",
      code: err?.customCode || 500,
      error: !err?.customMessage && err?.message,
    });
  }
};

module.exports = {
  getCustomerDetails,
  getCitiesByPincode,
};
