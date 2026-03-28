const logger = require("../utils/logger");
const { error } = require("../utils/response");

const errorHandler = (err, req, res, next) => {
  logger.error(err.message, {
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  });

  if (err.name === "ValidationError") {
    return error(res, "Validation failed", 400, Object.values(err.errors).map((e) => e.message));
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return error(res, `${field} already exists`, 409);
  }
  if (err.name === "CastError") {
    return error(res, "Invalid ID format", 400);
  }

  return error(res, "Internal server error", 500);
};

module.exports = { errorHandler };
