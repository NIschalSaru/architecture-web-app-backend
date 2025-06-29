const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");
const Testimonial = require("../model/testimonial.js");
const { asyncHandler } = require("../services/async.handler.js");

const createTestimonial = asyncHandler(async (req, res) => {
  const { fullname, designation, message, rating } = req.body;

  if (!fullname || !designation || !message || !rating) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const uploadedImage = req.files?.image?.[0];
  let filename = null;
  let imagePath = null;
  let imageUrl = null;

  if (uploadedImage) {
    const folderName = dayjs().format("YYYYMMDD");
    filename = uploadedImage.filename;
    imagePath = `/uploads/${folderName}/${filename}`;
    imageUrl = null; // set to null instead of using path
  }

  const title = `testimonial_${Date.now()}`;
  const data = await Testimonial.create({
    fullname,
    designation,
    message,
    rating,
    filename,
    filepath: imagePath,
    imageUrl,
    title,
  });

  res.status(201).json({
    message: "Testimonial created successfully",
    data: {
      fullname,
      designation,
      rating,
      imageUrl,
      filepath: imagePath,
    },
  });
});

const updateTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating, message, fullname, designation, title } = req.body;
  const testimonial = await Testimonial.findByPk(id);

  if (!testimonial) {
    return res.status(404).json({ success: false, message: "Not found" });
  }

  const uploadedImage = req.files?.image?.[0];
  let filename = testimonial.filename;
  let filepath = testimonial.filepath;
  let imageUrl = testimonial.imageUrl;

  if (uploadedImage) {
    if (testimonial.filepath) {
      const sanitizedPath = testimonial.filepath.replace(/^\/+/, "");
      const localPath = path.resolve(__dirname, "..", "storage", sanitizedPath);
      if (fs.existsSync(localPath)) {
        try {
          fs.unlinkSync(localPath);
        } catch (err) {
          console.warn("Failed to delete local file:", err.message);
        }
      }
    }

    const folderName = dayjs().format("YYYYMMDD");
    filename = uploadedImage.filename;
    filepath = `/uploads/${folderName}/${filename}`;
    imageUrl = null; // set to null instead of using path
  }

  await testimonial.update({
    fullname,
    designation,
    message,
    rating,
    title,
    filename,
    filepath,
    imageUrl,
  });

  return res.status(200).json({
    message: "Testimonial updated successfully",
    data: {
      fullname,
      designation,
      rating,
      title,
      imageUrl,
      filepath,
    },
  });
});

const deleteTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const testimonial = await Testimonial.findByPk(id);

  if (!testimonial) {
    return res.status(404).json({ message: "Data not found" });
  }

  if (testimonial.filepath) {
    const sanitizedPath = testimonial.filepath.replace(/^\/+/, "");
    const localPath = path.resolve(__dirname, "..", "storage", sanitizedPath);
    if (fs.existsSync(localPath)) {
      try {
        fs.unlinkSync(localPath);
      } catch (err) {
        console.warn("Failed to delete local file:", err.message);
      }
    }
  }

  await testimonial.destroy();
  return res.status(200).json({
    success: true,
    message: "Testimonial deleted successfully",
  });
});

const getAllTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.findAll({
    order: [["createdAt", "DESC"]],
  });
  return res.status(200).json({ success: true, data: testimonials });
});

const getTestimonialsById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const testimonial = await Testimonial.findByPk(id);
  if (!testimonial) {
    return res.status(404).json({ error: "Data not found!" });
  }
  return res.status(200).json({
    message: "Data fetched successfully",
    data: testimonial,
  });
});

module.exports = {
  createTestimonial,
  getAllTestimonials,
  getTestimonialsById,
  updateTestimonial,
  deleteTestimonial,
};
