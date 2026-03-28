const { Router } = require("express");
const { z } = require("zod");
const User = require("../models/User");
const { requireAuth } = require("../middleware/auth");
const { success, error } = require("../utils/response");
const { validate } = require("../middleware/validate");

const router = Router();

const profileSchema = z.object({
  full_name:           z.string().min(1).max(100),
  phone:               z.string().default(""),
  location:            z.string().default(""),
  about:               z.string().default(""),
  experience_years:    z.coerce.number().min(0).max(50).default(0),
  current_role:        z.string().default(""),
  experience:          z.array(z.any()).default([]),
  desired_roles:       z.array(z.string()).max(10).default([]),
  skills:              z.array(z.string()).max(100).default([]),
  github_url:          z.string().url().or(z.literal("")).default(""),
  linkedin_url:        z.string().url().or(z.literal("")).default(""),
  portfolio_url:       z.string().url().or(z.literal("")).default(""),
  education:           z.string().default(""),
  preferred_locations: z.array(z.string()).max(10).default([]),
  remote_preference:   z.enum(["remote", "hybrid", "onsite", "any"]).default("any"),
  salary_min:          z.coerce.number().min(0).default(0),
  salary_max:          z.coerce.number().min(0).default(0),
  industry:            z.string().default(""),
  job_type:            z.enum(["fulltime", "parttime", "contract", "internship", "any"]).default("fulltime"),
});

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).lean();
    return success(res, { profile: user.profile, profile_complete: user.profile_complete });
  } catch (err) {
    next(err);
  }
});

router.put("/", requireAuth, validate(profileSchema), async (req, res, next) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.userId,
      { $set: { profile: req.body, profile_complete: true } },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) return error(res, "User not found", 404);

    return success(res, { profile: updated.profile, profile_complete: updated.profile_complete });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
