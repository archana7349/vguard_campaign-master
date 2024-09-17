const fs = require("fs");
const crypto = require("crypto");

const privateKey = process.env.NODE_ENV === 'production' ? fs.readFileSync(
  `${__dirname}\/../config/prod.vouch.key`,
  "utf8"
) : fs.readFileSync(
  `${__dirname}\/../config/sandbox.vouch.key`,
  "utf8"
);
const axios = require("axios");
const { VendorApiModel } = require("../database/index.model");

async function signAndEncode(data) {
  const jsonData = JSON.stringify(data);
  const sign = crypto
    .createSign("SHA256")
    .update(jsonData)
    .sign(privateKey, "hex");
  const base64Signature = Buffer.from(sign, "hex").toString("base64");
  return base64Signature;
}

let createPayout = async ({
  escrow_id,
  amount,
  vpa,
  mobile,
  name,
  apikey,
} = JSON) => {
  try {
    if (!escrow_id) throw new Error("Please provide Escrow ID.");
    if (!amount || Number(amount) < 0)
      throw new Error("Please provide proper amount.");
    escrow_id = String(escrow_id).trim();
    let timestamp = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });
    let data = {
      escrow_id,
      terms_and_conditions_met: true,
      payouts: [
        {
          payout_ref: String(Date.now()),
          amount: Number(amount) || 0,
          payout_mode: "UPI",
          transaction_note: `Pay ${mobile}`,
          payee: {
            user_ref: String(mobile + Date.now()),
            company_name: String(name),
            user_name: String(name),
            user_mobile_number: String(mobile),
          },
          beneficiary: {
            vpa: String(vpa),
          },
        },
      ],
      timestamp,
    };
    data.signature = await signAndEncode(data);
    let requestresponse = new VendorApiModel({
      vendor: "Vouch",
      request: data,
    });
    return await axios
      .post(`${process.env.VOUCH_URI}/v1/escrow/payout`, data, {
        headers: {
          apikey: apikey,
        },
      })
      .then(async (res) => {
        if (res && res?.data && res?.data?.data[0]["status"] == "completed") {
          requestresponse.response = res?.data;
          requestresponse.success = true;
          await requestresponse.save();
          return { payout_ref: data.payouts[0].payout_ref, code: 1 };
        } else if (
          res &&
          res?.data &&
          res?.data?.data[0]["status"] == "processed"
        ) {
          requestresponse.response = res?.data;
          requestresponse.success = true;
          await requestresponse.save();
          return { payout_ref: data.payouts[0].payout_ref, code: 1 };
        } else if (
          res &&
          res?.data &&
          res?.data?.data[0]["status"] == "failed"
        ) {
          requestresponse.response = res?.data;
          requestresponse.success = false;
          await requestresponse.save();
          return { payout_ref: data.payouts[0].payout_ref, code: 2 };
        } else if (res && res?.data && res.data == '<html>\r\n<head><title>504 Gateway Time-out</title></head>\r\n<body>\r\n<center><h1>504 Gateway Time-out</h1></center>\r\n</body>\r\n</html>\r\n') {
          requestresponse.response = res?.data;
          requestresponse.success = true;
          await requestresponse.save();
          return { payout_ref: data.payouts[0].payout_ref, code: 1 };
        } else {
          requestresponse.response = res?.data || res;
          requestresponse.success = false;
          await requestresponse.save();
          return { payout_ref: data.payouts[0].payout_ref, code: 3 };
        }
      })
      .catch(async (err) => {
        if (err && err?.res?.data && err.res.data == '<html>\r\n<head><title>504 Gateway Time-out</title></head>\r\n<body>\r\n<center><h1>504 Gateway Time-out</h1></center>\r\n</body>\r\n</html>\r\n') {
          requestresponse.response = err?.response?.data;
          requestresponse.success = true;
          await requestresponse.save();
          return { payout_ref: data.payouts[0].payout_ref, code: 1 };
        } else if (err && err?.response?.data) {
          requestresponse.response = err?.response?.data;
          requestresponse.success = false;
          await requestresponse.save();
          console.log(requestresponse);
        }
        throw err;
      });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = { createPayout };
