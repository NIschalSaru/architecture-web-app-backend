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

router.post("/", ProtectRoute, uploadImages, validateFileSizes, createTrustedClient);
router.get("/", getAllTrustedClients);
router.get("/feature", getAllTrustedClientsByFeature);
router.put("/:id", ProtectRoute, uploadImages, validateFileSizes, updateTrustedClient);
router.delete("/:id", ProtectRoute, deleteTrustedClient);

module.exports = router;
