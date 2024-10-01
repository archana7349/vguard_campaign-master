const { authService } = require("../helper/auth.service");
const { verify } = authService();

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });


async function authMiddleware(req, res, next) {
  const token = req.header("Authorization");
  try {
    if (!token) {
      let error = new Error("No access token found");
      error.status = 443;
      throw error
    }
    if (token.split(" ")[0] !== "Bearer") {
      throw new Error("Invalid access token format");
    }
    const { payload } = await verify(token.split(" ")[1]);
    req.user = payload;
    next();
  } catch (err) {
    if (err?.code == "ERR_JWT_EXPIRED") {
      err.message = "Authorization failed. Please login again.";
      err.statusCode = 401
    }
    next(err);
  }
}

async function adminMiddleware(req, res, next) {
  const token = req.header("Authorization");
  try {
    if (!token) {
      let error = new Error("No access token found");
      error.status = 443;
      throw error
    }
    if (token.split(" ")[0] !== "Bearer") {
      throw new Error("Invalid access token format");
    }
    const { payload } = await verify(token.split(" ")[1]);

    if (payload.role !== 'vg_admin') {
      const erroradmin = new Error("Unauthorized user");
      erroradmin.statusCode = 440
      throw erroradmin
    }
    req.user = payload;
    next();
  } catch (err) {
    if (err?.code == "ERR_JWT_EXPIRED") {
      err.message = "Authorization failed. Please login again.";
      err.statusCode = 401
    }
    next(err);
  }
}

module.exports = {
  authMiddleware, adminMiddleware
};
