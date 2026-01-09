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

router.post("/", ProtectRoute, uploadImages, validateFileSizes, createTeamMember);
router.get("/",ProtectRoute, getAllTeamMembers);
router.get("/featured", getFeaturedTeamMembers);
router.put("/:id", ProtectRoute, uploadImages, validateFileSizes, updateTeamMember);
router.delete("/:id", ProtectRoute, deleteTeamMember);

module.exports = router;
