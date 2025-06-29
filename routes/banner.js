const router = require("express").Router();
const {
  createOrUpdateBanner,
  getBanner,
} = require("../controllers/banner.controller.js");
const ProtectRoute = require("../middleware/protect.route.js");
const { uploadImages } = require("../middleware/multer.middleware.js");

router.post("/", ProtectRoute, uploadImages, createOrUpdateBanner);
router.get("/", getBanner);

module.exports = router;
