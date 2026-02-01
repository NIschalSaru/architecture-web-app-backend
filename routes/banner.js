const router = require("express").Router();
const {
  createOrUpdateBanner,
  getBanner,
} = require("../controllers/banner.controller.js");
const ProtectRoute = require("../middleware/protect.route.js");
const { uploadImages, validateFileSizes } = require("../middleware/multer.middleware.js");
const { compressImages } = require("../middleware/imageCompressor.js");

router.post("/", ProtectRoute, uploadImages, validateFileSizes, compressImages, createOrUpdateBanner);
router.get("/", getBanner);

module.exports = router;
