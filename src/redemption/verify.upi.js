const { UserModel, VendorApiModel } = require("../../database/index.model");
const axios = require("axios")
const { UPI_TOKEN, UPI_VERIFY_URL } = require("../../config/config")

async function verifyUpi(req, res, next) {
  try {
    const { upi } = req.body;
    const { mobile } = req.user;

    if (!upi || typeof upi !== "string") {
      throw new Error("UPI is required and must be a string.");
    }

    const responseData = await checkValidation(upi);
    
    if (
      responseData &&
      responseData.success === true &&
      responseData.status_code === 200
    ) {
      await UserModel.findOneAndUpdate({ mobile }, { $set: { upi } });
      return res.json({
        code: 200,
        message: "UPI is valid.",
        response: responseData.data,
      });
    } else {
      throw new Error("Wrong UPI provided");
    }
  } catch (error) {
    next(error);
  }
}


async function checkValidation(upi) {
  let body = { upi_id: upi };
  let config = { headers: { Authorization: `Bearer ${UPI_TOKEN}` } };
  let data = new VendorApiModel({ request: body, vendor: UPI_VERIFY_URL })
  

  return await axios
    .post(UPI_VERIFY_URL, body, config)
    .then(async (response) => {
      data.response = response.data
      data.success = Boolean(response.data.status) || false;
      await data.save();
      return response.data
    })
    .catch(async (error) => {
      if (error?.response) {
        data.response = error?.response?.data
        await data.save();
        throw {
          message:"Invalid UPI ID",
          statusCode:400
        }
      } else if (error?.request) {
        data.response = error.request
        await data.save();
        throw error.request
      } else {
        data.response = error.message
        await data.save();
        throw error
      }
    });
}

module.exports = {
  verifyUpi,
  checkValidation
};
