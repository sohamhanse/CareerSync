const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  user_id:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  job_data: { type: mongoose.Schema.Types.Mixed, required: true },
  job_id:   { type: String, required: true },
  status:   { type: String, enum: ["applied", "interview", "offer", "rejected", "withdrawn"], default: "applied" },
  notes:    { type: String, default: "" },
}, { timestamps: true });

applicationSchema.index({ user_id: 1 });
applicationSchema.index({ user_id: 1, job_id: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
