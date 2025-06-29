const express = require("express");
const {
  // signup,
  login,
  logout,
  // forgotPassword,
  // resetPassword,
  // editProfile,
  updateEmailAndPassword,
} = require("../controllers/auth.controller.js");
const router = express.Router();
// const { uploadImages } = require("../middleware/multer.middleware.js");
const ProtectRoute = require("../middleware/protect.route.js");

// router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", ProtectRoute, logout);
// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password", resetPassword);
// router.put("/edit-profile/:id", ProtectRoute, uploadImages, editProfile);
router.put("/edit/:id", ProtectRoute, updateEmailAndPassword);

module.exports = router;
