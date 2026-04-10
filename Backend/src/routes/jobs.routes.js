const { Router } = require("express");
const { z } = require("zod");
const { searchJobs } = require("../services/scraper.service");
const { getRecommendedJobs } = require("../services/recommendation.service");
const { requireAuth } = require("../middleware/auth");
const { success, error } = require("../utils/response");
const { validate } = require("../middleware/validate");

const router = Router();

const searchSchema = z.object({
  search:      z.string().default(""),
  location:    z.string().default(""),
  site:        z.string().default("indeed,linkedin"),
  days_old:    z.coerce.number().int().min(1).max(30).default(7),
  results:     z.coerce.number().int().min(1).max(100).default(20),
  remote_only: z.coerce.boolean().default(false),
  job_type:    z.enum(["fulltime", "parttime", "internship", "contract", ""]).default(""),
  easy_apply:  z.coerce.boolean().default(false),
  distance:    z.coerce.number().int().min(1).max(200).optional(),
  country_indeed: z.string().optional(),
  linkedin_fetch_description: z.coerce.boolean().default(false),
  description_format: z.enum(["markdown", "html", ""]).default("markdown"),
  google_search_term: z.string().optional(),
});

router.post("/search", validate(searchSchema), async (req, res, next) => {
  try {
    const { jobs, cached, count } = await searchJobs(req.body);
    return success(res, {
      jobs,
      results_count: count,
      cached,
      query: req.body,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/recommended", requireAuth, async (req, res, next) => {
  try {
    const user = req.user;
    if (!user.profile_complete) {
      return success(res, { needs_profile: true, jobs: [], results_count: 0 });
    }
    const jobs = await getRecommendedJobs(user.profile);
    return success(res, { jobs, results_count: jobs.length, needs_profile: false });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
