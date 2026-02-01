const router = require("express").Router();
const {
  createTestimonial,
  getAllTestimonials,
  updateTestimonial,
  deleteTestimonial,
} = require("../controllers/testimonial.controller.js");
const ProtectRoute = require("../middleware/protect.route.js");
const { uploadImages, validateFileSizes } = require("../middleware/multer.middleware.js");
const { compressImages } = require("../middleware/imageCompressor.js");

router.post("/", ProtectRoute, uploadImages, validateFileSizes, compressImages, createTestimonial);
router.get("/", getAllTestimonials);
router.put("/:id", ProtectRoute, uploadImages, validateFileSizes, compressImages, updateTestimonial);
router.delete("/:id", ProtectRoute, deleteTestimonial);

module.exports = router;
