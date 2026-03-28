const { Router } = require("express");
const { z } = require("zod");
const User = require("../models/User");
const { sign } = require("../utils/jwt");
const { success, error } = require("../utils/response");
const { requireAuth } = require("../middleware/auth");
const { validate } = require("../middleware/validate");

const router = Router();

const registerSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post("/register", validate(registerSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return error(res, "Email already registered", 409);

    const user = await User.create({ email, password_hash: password });
    const token = sign({ user_id: user._id.toString(), email });

    return success(res, { token, user: user.toSafeObject() }, "Account created", 201);
  } catch (err) {
    next(err);
  }
});

router.post("/login", validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return error(res, "Invalid credentials", 401);

    const valid = await user.comparePassword(password);
    if (!valid) return error(res, "Invalid credentials", 401);

    const token = sign({ user_id: user._id.toString(), email });
    return success(res, { token, user: user.toSafeObject() }, "Login successful");
  } catch (err) {
    next(err);
  }
});

router.get("/me", requireAuth, (req, res) => {
  const user = { ...req.user };
  delete user.password_hash;
  user.id = user._id.toString();
  delete user._id;
  delete user.__v;
  return success(res, { user });
});

module.exports = router;
