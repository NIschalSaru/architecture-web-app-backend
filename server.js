const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");
const { sequelizeInstance } = require("./database/databaseConnection.js");
const corsOptions = require("./services/corsOptions");
const mainRoutes = require("./routes");
const logger = require("./services/logger");
const { globalLimiter } = require("./middleware/rateLimiter");
const { sanitizeInput } = require("./middleware/xssSanitizer");

dotenv.config();  // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === "production";


// <---------------------- SECURITY MIDDLEWARE ----------------------->
app.use(                      // Enhanced Helmet configuration with CSP and HSTS
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  })
);

app.use(hpp());
app.use(mongoSanitize()); // NoSQL injection protection
app.use(globalLimiter);


// <---------------------- PERFORMANCE MIDDLEWARE ----------------------->
app.use(                       // Compression middleware for response optimization
  compression({
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) {
        return false;
      }
      return compression.filter(req, res);
    },
    level: 6, // Compression level (0-9, 6 is default)
  })
);

app.use(                                      // Serve static uploads with MODERATE caching (for frequently changing files)
  "/api/architecture-web-app/uploads",
  express.static("storage/uploads", {
    setHeaders: (res, path) => {
      res.setHeader("Cache-Control", "public, max-age=3600, must-revalidate");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
    maxAge: "1h",
  })
);


// <---------------------- REQUEST PARSING & LOGGING ----------------------->
app.use(express.json({ limit: "10mb" }));           // Request body size limits (prevents DoS attacks)
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.use(sanitizeInput);           // XSS Sanitization - Clean all user inputs

app.use((req, res, next) => {           // Request logging middleware
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


app.use(cors(corsOptions));    // CORS configuration


//<---------------------- ROUTES ----------------------->
app.get("/health", (req, res) => {     // Health check endpoint
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

app.get("/", (req, res) => {      // Root endpoint
  res.send("Backend is running");
});

app.use("/api/architecture-web-app", mainRoutes);  // API routes


// <---------------------- DATABASE CONNECTION & SERVER START ----------------------->
sequelizeInstance
  .authenticate()
  .then(() => {
    logger.info("Connected to the database successfully.");
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV}`);
      logger.info(`Health check available at: http://localhost:${PORT}/health`);
    });
  })
  .catch((err) => {
    logger.error("Database connection failed:", err.message);
    process.exit(1);
  });


// <---------------------- ERROR HANDLING ----------------------->
app.use((err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });

  const statusCode = err.statusCode || 500;

  if (isProduction) {
    res.status(statusCode).json({
      success: false,
      message: statusCode === 500 ? "Internal Server Error" : err.message,
    });
  } else {
    res.status(statusCode).json({
      success: false,
      message: err.message || "Internal Server Error",
      stack: err.stack,
      error: err,
    });
  }
});
