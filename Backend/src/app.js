const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const env = require("./config/env");
const { errorHandler } = require("./middleware/errorHandler");
const { success } = require("./utils/response");

const authRoutes         = require("./routes/auth.routes");
const profileRoutes      = require("./routes/profile.routes");
const jobsRoutes         = require("./routes/jobs.routes");
const savedRoutes        = require("./routes/saved.routes");
const applicationsRoutes = require("./routes/applications.routes");

const app = express();

app.use(helmet());
app.use(compression());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: false }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please slow down." },
});
app.use("/api/", limiter);

app.get("/api/health", (req, res) => success(res, { status: "ok", env: env.NODE_ENV }));

app.use("/api/auth",         authRoutes);
app.use("/api/profile",      profileRoutes);
app.use("/api/jobs",         jobsRoutes);
app.use("/api/saved",        savedRoutes);
app.use("/api/applications", applicationsRoutes);

app.use((req, res) => res.status(404).json({ success: false, message: "Route not found" }));
app.use(errorHandler);

module.exports = app;
