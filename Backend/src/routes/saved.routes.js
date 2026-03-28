const { Router } = require("express");
const SavedJob = require("../models/SavedJob");
const { requireAuth } = require("../middleware/auth");
const { success, error } = require("../utils/response");

const router = Router();

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const saved = await SavedJob.find({ user_id: req.userId }).lean().sort({ createdAt: -1 });
    return success(res, { saved_jobs: saved });
  } catch (err) {
    next(err);
  }
});

router.post("/:jobId", requireAuth, async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { job_data } = req.body;
    const doc = await SavedJob.findOneAndUpdate(
      { user_id: req.userId, job_id: jobId },
      { user_id: req.userId, job_id: jobId, job_data },
      { upsert: true, new: true }
    );
    return success(res, { saved: true, id: doc._id });
  } catch (err) {
    next(err);
  }
});

router.delete("/:jobId", requireAuth, async (req, res, next) => {
  try {
    await SavedJob.findOneAndDelete({ user_id: req.userId, job_id: req.params.jobId });
    return success(res, { saved: false });
  } catch (err) {
    next(err);
  }
});

router.get("/check/:jobId", requireAuth, async (req, res, next) => {
  try {
    const exists = await SavedJob.exists({ user_id: req.userId, job_id: req.params.jobId });
    return success(res, { is_saved: !!exists });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
