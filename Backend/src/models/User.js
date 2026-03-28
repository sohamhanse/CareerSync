const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const profileSchema = new mongoose.Schema({
  full_name:            { type: String, default: "" },
  phone:                { type: String, default: "" },
  location:             { type: String, default: "" },
  about:                { type: String, default: "" },
  experience_years:     { type: Number, default: 0, min: 0, max: 50 },
  current_role:         { type: String, default: "" },
  experience:           { type: [Object], default: [] },
  desired_roles:        { type: [String], default: [] },
  skills:               { type: [String], default: [] },
  github_url:           { type: String, default: "" },
  linkedin_url:         { type: String, default: "" },
  portfolio_url:        { type: String, default: "" },
  education:            { type: String, default: "" },
  preferred_locations:  { type: [String], default: [] },
  remote_preference:    { type: String, enum: ["remote", "hybrid", "onsite", "any"], default: "any" },
  salary_min:           { type: Number, default: 0 },
  salary_max:           { type: Number, default: 0 },
  industry:             { type: String, default: "" },
  job_type:             { type: String, enum: ["fulltime", "parttime", "contract", "internship", "any"], default: "fulltime" },
}, { _id: false });

const userSchema = new mongoose.Schema({
  email:            { type: String, required: true, unique: true, lowercase: true, trim: true },
  password_hash:    { type: String, required: true },
  profile_complete: { type: Boolean, default: false },
  profile:          { type: profileSchema, default: () => ({}) },
}, { timestamps: true });

userSchema.index({ email: 1 });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password_hash")) return next();
  this.password_hash = await bcrypt.hash(this.password_hash, 12);
  next();
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password_hash);
};

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject({ virtuals: true });
  delete obj.password_hash;
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
