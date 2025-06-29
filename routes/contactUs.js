const router = require("express").Router();
const {
  sendContactFormEmail,
} = require("../controllers/contactUs.controller.js");

router.post("/", sendContactFormEmail);
module.exports = router;
