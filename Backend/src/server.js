const app = require("./app");
const { connect } = require("./config/db");
const env = require("./config/env");
const logger = require("./utils/logger");

const start = async () => {
  await connect();
  app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT} [${env.NODE_ENV}]`);
  });
};

process.on("unhandledRejection", (err) => {
  logger.error("Unhandled rejection", { error: err.message });
  process.exit(1);
});

start();
