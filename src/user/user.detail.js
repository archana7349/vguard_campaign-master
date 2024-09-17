const { UserModel } = require("../../database/index.model");

async function userDetail(req, res, next) {
  try {
    let { mobile } = req.user;
    if (!mobile) throw new Error("Token values mismatch");

    let searchUser = await UserModel.findOne(
      { mobile },
      { __v: 0, ip: 0, _id: 0, token: 0 }
    );

    if (!searchUser) throw new Error("User not found");

    return res.json({
      status: 200,
      message: "User Found",
      User: searchUser,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  userDetail,
};
