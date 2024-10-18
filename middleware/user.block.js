
const { authService } = require("../helper/auth.service");
const { verify } = authService();
const  { UserModel } = require("../database/index.model");
const userBlockMiddleware = async (req, res, next) => {
    
    try {
        const user = await UserModel.findOne({ mobile: req.user.mobile });

        if (!user) {
            let error = new Error("User not found");
            error.status = 404;
            throw error;
        }

        if (user.block) {
            let error = new Error("Your account is inactive, Please try after sometime");
            error.status = 403; 
            throw error;
        }
        next();
    } catch (error) {
        res.status(error.status || 500).json({
            message:error.message || "Error checking block status"
        });
        
    }
}

module.exports = {
    userBlockMiddleware
  };



