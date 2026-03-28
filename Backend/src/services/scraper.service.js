const { spawn } = require("child_process");
const path = require("path");
const crypto = require("crypto");
const env = require("../config/env");
const JobCache = require("../models/JobCache");
const logger = require("../utils/logger");

const CACHE_TTL_MINUTES = 60;

const buildCacheKey = (params) => {
  const normalized = JSON.stringify({
    search: (params.search || "").toLowerCase().trim(),
    location: (params.location || "").toLowerCase().trim(),
    site: params.site || "all",
    days_old: params.days_old || 7,
    remote_only: !!params.remote_only,
  });
  return crypto.createHash("md5").update(normalized).digest("hex");
};

const runPythonScraper = (params) =>
  new Promise((resolve, reject) => {
    const crawlerPath = path.resolve(__dirname, "../../..", "Crawler");
    const scriptPath = path.join(crawlerPath, "scrape.py");

    const child = spawn(env.PYTHON_EXECUTABLE, [scriptPath], {
      cwd: crawlerPath,
      timeout: 120_000,
    });

    let stdout = "";
    let stderr = "";

    child.stdin.write(JSON.stringify(params));
    child.stdin.end();

    child.stdout.on("data", (d) => (stdout += d.toString()));
    child.stderr.on("data", (d) => (stderr += d.toString()));

    child.on("close", (code) => {
      if (stderr) logger.debug("Python stderr", { stderr: stderr.substring(0, 500) });
      try {
        const result = JSON.parse(stdout);
        if (!result.success) {
          return reject(new Error(result.error || "Scraper returned no jobs"));
        }
        resolve(result.jobs || []);
      } catch (parseErr) {
        logger.error("Failed to parse scraper output", { stdout: stdout.substring(0, 300), stderr: stderr.substring(0, 300) });
        reject(new Error("Scraper output could not be parsed"));
      }
    });

    child.on("error", (err) => reject(new Error(`Spawn failed: ${err.message}`)));
  });

const searchJobs = async (params) => {
  const cacheKey = buildCacheKey(params);

  const cached = await JobCache.findOne({ cache_key: cacheKey }).lean();
  if (cached) {
    logger.debug("Job cache hit", { cacheKey });
    return { jobs: cached.jobs, cached: true, count: cached.job_count };
  }

  logger.debug("Job cache miss — running scraper", { params });
  const jobs = await runPythonScraper(params);

  const expiresAt = new Date(Date.now() + CACHE_TTL_MINUTES * 60 * 1000);
  await JobCache.findOneAndUpdate(
    { cache_key: cacheKey },
    { cache_key: cacheKey, jobs, job_count: jobs.length, cached_at: new Date(), expires_at: expiresAt },
    { upsert: true, new: true }
  );

  return { jobs, cached: false, count: jobs.length };
};

module.exports = { searchJobs };
