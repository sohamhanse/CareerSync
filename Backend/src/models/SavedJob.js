const mongoose = require("mongoose");

const savedJobSchema = new mongoose.Schema({
  user_id:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  job_data: { type: mongoose.Schema.Types.Mixed, required: true },
  job_id:   { type: String, required: true },
}, { timestamps: true });

savedJobSchema.index({ user_id: 1, job_id: 1 }, { unique: true });

module.exports = mongoose.model("SavedJob", savedJobSchema);
