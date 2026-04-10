const { searchJobs } = require("./scraper.service");
const logger = require("../utils/logger");

const scoreJob = (job, profile) => {
  let score = 0;

  const profileSkillsLower = (profile.skills || []).map((s) => s.toLowerCase());
  const jobSkills = (job.skills_required || []).map((s) => s.toLowerCase());
  const skillMatches = profileSkillsLower.filter((s) => jobSkills.includes(s)).length;
  score += Math.min(skillMatches * 10, 40);

  const expYears = profile.experience_years || 0;
  const jobLevel = (job.job_level || "").toLowerCase();
  if (expYears <= 2 && jobLevel.includes("entry")) score += 15;
  else if (expYears >= 3 && expYears <= 5 && jobLevel.includes("mid")) score += 15;
  else if (expYears > 5 && (jobLevel.includes("senior") || jobLevel.includes("lead"))) score += 15;

  const remoteMatch =
    (profile.remote_preference === "remote" && job.remote_work === "Remote") ||
    (profile.remote_preference === "hybrid" && job.remote_work === "Hybrid") ||
    profile.remote_preference === "any";
  if (remoteMatch) score += 15;

  const salary = job.salary_range;
  if (salary && profile.salary_min && profile.salary_max) {
    const jobMin = salary.min_amount || 0;
    const jobMax = salary.max_amount || Infinity;
    if (jobMin <= profile.salary_max && jobMax >= profile.salary_min) score += 10;
  }

  const titleLower = (job.job_title || "").toLowerCase();
  const roleMatches = (profile.desired_roles || []).some((r) =>
    titleLower.includes(r.toLowerCase())
  );
  if (roleMatches) score += 10;

  return Math.min(score, 100);
};

const getRecommendedJobs = async (profile) => {
  const searchTerm = (profile.desired_roles || [])[0] || profile.current_role || "software engineer";
  const location = (profile.preferred_locations || [])[0] || profile.location || "";
  const remoteOnly = profile.remote_preference === "remote";

  try {
    const { jobs } = await searchJobs({
      search: searchTerm,
      location,
      site: "all",
      days_old: 7,
      results: 30,
      remote_only: remoteOnly,
    });

    return jobs
      .map((job) => ({ ...job, match_score: scoreJob(job, profile) }))
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, 20);
  } catch (err) {
    logger.error("Recommendation fetch failed", { error: err.message });
    return [];
  }
};

module.exports = { getRecommendedJobs };
