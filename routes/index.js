const express = require("express");
const router = express.Router();
const bannerRoutes = require("./banner.js");
const testimonialRoutes = require("./testimonial.js");
const authRoutes = require("./auth.js");
const contactUsRoutes = require("./contactUs.js");
const projectRoute = require("./project.js");
const clientFormRoutes = require("./clientForm.js");
const trustedClient = require("./trustedClient.js");
const byLaws = require("./byLaws.js");
const clientContactForm = require("./clientContactForm.js");

router.use("/banner", bannerRoutes);
router.use("/testimonial", testimonialRoutes);
router.use("/auth", authRoutes);
router.use("/send-mail", contactUsRoutes);
router.use("/projects", projectRoute);
router.use("/forms", clientFormRoutes);
router.use("/our-clients", trustedClient);
router.use("/by-laws", byLaws);
router.use("/contact-us", clientContactForm);

module.exports = router;
