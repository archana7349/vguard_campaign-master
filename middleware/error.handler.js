function errorHandlingMiddlware(err, req, res, next) {
  // console.log(err.stack);
  err.statusCode = err.statusCode || 404;
  return err.customMessage || err.message
    ? res.status(err.statusCode).json({
        status: err.statusCode,
        message: err.customMessage || err.message,
      })
    : res.status(err.statusCode).json({ status: err.statusCode, message: err });
}
module.exports = { errorHandlingMiddlware };
