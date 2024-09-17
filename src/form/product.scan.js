const {
  CouponModel,
  FormModel,
  VendorApiModel,
  UserModel,
  CustomerModel,
  PincodeModel,
} = require("../../database/index.model");
const { getMMDDYYYYDate } = require("../../utils/date");
const { validateCouponCode } = require("./validateCoupon");
const sax = require("sax");
const moment = require("moment");
const { formSMS } = require("../../helper/sms.service");

const productScan = async (req, res) => {
  try {
    const triggeredIp = req.headers["x-forwarded-for"] || "0.0.0.0";
    if (
      !req.body?.couponCode ||
      !req.body?.name ||
      !req.body?.email ||
      !req.body?.pincode ||
      !req.body?.city ||
      !req.body?.scratchCode ||
      isNaN(req.body?.pincode)
    ) {
      throw {
        customMessage: "Please fill all mandatory fields",
        customCode: 400,
      };
    }

    const address = await PincodeModel.findOne({
      pincode: Number(req.body?.pincode),
      cityName: req.body?.city,
    });

    await CustomerModel.findOneAndUpdate(
      {
        mobile: req.user?.mobile,
      },
      {
        name: req.body?.name,
        email: req.body?.email,
        pincode: address?.pincode || "",
        city: address?.city || "",
        scratchCode: req.body?.scratchCode,
        state: address?.state || "",
        district: address?.district || "",
        address: address?.city || "",
      },
      {
        upsert: true,
      }
    );

    let getValidateCouponCode = await validateCouponCode(req);
    let getValidateScratchCode = await validateScratchCode(req);

    // return res.json({getValidateCouponCode,d:moment().add(getValidateCouponCode?.warrantyDays,'days').toDate()})
    if (
      getValidateCouponCode?.customFlag &&
      getValidateScratchCode?.customFlag
    ) {
      const claimForm = new FormModel({
        name: req.body?.name,
        mobile: req.user?.mobile,
        email: req.body?.email,
        pincode: address?.pincode || "",
        city: address?.city || "",
        scratchCode: req.body?.scratchCode,
        couponCode: req.body?.couponCode,
        state: address?.state || "",
        district: address?.district || "",
        address: address?.city || "",
        customerId: req.user?.mobile,
        partNumber: getValidateCouponCode?.partNumber,
        warrantyDays: moment()
          .add(getValidateCouponCode?.warrantyDays, "days")
          .toDate(),
        ip:triggeredIp
      });

      let claimedFlag = await CouponModel.updateOne(
        { coupon: req.body?.scratchCode, claimed: false },
        {
          $set: {
            claimed: true,
            claimedOn: Date.now(),
            claimedBy: req.user?.mobile,
          },
        }
      );

      if (claimedFlag.matchedCount && claimedFlag.modifiedCount) {
        await claimForm.save();
        await UserModel.findOneAndUpdate(
          { mobile: req.user?.mobile },
          { $inc: { points_earned: Number(getValidateScratchCode?.value) || 0 } }
        );
        formSMS(req.user?.mobile, getValidateScratchCode?.value)
      } else {
        throw {
          customMessage: "Scratch code has already been used",
          customCode: 422,
        };
      }

      let crmData = {
        pinCode: address?.pincode,
        district: address?.district,
        city: address?.city,
        state: address?.state,
        email: req.body?.name,
        alternateNo: req.user?.mobile,
        contactNo: req.user?.mobile,
        copuonCode: req.body?.couponCode,
        name: req.body?.name,
        skuDetail: getValidateCouponCode?.partNumber,
      };

      siebelCrmSync(crmData);

      return res.json({
        message: "Points claimed sucessfully",
        code: 200,
        redeemed_points: Number(getValidateScratchCode?.value) || 0,
      });
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

const validateScratchCode = async (req) => {
  const checkCoupon = await CouponModel.findOne({
    coupon: req.body?.scratchCode,
  });

  if (!checkCoupon) {
    throw {
      customMessage: "Invalid scratch code, please provide valid scratch code",
      customCode: 400,
    };
  }
  if (checkCoupon.claimed) {
    throw {
      customMessage: "Scratch code has already been used",
      customCode: 400,
    };
  }
  checkCoupon.customFlag = true;
  return checkCoupon;
};

const siebelCrmSync = async (crmData) => {
  const log = new VendorApiModel({
    request: crmData,
  });

  try {
    let resLogData = await callProdInstallCrmApi(crmData);
    log.response = resLogData;
  } catch (err) {
    log.response = err;
  }

  await log.save();
};

const callProdInstallCrmApi = async (rcd) => {
  let status = {};
  const soapbody = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://siebel.com/webservices" xmlns:cus="http://siebel.com/CustomUI">
    <soapenv:Header>
      <ws:UsernameToken>RISHTAUSER</ws:UsernameToken>
      <ws:PasswordText>RISHTAUSER$CRM</ws:PasswordText>
      <ws:SessionType>None</ws:SessionType>
    </soapenv:Header>
  <soapenv:Body>
    <cus:AndroidSR_1_Input>
      <cus:vMsg/>
      <cus:vAcPostCd>${rcd.pinCode ?? ""}</cus:vAcPostCd>
      <cus:vSRDesc>Installtion Request</cus:vSRDesc>
      <cus:vAcDistrict>${rcd.district ?? ""}</cus:vAcDistrict>
      <cus:vAcCountry>India</cus:vAcCountry>
      <cus:vAcCity>${rcd.city ?? ""}</cus:vAcCity>
      <cus:Process_spcInstance_spcId/>
      <cus:xPrimLang>English</cus:xPrimLang>
      <cus:xCount/>
      <cus:vAcState>${rcd.state ?? ""}</cus:vAcState>
      <cus:xModelId/>
      <cus:vSRProdCat/>
      <cus:vAcEmail>${rcd.email ?? ""}</cus:vAcEmail>
      <cus:xWarrantyProof>Bill</cus:xWarrantyProof>
      <cus:vPurchaseChannel>Traditional</cus:vPurchaseChannel>
      <cus:xPurchaseDate>${getMMDDYYYYDate()}</cus:xPurchaseDate>
      <cus:vDealerSMS/>
      <cus:vAcId/>
      <cus:Object_spcId>1-BHCL</cus:Object_spcId>
      <cus:xWarrantyEndDt/>
      <cus:xAltMob>${rcd.alternateNo ?? ""}</cus:xAltMob>
      <cus:vAcMobile>${rcd.contactNo ?? ""}</cus:vAcMobile>
      <cus:Siebel_spcOperation_spcObject_spcId/>
      <cus:xSerialNum>${rcd.copuonCode ?? ""}</cus:xSerialNum>
      <cus:xCase/>
      <cus:vAcName>${rcd.name ?? ""}</cus:vAcName>
      <cus:vAcAddress>${rcd.city}</cus:vAcAddress>
      <cus:xWarrantyDayLeft/>
      <cus:vAssetId/>
      <cus:xSRNumber/>
      <cus:xExtendedWarranty/>
      <cus:xSerialId/>
      <cus:xAccountType/>
      <cus:xClosureCode/>
      <cus:vSubPurchaseChannel/>
      <cus:Error_spcCode/>
      <cus:vSRType>Installation</cus:vSRType>
      <cus:vAssetModel>${rcd.skuDetail ?? ""}</cus:vAssetModel>
      <cus:Error_spcMessage/>
    </cus:AndroidSR_1_Input>
  </soapenv:Body>
</soapenv:Envelope>`;
  const POST_URL = process.env.POST_URL;

  const soapaction = `"document/http://siebel.com/CustomUI:AndroidSR_1"`;
  let responseText = "";
  try {
    const response = await fetch(POST_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/xml",
        Accept: "*/*",
        soapaction: `${soapaction}`,
      },
      body: soapbody,
    });
    if (!response.ok) {
      status.message = `API Error: ${response.status}`;
    }

    responseText = await response.text();
    const saxStream = sax.createStream(true);
    let nodeName = "";

    saxStream.on("opentag", (node) => {
      nodeName = node.name;
    });

    saxStream.on("text", (text) => {
      if (nodeName === "ns:vMsg") {
        status.message = text;
      }
      if (nodeName === "ns:Error_spcMessage") {
        status.prodRegErrorMsg = text;
      }
    });

    saxStream.on("error", (e) => {
      status.code = response.status;
      status.message = `API Error: ${e.message}`;
    });
    saxStream.write(responseText);
    status.code = response.status;
  } catch (error) {
    console.log(error);
    throw error;
  }
  return status;
};

module.exports = {
  productScan,
};
