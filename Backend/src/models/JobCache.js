const mongoose = require("mongoose");

const jobCacheSchema = new mongoose.Schema({
  cache_key:  { type: String, required: true, index: true },
  jobs:       { type: mongoose.Schema.Types.Mixed, required: true },
  job_count:  { type: Number, default: 0 },
  cached_at:  { type: Date, default: Date.now },
  expires_at: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
});

module.exports = mongoose.model("JobCache", jobCacheSchema);
