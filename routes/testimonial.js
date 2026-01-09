const router = require("express").Router();
const {
  createTestimonial,
  getAllTestimonials,
  updateTestimonial,
  deleteTestimonial,
} = require("../controllers/testimonial.controller.js");
const ProtectRoute = require("../middleware/protect.route.js");
const { uploadImages, validateFileSizes } = require("../middleware/multer.middleware.js");

router.post("/", ProtectRoute, uploadImages, validateFileSizes, createTestimonial);
router.get("/", getAllTestimonials);
router.put("/:id", ProtectRoute, uploadImages, validateFileSizes, updateTestimonial);
router.delete("/:id", ProtectRoute, deleteTestimonial);

module.exports = router;
