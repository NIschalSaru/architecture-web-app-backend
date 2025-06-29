const asyncHandler = require("express-async-handler");
const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");
const ByLawsInfo = require("../model/byLawsInfo.js");

const createByLawsInfo = asyncHandler(async (req, res) => {
  const { title, feature, description } = req.body;
  if (!title) {
    return res.status(400).json({ message: "Title is required." });
  }
  if (description && description.length > 255) {
    return res
      .status(400)
      .json({ message: "Description must be under 255 characters." });
  }
  let filename = null;
  let filepath = null;
  let image = null;
  let imagepath = null;
  const uploadedFile = req.files?.file?.[0];
  const uploadedImage = req.files?.image?.[0];
  if (uploadedFile) {
    const folderName = dayjs().format("YYYYMMDD");
    filename = uploadedFile.filename;
    filepath = `/uploads/${folderName}/${filename}`;
  }
  if (uploadedImage) {
    const folderName = dayjs().format("YYYYMMDD");
    image = uploadedImage.filename;
    imagepath = `/uploads/${folderName}/${image}`;
  }
  const newByLaws = await ByLawsInfo.create({
    title,
    description,
    feature,
    filename,
    filepath,
    image,
    imagepath,
  });
  res.status(201).json({
    message: "Record created successfully.",
    data: newByLaws,
  });
});

const getByLawsInfoByFeature = asyncHandler(async (req, res) => {
  const records = await ByLawsInfo.findAll({
    where: { feature: true },
    order: [["createdAt", "DESC"]],
  });
  res.status(200).json({ success: true, data: records });
});

const getAllByLawsInfo = asyncHandler(async (req, res) => {
  const records = await ByLawsInfo.findAll({
    order: [["createdAt", "DESC"]],
  });
  res.status(200).json({ success: true, data: records });
});

const updateByLawsInfo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, feature, description } = req.body;
  const record = await ByLawsInfo.findByPk(id);
  if (!record) {
    return res.status(404).json({ message: "ByLaws info not found." });
  }
  if (description && description.length > 255) {
    return res
      .status(400)
      .json({ message: "Description must be under 255 characters." });
  }
  let filename = record.filename;
  let filepath = record.filepath;
  let image = record.image;
  let imagepath = record.imagepath;
  const uploadedFile = req.files?.file?.[0];
  const uploadedImage = req.files?.image?.[0];
  if (uploadedFile) {
    if (filepath) {
      const sanitizedPath = filepath.replace(/^\/+/, "");
      const localPath = path.resolve(__dirname, "..", "storage", sanitizedPath);
      if (fs.existsSync(localPath)) {
        try {
          fs.unlinkSync(localPath);
        } catch (err) {
          console.warn("Failed to delete old file:", err.message);
        }
      }
    }
    const folderName = dayjs().format("YYYYMMDD");
    filename = uploadedFile.filename;
    filepath = `/uploads/${folderName}/${filename}`;
  }
  if (uploadedImage) {
    if (imagepath) {
      const sanitizedPath = imagepath.replace(/^\/+/, "");
      const localPath = path.resolve(__dirname, "..", "storage", sanitizedPath);
      if (fs.existsSync(localPath)) {
        try {
          fs.unlinkSync(localPath);
        } catch (err) {
          console.warn("Failed to delete old image:", err.message);
        }
      }
    }
    const folderName = dayjs().format("YYYYMMDD");
    image = uploadedImage.filename;
    imagepath = `/uploads/${folderName}/${image}`;
  }
  await record.update({
    title,
    description,
    feature,
    filename,
    filepath,
    image,
    imagepath,
  });
  res.status(200).json({
    message: "Record updated successfully.",
    data: record,
  });
});

const deleteByLawsInfo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const record = await ByLawsInfo.findByPk(id);
  if (!record) {
    return res.status(404).json({ message: "ByLaws info not found." });
  }
  if (record.filepath) {
    const sanitizedPath = record.filepath.replace(/^\/+/, "");
    const localPath = path.resolve(__dirname, "..", "storage", sanitizedPath);
    if (fs.existsSync(localPath)) {
      try {
        fs.unlinkSync(localPath);
      } catch (err) {
        console.warn("Failed to delete local file:", err.message);
      }
    }
  }
  await record.destroy();
  res.status(200).json({ message: "Record deleted successfully." });
});

module.exports = {
  createByLawsInfo,
  getAllByLawsInfo,
  updateByLawsInfo,
  deleteByLawsInfo,
  getByLawsInfoByFeature,
};
