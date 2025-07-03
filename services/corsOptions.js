const allowOrigin = require("./allowedorigin");

const corsOptions = {
  origin: (origin, callback) => {
    if (allowOrigin.origins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: allowOrigin.methods,
  credentials: true,
  preflightContinue: allowOrigin.preflightContinue,
  optionsSuccessStatus: allowOrigin.optionsSuccessStatus,
};

module.exports = corsOptions;
