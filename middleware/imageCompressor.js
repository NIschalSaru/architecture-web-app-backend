const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const compressImages = async (req, res, next) => {
  if (!req.files) {
    return next();
  }

  try {
    const fields = Object.keys(req.files);

    for (const field of fields) {
      const files = req.files[field];

      for (const file of files) {
        if (file.mimetype.startsWith("image/")) {
          const originalPath = file.path;
          const parsedPath = path.parse(originalPath);
          const newFilename = `${parsedPath.name}.webp`;
          const newPath = path.join(parsedPath.dir, newFilename);

          await sharp(originalPath)
            .webp({ quality: 80 })
            .toFile(newPath);

          // Remove the original file
          fs.unlinkSync(originalPath);

          // Update file object
          file.filename = newFilename;
          file.path = newPath;
          file.mimetype = "image/webp";
          file.size = fs.statSync(newPath).size;
        }
      }
    }
    next();
  } catch (error) {
    console.error("Image compression error:", error);
    next(error);
  }
};

module.exports = { compressImages };
