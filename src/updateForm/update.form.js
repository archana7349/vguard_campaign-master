const { CouponModel } = require("../../database/index.model");

async function getBooklet(req, res, next) {
  try {
    const getBooklets = await CouponModel.aggregate([
      {
        $group: {
          _id: { model: "$model", series: "$series" }
        }
      },
      {
        $project: {
          _id: 0,
          model: "$_id.model",
          series: { $toInt: "$_id.series" }
        }
      },
      {
        $sort: {
          model: 1,
          series: 1

        }
      },
      {
        $project: {
          model: 1,
          series: { $toString: "$series" }
        }
      }
    ]);
    return res.json({ code: 200, booklets: getBooklets });
  } catch (err) {
    next(err);
  }
}

async function updateForm(req, res, next) {
  try {
    if (
      !req.body.booklet ||
      !req.body.branch ||
      !req.body.couponType ||
      !req.body.outlet
    ) {
      return res.json({
        message: "Please add all required field",
        status: false,
      });
    }

    const searchedSeries = await CouponModel.findOne({
      series: req.body.booklet,
      model: req.body.couponType,
    });
    if (!searchedSeries)
      return res.json({ message: "Booklet series not found", status: false });
    await CouponModel.updateMany(
      {
        series: req.body.booklet,
        model: req.body.couponType,
      },
      {
        $set: {
          branch: req.body.branch,
          outlet: req.body.outlet,
        },
      }
    );
    return res.json({
      message: "Booklet series updated successfully",
      code: 200,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getBooklet,
  updateForm,
};
