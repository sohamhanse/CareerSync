const { Router } = require("express");
const { z } = require("zod");
const Application = require("../models/Application");
const { requireAuth } = require("../middleware/auth");
const { success, error } = require("../utils/response");
const { validate } = require("../middleware/validate");

const router = Router();

const applySchema = z.object({
  job_id:   z.string().min(1),
  job_data: z.record(z.unknown()),
  notes:    z.string().optional().default(""),
});

const statusSchema = z.object({
  status: z.enum(["applied", "interview", "offer", "rejected", "withdrawn"]),
});

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const apps = await Application.find({ user_id: req.userId }).lean().sort({ createdAt: -1 });
    return success(res, { applications: apps });
  } catch (err) {
    next(err);
  }
});

router.post("/", requireAuth, validate(applySchema), async (req, res, next) => {
  try {
    const { job_id, job_data, notes } = req.body;
    const doc = await Application.findOneAndUpdate(
      { user_id: req.userId, job_id },
      { user_id: req.userId, job_id, job_data, notes },
      { upsert: true, new: true }
    );
    return success(res, { application: doc }, "Application saved", 201);
  } catch (err) {
    next(err);
  }
});

router.patch("/:id/status", requireAuth, validate(statusSchema), async (req, res, next) => {
  try {
    const app = await Application.findOneAndUpdate(
      { _id: req.params.id, user_id: req.userId },
      { status: req.body.status },
      { new: true }
    );
    if (!app) return error(res, "Application not found", 404);
    return success(res, { application: app });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
