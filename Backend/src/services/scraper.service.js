const { spawn } = require("child_process");
const path = require("path");
const crypto = require("crypto");
const env = require("../config/env");
const JobCache = require("../models/JobCache");
const logger = require("../utils/logger");

const CACHE_TTL_MINUTES = 60;
const SUPPORTED_SITES = ["indeed", "linkedin", "glassdoor", "google", "zip_recruiter", "bayt", "naukri"];
const ALL_SITES_SENTINELS = new Set(["all", "*", "any"]);

// Resolve once: scrape_worker.py lives in modelFiles/ (sibling of Backend/)
const WORKER_SCRIPT = path.resolve(__dirname, "../../../modelFiles/scrape_worker.py");
const PYTHON_BIN = env.PYTHON_EXECUTABLE;

const normalizeSiteNames = (siteParam) => {
  if (siteParam === undefined || siteParam === null) return SUPPORTED_SITES;

  const raw = String(siteParam).toLowerCase().trim();
  if (!raw || ALL_SITES_SENTINELS.has(raw)) return SUPPORTED_SITES;

  const tokens = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (tokens.some((s) => ALL_SITES_SENTINELS.has(s))) return SUPPORTED_SITES;

  const valid = [...new Set(tokens.filter((s) => SUPPORTED_SITES.includes(s)))];
  return valid.length > 0 ? valid : SUPPORTED_SITES;
};

const buildCacheKey = (params) => {
  const normalizedSites = normalizeSiteNames(params.site).slice().sort().join(",");
  const normalized = JSON.stringify({
    search: (params.search || "").toLowerCase().trim(),
    location: (params.location || "").toLowerCase().trim(),
    site: normalizedSites,
    days_old: params.days_old || 7,
    remote_only: !!params.remote_only,
    job_type: params.job_type || "",
  });
  return crypto.createHash("md5").update(normalized).digest("hex");
};

/**
 * Translate frontend search params → scrape_worker.py JSON input.
 */
const buildWorkerInput = (params) => {
  // Missing/blank/"all" expands to every supported platform.
  const siteNames = normalizeSiteNames(params.site);

  const input = {
    site_names: siteNames,
    search_term: params.search || "",
    location: params.location || "India",
    results_wanted: params.results || 20,
    country_indeed: params.country_indeed || guessCountry(params.location),
  };

  // Optional params — only include when explicitly provided
  if (params.days_old) input.hours_old = params.days_old * 24;
  if (params.job_type) input.job_type = params.job_type;
  if (params.remote_only) input.is_remote = true;
  if (params.easy_apply) input.easy_apply = true;
  if (params.distance) input.distance = params.distance;
  if (params.linkedin_fetch_description) input.linkedin_fetch_description = true;
  if (params.description_format) input.description_format = params.description_format;
  if (params.google_search_term) input.google_search_term = params.google_search_term;

  // Keep verbose low to reduce noise
  input.verbose = 1;

  return input;
};

/** Best-effort country guess from location string for Indeed/Glassdoor */
const guessCountry = (location) => {
  if (!location) return "usa";
  const loc = location.toLowerCase();
  if (loc.includes("india")) return "india";
  if (loc.includes("uk") || loc.includes("united kingdom") || loc.includes("london")) return "uk";
  if (loc.includes("canada") || loc.includes("toronto") || loc.includes("vancouver")) return "canada";
  if (loc.includes("australia") || loc.includes("sydney") || loc.includes("melbourne")) return "australia";
  if (loc.includes("germany") || loc.includes("berlin") || loc.includes("munich")) return "germany";
  return "usa";
};

const runPythonScraper = (params) =>
  new Promise((resolve, reject) => {
    const workerInput = buildWorkerInput(params);

    logger.debug("Spawning scrape_worker", { script: WORKER_SCRIPT, input: workerInput });

    const child = spawn(PYTHON_BIN, [WORKER_SCRIPT], {
      cwd: path.dirname(WORKER_SCRIPT),
      timeout: 180_000, // 3 min — multi-site scrapes can be slow
    });

    let stdout = "";
    let stderr = "";

    child.stdin.write(JSON.stringify(workerInput));
    child.stdin.end();

    child.stdout.on("data", (d) => (stdout += d.toString()));
    child.stderr.on("data", (d) => (stderr += d.toString()));

    child.on("close", (code) => {
      if (stderr) logger.debug("scrape_worker stderr", { stderr: stderr.substring(0, 500) });
      try {
        const result = JSON.parse(stdout);
        if (!result.success) {
          return reject(new Error(result.error || "Scraper returned no jobs"));
        }
        resolve(result.jobs || []);
      } catch (parseErr) {
        logger.error("Failed to parse scraper output", {
          stdout: stdout.substring(0, 300),
          stderr: stderr.substring(0, 300),
        });
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
