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
const { SPECIAL_POINTS_INDEX, MULTIPLE, TRANSACTION_INTERVAL, SPECIAL_POINTS_DETAILS, NORMAL_POINTS } = require("../../config/config");
const AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.S3_REGION
});
const s3 = new AWS.S3();
// const { TRANSACTION_LIMIT, SPECIAL_POINTS } = require("../../config");

const productScan = async (req, res) => {
  try {
    console.log(req.body)
    console.log(req.file)
    const triggeredIp = req.headers["x-forwarded-for"] || "0.0.0.0";
    
    
    if (
      !req.body?.couponCode ||
      !req.body?.name ||
      !req.body?.email ||
      !req.body?.pincode ||
      !req.body?.city ||
      isNaN(req.body?.pincode) ||
      !req.file
    ) {
      throw {
        customMessage: "Please fill all mandatory fields",
        customCode: 400,
      };
    }


    let fileUrl = '';
    if (req.file) {
      const file = req.file;
      const params = {
        Bucket: process.env.S3_BUCKET,
        Key: `${Date.now()}_${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      const uploadResult = await s3.upload(params).promise();
      fileUrl = uploadResult.Location;
      // return res.json({message:"Ok",fileUrl})
    }

    const address = await PincodeModel.findOne({
      pincode: Number(req.body?.pincode),
      cityName: req.body?.city,
    });
    console.log(address, "dfhsafgah");



    await CustomerModel.findOneAndUpdate(
      {
        mobile: req.user?.mobile,
      },
      {
        name: req.body?.name,
        email: req.body?.email,
        pincode: address?.pincode || "",
        city: address?.city || "",
        state: address?.state || "",
        district: address?.district || "",
        address: address?.city || "",
      },
      {
        upsert: true,
      }
    );

    let getValidateCouponCode = await validateCouponCode(req);
    // let getValidateScannerCode = await validateScannerCode(req);
    console.log( getValidateCouponCode.customFlag,"checking getValidateCouponcode fn")

    const getTransactionPoints = await transactionPoints(req);
    console.log(getTransactionPoints, "checking validScannerCode fn")

    if (getTransactionPoints.customFlag && getValidateCouponCode.customFlag) {
      console.log(req.user)
      const claimForm = new FormModel({
        name: req.body?.name,
        mobile: req.user?.mobile,
        email: req.body?.email,
        pincode: address?.pincode || "",
        city: address?.city || "",
        points:getTransactionPoints?.awardedPoints,
        couponCode: req.body?.couponCode,
        state: address?.state || "",
        district: address?.district || "",
        address: address?.city || "",
        customerId: req.user?.mobile,
        partNumber: getValidateCouponCode?.partNumber,
        // warrantyDays: moment().add(validScannerCode?.warrantyDays, "days").toDate(),
        ip: triggeredIp,
        invoiceURL: fileUrl,
      });
      console.log(claimForm)



      // let claimedFlag = await CouponModel.updateOne(
      //   { coupon: req.body?.scannerCode, claimed: false },
      //   {
      //     $set: {
      //       claimed: true,
      //       claimedOn: Date.now(),
      //       claimedBy: req.user?.mobile,
      //     },
      //   }
      // );


      // if (claimedFlag.matchedCount && claimedFlag.modifiedCount) {
      await claimForm.save();
      await UserModel.findOneAndUpdate(
        { mobile: req.user?.mobile },
        { $inc: { points_earned: Number(getTransactionPoints?.awardedPoints) || 0 } }
      );
      formSMS(req.user?.mobile, parseInt?.awardedPoints)
      // } else {
      //   throw {
      //     customMessage: "Scratch code has already been used",
      //     customCode: 422,
      //   };
      // // }

      let crmData = {
        pinCode: address?.pincode,
        district: address?.district,
        city: address?.city,
        state: address?.state,
        email: req.body?.name,
        alternateNo: req.user?.mobile,
        contactNo: req.user?.mobile,
        // copuonCode: req.body?.couponCode,
        name: req.body?.name,
        skuDetail:getTransactionPoints?.partNumber,
      };

      siebelCrmSync(crmData);

      return res.json({
        message: getTransactionPoints.isSpecial ? "Congratulations! Special points earned!" : "Points Earned sucessfully",
        code: 200,
        redeemed_points: Number(getTransactionPoints?.awardedPoints) || 0
      });
    } else {
      return res.json({
        message: "Something went wrong, please try again",
        code: 500,
      });
    }
  }

  catch (err) {
    console.log(err)
    return res.json({
      message: err?.customMessage || "Something went wrong, Please try again",
      code: err?.customCode || 500,
      error: err?.message || "",
    });
  }
};



const transactionPoints = async (req) => {
  const transactionCount = await FormModel.countDocuments({});
  const specialPointsDetails =  SPECIAL_POINTS_DETAILS;
  const transactionInterval = TRANSACTION_INTERVAL;
  
  let currRequest = transactionCount + 1
  let points = NORMAL_POINTS;
  let quotient = Math.floor(currRequest / transactionInterval);
  let deductingValue = quotient * transactionInterval;
  let currentTransactionRequest = currRequest - deductingValue;
  let isSpecial = false;
   
  for (let i in specialPointsDetails) {
    console.log(currentTransactionRequest, i, "Special Check");
    if (currentTransactionRequest == i) {
      points = specialPointsDetails[i];
      isSpecial = true;
      break;
    }
  }

  return {
    isSpecial,
    awardedPoints:points,  
    customFlag: true
  }
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
