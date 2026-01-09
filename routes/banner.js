const router = require("express").Router();
const {
  createOrUpdateBanner,
  getBanner,
} = require("../controllers/banner.controller.js");
const ProtectRoute = require("../middleware/protect.route.js");
const { uploadImages, validateFileSizes } = require("../middleware/multer.middleware.js");

router.post("/", ProtectRoute, uploadImages, validateFileSizes, createOrUpdateBanner);
router.get("/", getBanner);

module.exports = router;
