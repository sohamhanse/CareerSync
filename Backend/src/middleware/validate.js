const { error } = require("../utils/response");

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return error(res, "Validation failed", 400, result.error.flatten().fieldErrors);
  }
  req.body = result.data;
  next();
};

module.exports = { validate };
