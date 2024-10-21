const express = require("express");

const { sendOTP } = require("../src/otp/send.otp");
const { verifyOTP } = require("../src/otp/verify.otp");
const { submitForm, } = require("../src/form/user.form");
const { userDetail } = require("../src/user/user.detail.js");
const { verifyUpi } = require("../src/redemption/verify.upi.js");
const { redeemUPI } = require("../src/redemption/redeem.user.js");
const { callback } = require("../src/callback/callback.js");
const { generateReport } = require("../src/report/report.js");

const { authMiddleware, adminMiddleware } = require("../middleware/auth.middleware.js");
const { getBooklet, updateForm } = require("../src/updateForm/update.form.js");
const { validateCoupon } = require("../src/form/validateCoupon.js");
const { productScan } = require("../src/form/product.scan.js");
const { getCustomerDetails, getCitiesByPincode } = require("../src/data-utils/user.details.js");
const { raiseRedeemRequest } = require("../src/redemption/redeem.request.js");
const { processRedeemRequest } = require("../src/redemption/redeem.process.js");
const { testingFn } = require("../src/testing/test.js");
const { userBlockMiddleware } =  require("../middleware/user.block.js");

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { blockFeatureMiddleware } = require("../middleware/block.feature.js");
const upload = multer();




const authRouter = express.Router();

authRouter.post("/send-otp", sendOTP);
authRouter.post("/verify-otp", verifyOTP);
authRouter.get("/check", authMiddleware, (req, res) => res.send("ok"));
authRouter.get("/user", authMiddleware, userBlockMiddleware,userDetail);
authRouter.post("/submit-form", authMiddleware, submitForm);
authRouter.post("/verify-upi", authMiddleware, verifyUpi);
authRouter.post("/redeem", blockFeatureMiddleware,authMiddleware, redeemUPI);
authRouter.post("/callback", callback)
authRouter.get("/report/:type", adminMiddleware, generateReport)
authRouter.get("/get-booklet",adminMiddleware,getBooklet);
authRouter.patch("/update-form",adminMiddleware,updateForm);
authRouter.post("/validate-coupon",authMiddleware,validateCoupon);
authRouter.post("/claim-coupon",authMiddleware,upload.single('invoice'),productScan);
authRouter.get("/get-customer-details",authMiddleware,getCustomerDetails);
authRouter.get("/:pincode/get-cities",getCitiesByPincode);
authRouter.post("/raise-redemption-request",authMiddleware,raiseRedeemRequest);
authRouter.post("/process-redemption-request",authMiddleware,processRedeemRequest);
authRouter.post("/upload-invoice", upload.single('invoice'), testingFn);
authRouter.post('/product-scan', upload.single('file'), productScan);





authRouter.get('*', (req, res) => {
    throw new Error("Unknown method or path")
});

module.exports = authRouter;
