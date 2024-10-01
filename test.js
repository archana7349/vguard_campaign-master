// const mongoose = require("mongoose");

const { default: mongoose } = require("mongoose");
const { UserModel, RedemptionModel, PartMasterModel, TransactionModel} = require("./database/index.model");

// const { CouponModel } = require("./database/index.model.js");
const { connection } = require("./database/connection");
const config = require("./config/config.js");
// connection(mongoose, config, {
//   autoIndex: false,
//   connectTimeoutMS: 1000,
// }).connectToMongo();
// const couponadded = async (consad) => {
//   try {
//     consad = new CouponModel({
//       coupon: "X1YZ123",
//       value: "100",
//     });
//     consad.model = "STORAGE";
//     await consad.save();
//     return consad;
//   } catch (error) {
//     throw error;
//   }
// };

// couponadded()
//   .then((c) => console.log(c))
//   .catch((er) => console.log(er));

// -------------------- generating testing new form

// const mongoose = require("mongoose");

// const { TransactionModel} = require("./database/index.model.js");
// const { connection } = require("./database/connection");
// const config = require("./config/config.js");
// connection(mongoose, config, {
//   autoIndex: false,
//   connectTimeoutMS: 1000,
// }).connectToMongo();
// const couponadded = async (consad) => {
//   try {
//     consad = new TransactionModel({
//       name: "Tester",
//       email: "test@gmail.com",
//       mobile: "9606862430",
//       purchasePrice: "1000",
//       scratchCode:"STDU123",
//       warrantyDays: "365",
//       points: "100",
//       couponCode: "1234567890123456",
//       partNumber: "875538",
//       customerId: new mongoose.Types.ObjectId("66a88052d5531c9922e0831e"),
//       billImage: "edvsdd.jpeg",
//       WarrantyImage: "edvsdd.jpeg",
//       latitude: "21.9000",
//       longitude: "64.0003",
//       comment: "Testing",
//       ip: "192.168.29.149",
//     });
//     // consad.model = "STORAGE";
//     await consad.save();
//     return consad;
//   } catch (error) {
//     throw error;
//   }
// };

// couponadded()
//   .then((c) => console.log(c))
//   .catch((er) => console.log(er));

// -------------------- generating testing new Part master
//   const mongoose = require("mongoose");

// const { PartMasterModel } = require("./database/index.model.js");
// const { connection } = require("./database/connection");
// const config = require("./config/config.js");
// connection(mongoose, config, {
//   autoIndex: false,
//   connectTimeoutMS: 1000,
// }).connectToMongo();
// const couponadded = async (consad) => {
//   try {
//     consad = new PartMasterModel({
//       categoryId:"66a880d5edc062695c543c28",
//       subCategoryId:"66a880d5edc062695c543c28",
//       isActive:true,
//       partDescription:"Testing Part Details",
//       partName:"Testing SKU",
//       partNumber:"875538",
//       points:"100",
//     });
//     // consad.model = "STORAGE";
//     await consad.save();
//     return consad;
//   } catch (error) {
//     throw error;
//   }
// };

// couponadded()
//   .then((c) => console.log(c))
//   .catch((er) => console.log(er));

// const { UserModel } = require("./database/index.model");
// const { getMMDDYYYYDate } = require("./utils/date");
// const sax = require("sax");
// let crmData = {
//   pinCode: "560083",
//   district: "Bangalore",
//   city: "Anekal",
//   state: "Karnataka",
//   email: "vs@gmail.com",
//   alternateNo: "9606862430",
//   contactNo: "9606862430",
//   copuonCode: "4561237894651231",
//   name: "TEster",
//   skuDetail:"123456",
// };

// const siebelCrmSync = async (crmData) => {
//   const log = {
//     request: crmData,
//   };

//   try {
//     let resLogData = await callProdInstallCrmApi(crmData);
//     log.response = resLogData;
//   } catch (err) {
//     log.response = err;
//   }

//   console.log(log)
//   // await log.save();
// };

// const callProdInstallCrmApi = async (rcd) => {
//   let status = null;
//   const soapbody = `
//   <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://siebel.com/webservices" xmlns:cus="http://siebel.com/CustomUI">
//     <soapenv:Header>
//       <ws:UsernameToken>RISHTAUSER</ws:UsernameToken>
//       <ws:PasswordText>RISHTAUSER$CRM</ws:PasswordText>
//       <ws:SessionType>None</ws:SessionType>
//     </soapenv:Header>
//   <soapenv:Body>
//     <cus:AndroidSR_1_Input>
//       <cus:vMsg/>
//       <cus:vAcPostCd>${rcd.pinCode ?? ""}</cus:vAcPostCd>
//       <cus:vSRDesc>Installtion Request</cus:vSRDesc>
//       <cus:vAcDistrict>${rcd.district ?? ""}</cus:vAcDistrict>
//       <cus:vAcCountry>India</cus:vAcCountry>
//       <cus:vAcCity>${rcd.city ?? ""}</cus:vAcCity>
//       <cus:Process_spcInstance_spcId/>
//       <cus:xPrimLang>English</cus:xPrimLang>
//       <cus:xCount/>
//       <cus:vAcState>${rcd.state ?? ""}</cus:vAcState>
//       <cus:xModelId/>
//       <cus:vSRProdCat/>
//       <cus:vAcEmail>${rcd.email ?? ""}</cus:vAcEmail>
//       <cus:xWarrantyProof>Bill</cus:xWarrantyProof>
//       <cus:vPurchaseChannel>Traditional</cus:vPurchaseChannel>
//       <cus:xPurchaseDate>${getMMDDYYYYDate()}</cus:xPurchaseDate>
//       <cus:vDealerSMS/>
//       <cus:vAcId/>
//       <cus:Object_spcId>1-BHCL</cus:Object_spcId>
//       <cus:xWarrantyEndDt/>
//       <cus:xAltMob>${rcd.alternateNo ?? ""}</cus:xAltMob>
//       <cus:vAcMobile>${rcd.contactNo ?? ""}</cus:vAcMobile>
//       <cus:Siebel_spcOperation_spcObject_spcId/>
//       <cus:xSerialNum>${rcd.copuonCode ?? ""}</cus:xSerialNum>
//       <cus:xCase/>
//       <cus:vAcName>${rcd.name ?? ""}</cus:vAcName>
//       <cus:vAcAddress>${rcd.city}</cus:vAcAddress>
//       <cus:xWarrantyDayLeft/>
//       <cus:vAssetId/>
//       <cus:xSRNumber/>
//       <cus:xExtendedWarranty/>
//       <cus:xSerialId/>
//       <cus:xAccountType/>
//       <cus:xClosureCode/>
//       <cus:vSubPurchaseChannel/>
//       <cus:Error_spcCode/>
//       <cus:vSRType>Installation</cus:vSRType>
//       <cus:vAssetModel>${rcd.skuDetail ?? ""}</cus:vAssetModel>
//       <cus:Error_spcMessage/>
//     </cus:AndroidSR_1_Input>
//   </soapenv:Body>
// </soapenv:Envelope>`;
//   const POST_URL = process.env.POST_URL;

//   const soapaction = `"document/http://siebel.com/CustomUI:AndroidSR_1"`;
//   let responseText = "";
//   try {
//     const response = await fetch(POST_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/xml",
//         Accept: "*/*",
//         soapaction: `${soapaction}`,
//       },
//       body: soapbody,
//     });
//     if (!response.ok) {
//       status.message = `API Error: ${response.status}`;
//     }

//     responseText = await response.text();
//     const saxStream = sax.createStream(true);
//     let nodeName = "";

//     saxStream.on("opentag", (node) => {
//       nodeName = node.name;
//     });

//     saxStream.on("text", (text) => {
//       if (nodeName === "ns:vMsg") {
//         status.message = text;
//       }
//       if (nodeName === "ns:Error_spcMessage") {
//         status.prodRegErrorMsg = text;
//       }
//     });

//     saxStream.on("error", (e) => {
//       status.code = response.status;
//       status.message = `API Error: ${e.message}`;
//     });
//     saxStream.write(responseText);
//     status.code = response.status;
//   } catch (error) {
//     console.log(error,"fsdidjcbhhbchds")
//     throw new Error("Error parsing XML");
//   }
//   return status;
// };

// // siebelCrmSync(crmData).then(res=>console.log(res)).catch(err=>console.log(err));

// console.log(process.env.POST_URL)

// const test = async () => {
//   try {
//     connection(mongoose, config, {
//   autoIndex: false,
//   connectTimeoutMS: 1000,
// }).connectToMongo();
//     let d = await UserModel.updateOne(
//       { mobile: "9606862430" },
//       { $inc: { point_redeemed: Number("100") } }
//     );
//     console.log(d);
//   } catch (error) {
//     console.log(error);
//   }
// };
// test();

// const test = async () => {
//   try {
//     connection(mongoose, config, {
//       autoIndex: false,
//       connectTimeoutMS: 1000,
//     }).connectToMongo();
//     let d = await PartMasterModel.find(
//       {  },
//       {
//        partNumber:1
//       }
//     );
//     console.log(d.map(ele=>ele?.partNumber))

//   } catch (error) {
//     console.log(error);
//   }
// };
connection(mongoose, config, {
  autoIndex: false,
  connectTimeoutMS: 1000,
}).connectToMongo();
const test = async () => {
  try {
    console.log("sdsc")
    const newForm = new PartMasterModel({
      partNumber: '1106402',
      partDescription: 'Water instant',
      points: '0',
      isActive: true,
      categoryId:new mongoose.Types.ObjectId("66f13819fb585a595bb6d6e8"),
      subCategoryId:new mongoose.Types.ObjectId("66f13889fb585a595bb6d6ec")
    })
    console.log("123cdsc")
    await newForm.save();
    console.log("sdcdscdsc")
  } catch (error) {
    console.log(error)
  }


}

test();
