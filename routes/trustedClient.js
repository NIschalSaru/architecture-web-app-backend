const router = require("express").Router();
const {
  createTrustedClient,
  getAllTrustedClients,
  updateTrustedClient,
  deleteTrustedClient,
  getAllTrustedClientsByFeature,
} = require("../controllers/trustedClient.controller.js");
const ProtectRoute = require("../middleware/protect.route.js");
const { uploadImages, validateFileSizes } = require("../middleware/multer.middleware.js");
const { compressImages } = require("../middleware/imageCompressor.js");

router.post("/", ProtectRoute, uploadImages, validateFileSizes, compressImages, createTrustedClient);
router.get("/", getAllTrustedClients);
router.get("/feature", getAllTrustedClientsByFeature);
router.put("/:id", ProtectRoute, uploadImages, validateFileSizes, compressImages, updateTrustedClient);
router.delete("/:id", ProtectRoute, deleteTrustedClient);

module.exports = router;
