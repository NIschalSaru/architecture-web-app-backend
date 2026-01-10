const router = require("express").Router();
const {
  createByLawsInfo,
  getAllByLawsInfo,
  updateByLawsInfo,
  deleteByLawsInfo,
  getByLawsInfoByFeature,
} = require("../controllers/byLaws.controller.js");
const ProtectRoute = require("../middleware/protect.route.js");
const { uploadImages, validateFileSizes } = require("../middleware/multer.middleware.js");

router.post("/", ProtectRoute, uploadImages, validateFileSizes, createByLawsInfo);
router.get("/feature", getByLawsInfoByFeature);
router.get("/", getAllByLawsInfo);
router.put("/:id", ProtectRoute, uploadImages, validateFileSizes, updateByLawsInfo);
router.delete("/:id", ProtectRoute, deleteByLawsInfo);

module.exports = router;
