const router = require("express").Router();
const {
  createTeamMember,
  getAllTeamMembers,
  getFeaturedTeamMembers,
  updateTeamMember,
  deleteTeamMember,
} = require("../controllers/teamMember.controller.js");
const ProtectRoute = require("../middleware/protect.route.js");
const { uploadImages } = require("../middleware/multer.middleware.js");

router.post("/", ProtectRoute, uploadImages, createTeamMember);
router.get("/",ProtectRoute, getAllTeamMembers);
router.get("/featured", getFeaturedTeamMembers);
router.put("/:id", ProtectRoute, uploadImages, updateTeamMember);
router.delete("/:id", ProtectRoute, deleteTeamMember);

module.exports = router;
