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

          // Read the file into a buffer first to avoid file locking issues on Windows
          const imageBuffer = await fs.promises.readFile(originalPath);

          // Process the buffer instead of the file path
          await sharp(imageBuffer)
            .webp({ quality: 80 })
            .toFile(newPath);

          // Now we can safely delete the original file since Sharp never locked it
          try {
            await fs.promises.unlink(originalPath);
            console.log(`✓ Successfully deleted original file: ${path.basename(originalPath)}`);
          } catch (unlinkError) {
            console.error(`✗ Failed to delete original file ${originalPath}:`, unlinkError);
            // Continue processing even if deletion fails
          }

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
