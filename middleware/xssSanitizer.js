const xss = require("xss");

/**
 * XSS Sanitization Middleware
 * Sanitizes all string inputs in req.body, req.query, and req.params
 * to prevent Cross-Site Scripting (XSS) attacks
 */
const sanitizeInput = (req, res, next) => {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeObject(req.body);
  }
  
  if (req.query && typeof req.query === "object") {
    req.query = sanitizeObject(req.query);
  }

  if (req.params && typeof req.params === "object") {
    req.params = sanitizeObject(req.params);
  }

  next();
};

/**
 * Recursively sanitize all string values in an object
 */
const sanitizeObject = (obj) => {
  if (typeof obj === "string") {
    return xss(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item));
  }

  if (obj !== null && typeof obj === "object") {
    const sanitized = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }

  return obj;
};

/**
 * Custom XSS options for specific use cases
 * Use this when you need to allow certain HTML tags
 */
const sanitizeWithOptions = (input, options = {}) => {
  const defaultOptions = {
    whiteList: {}, // No HTML tags allowed by default
    stripIgnoreTag: true, // Remove all tags not in whitelist
    stripIgnoreTagBody: ["script"], // Remove script tag content
  };

  return xss(input, { ...defaultOptions, ...options });
};

module.exports = {
  sanitizeInput,
  sanitizeWithOptions,
};
