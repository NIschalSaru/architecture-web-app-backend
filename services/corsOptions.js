const allowOrigin = require("./allowedorigin");
const logger = require("./logger"); // import your Winston logger

const corsOptions = {
  origin: (origin, callback) => {
    logger.debug(
      `Request Origin: ${origin || "undefined/null (e.g., server or curl)"}`
    );
    logger.debug(`Allowed Origins: ${allowOrigin.origins.join(", ")}`);

    if (allowOrigin.origins.length === 0) {
      logger.warn(
        "No allowed origins configured. Allowing all origins for this request."
      );
      callback(null, true);
    } else if (allowOrigin.origins.includes(origin) || !origin) {
      logger.info(`CORS Allowed for origin: ${origin || "undefined/null"}`);
      callback(null, true);
    } else {
      logger.error(
        `CORS Error: Origin ${origin} not allowed. Allowed origins: ${allowOrigin.origins.join(
          ", "
        )}`
      );
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: allowOrigin.methods,
  credentials: true,
  preflightContinue: allowOrigin.preflightContinue,
  optionsSuccessStatus: allowOrigin.optionsSuccessStatus,
};

module.exports = corsOptions;
