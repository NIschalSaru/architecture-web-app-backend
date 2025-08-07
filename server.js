const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const { sequelizeInstance } = require("./database/databaseConnection.js");
const corsOptions = require("./services/corsOptions");
const mainRoutes = require("./routes");
const logger = require("./services/logger");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Serve static uploads with cache headers
app.use(
  "/api/architecture-web-app/uploads",
  express.static("storage/uploads", {
    setHeaders: (res) => {
      res.setHeader("Cache-Control", "public, max-age=31536000");
    },
  })
);

app.use(helmet());

app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      responseTimeMs: duration,
    });
  });

  res.on("error", (err) => {
    logger.error({
      message: "Response error",
      method: req.method,
      url: req.originalUrl,
      error: err.message,
      stack: err.stack,
    });
  });

  next();
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/architecture-web-app", mainRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

sequelizeInstance
  .authenticate()
  .then(() => {
    logger.info("✅ Connected to the database successfully.");
    app.listen(PORT, () => {
      logger.info(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error("❌ Database connection failed:", err.message);
    process.exit(1);
  });

app.use((err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});
