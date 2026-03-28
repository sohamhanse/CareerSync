const { verify } = require("../utils/jwt");
const { error } = require("../utils/response");
const User = require("../models/User");

const requireAuth = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return error(res, "Authentication required", 401);
  }
  const token = header.split(" ")[1];
  try {
    const payload = verify(token);
    const user = await User.findById(payload.user_id).lean();
    if (!user) return error(res, "User not found", 401);
    req.user = user;
    req.userId = user._id.toString();
    next();
  } catch {
    return error(res, "Invalid or expired token", 401);
  }
};

module.exports = { requireAuth };
