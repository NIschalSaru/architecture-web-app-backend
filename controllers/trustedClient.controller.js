const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");
const TrustedClient = require("../model/trustedClients.js");
const { asyncHandler } = require("../services/async.handler.js");

const createTrustedClient = asyncHandler(async (req, res) => {
  const { name, link, feature } = req.body;

  if (!name || !link) {
    return res.status(400).json({ message: "Name and link are required" });
  }

  const uploadedImage = req.files?.image?.[0];
  let filename = null;
  let filepath = null;
  let fileurl = null;

  if (uploadedImage) {
    const folderName = dayjs().format("YYYYMMDD");
    filename = uploadedImage.filename;
    filepath = `/uploads/${folderName}/${filename}`;
    fileurl = null; // ✅ Explicitly set to null
  }

  const client = await TrustedClient.create({
    name,
    link,
    filename,
    filepath,
    fileurl,
    feature,
  });

  return res.status(201).json({
    message: "Record created successfully",
    data: client,
  });
});

const getAllTrustedClientsByFeature = asyncHandler(async (req, res) => {
  const clients = await TrustedClient.findAll({
    where: {
      feature: true,
    },
    order: [["createdAt", "DESC"]],
  });
  return res.status(200).json({ success: true, data: clients });
});

const getAllTrustedClients = asyncHandler(async (req, res) => {
  const clients = await TrustedClient.findAll({
    order: [["createdAt", "DESC"]],
  });
  return res.status(200).json({ success: true, data: clients });
});

const updateTrustedClient = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, link, feature } = req.body;

  const client = await TrustedClient.findByPk(id);
  if (!client) {
    return res
      .status(404)
      .json({ success: false, message: "Record not found" });
  }

  const uploadedImage = req.files?.image?.[0];
  let filename = client.filename;
  let filepath = client.filepath;
  let fileurl = client.fileurl;

  if (uploadedImage) {
    if (client.filepath) {
      const sanitizedPath = client.filepath.replace(/^\/+/, "");
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
    fileurl = null; // ✅ Explicitly set to null
  }

  await client.update({
    name,
    link,
    feature,
    filename,
    filepath,
    fileurl,
  });

  return res.status(200).json({
    message: "Record updated successfully",
    data: {
      name,
      link,
      feature,
      fileurl,
      filepath,
    },
  });
});

const deleteTrustedClient = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const client = await TrustedClient.findByPk(id);

  if (!client) {
    return res.status(404).json({ message: "Trusted Client not found" });
  }

  if (client.filepath) {
    const sanitizedPath = client.filepath.replace(/^\/+/, "");
    const localPath = path.resolve(__dirname, "..", "storage", sanitizedPath);
    if (fs.existsSync(localPath)) {
      try {
        fs.unlinkSync(localPath);
      } catch (err) {
        console.warn("Failed to delete local file:", err.message);
      }
    }
  }

  await client.destroy();
  return res.status(200).json({
    success: true,
    message: "Record deleted successfully",
  });
});

module.exports = {
  createTrustedClient,
  getAllTrustedClients,
  updateTrustedClient,
  deleteTrustedClient,
  getAllTrustedClientsByFeature,
};
