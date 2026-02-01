const router = require("express").Router();
const {
  createTeamMember,
  getAllTeamMembers,
  getFeaturedTeamMembers,
  updateTeamMember,
  deleteTeamMember,
} = require("../controllers/teamMember.controller.js");
const ProtectRoute = require("../middleware/protect.route.js");
const { uploadImages, validateFileSizes } = require("../middleware/multer.middleware.js");
const { compressImages } = require("../middleware/imageCompressor.js");

router.post("/", ProtectRoute, uploadImages, validateFileSizes, compressImages, createTeamMember);
router.put("/:id", ProtectRoute, uploadImages, validateFileSizes, compressImages, updateTeamMember);
router.delete("/:id", ProtectRoute, deleteTeamMember);
router.get("/",ProtectRoute, getAllTeamMembers);
router.get("/featured", getFeaturedTeamMembers);

module.exports = router;
