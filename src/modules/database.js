const { MONGO_DB_URI } = require("../../config.json");
const { connect } = require("mongoose");
const logger = require("../modules/logger");

async function database() {
  const uri = MONGO_DB_URI;

  try {
    await connect(String(uri), {
      connectTimeoutMS: 300000,
      socketTimeoutMS: 75000,
      keepAlive: true,
      keepAliveInitialDelay: 300000
    });

    logger.debug("DATABASE", "Connected to mongodb");
  } catch (e) {
    const error = e instanceof global.Error ? e : null;

    console.error(error);

    logger.error("database", error?.message);
  }
};

database();