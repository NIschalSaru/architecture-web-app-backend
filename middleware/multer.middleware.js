const multer = require("multer");
const path = require("path");
const fs = require("fs");
const dayjs = require("dayjs");
const crypto = require("crypto");

const MAX_SIZES = {
  image: 2 * 1024 * 1024,
  gallery: 2 * 1024 * 1024,
  file: 5 * 1024 * 1024,
  documents: 5 * 1024 * 1024,
  video: 50 * 1024 * 1024,
};

const allowedTypes = {
  image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  gallery: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  file: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  documents: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  video: ["video/mp4"],
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folderName = dayjs().format("YYYYMMDD");
    const folderPath = path.join(__dirname, `../storage/uploads/${folderName}`);

    fs.mkdirSync(folderPath, { recursive: true });
    cb(null, folderPath);
  },

  filename: function (req, file, cb) {
    const timestamp = dayjs().format("YYYYMMDDHHmmss");
    const ext = path.extname(file.originalname);
    const randomStr = crypto.randomBytes(6).toString("hex");
    const filename = `${timestamp}_${randomStr}${ext}`;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const field = file.fieldname;
  const mimetype = file.mimetype;

  const isValid = allowedTypes[field]?.includes(mimetype);
  if (!isValid) {
    return cb(new Error(`Invalid file type for field "${field}"`), false);
  }

  cb(null, true);
};

const limits = {
  fileSize: 100 * 1024 * 1024,
};

const upload = multer({
  storage,
  fileFilter,
  limits,
});

const uploadImages = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "gallery", maxCount: 10 },
  { name: "file", maxCount: 1 },
  { name: "documents", maxCount: 5 },
  { name: "video", maxCount: 1 },
]);

const validateFileSizes = (req, res, next) => {
  const checkSize = (fieldName, maxSize) => {
    const files = req.files[fieldName] || [];
    for (let file of files) {
      const stats = fs.statSync(file.path);
      if (stats.size > maxSize) {
        return `${fieldName} file "${file.originalname}" exceeds ${
          maxSize / 1024 / 1024
        }MB limit`;
      }
    }
    return null;
  };

  const errors = Object.entries(MAX_SIZES)
    .map(([field, max]) => checkSize(field, max))
    .filter(Boolean);

  if (errors.length > 0) {
    return res.status(400).json({ message: errors[0] });
  }

  next();
};

module.exports = { uploadImages, validateFileSizes };
