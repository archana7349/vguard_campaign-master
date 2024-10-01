const config = require("../config/config.js");
const jose = require("jose");
const secret = new TextEncoder().encode(config.jwtSecret);

function authService() {
  const verify = (token) => jose.jwtVerify(token, secret);

  const generateToken = (data) => {
    return new jose.SignJWT(data)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("10h")
      .sign(secret);
  };

  return {
    verify,
    generateToken,
  };
}

module.exports = {
  authService,
};
