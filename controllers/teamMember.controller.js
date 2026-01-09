const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");
const TeamMember = require("../model/teamMember.js");
const { asyncHandler } = require("../services/async.handler.js");

const createTeamMember = asyncHandler(async (req, res) => {
  const { name, designation, contact_no, is_featured } = req.body;

  if (!name || !designation) {
    return res.status(400).json({ message: "Name and designation are required" });
  }

  const uploadedImage = req.files?.image?.[0];
  let filename = null;
  let imagePath = null;
  let imageUrl = null;

  if (uploadedImage) {
    const folderName = dayjs().format("YYYYMMDD");
    filename = uploadedImage.filename;
    imagePath = `/uploads/${folderName}/${filename}`;
    imageUrl = null;
  }

  const data = await TeamMember.create({
    name,
    designation,
    contact_no,
    is_featured: is_featured === "true" || is_featured === true,
    filename,
    filepath: imagePath,
    imageUrl,
  });

  res.status(201).json({
    message: "Team member created successfully",
    data: {
      id: data.id,
      name,
      designation,
      contact_no,
      is_featured: data.is_featured,
      imageUrl,
      filepath: imagePath,
    },
  });
});

const updateTeamMember = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, designation, contact_no, is_featured } = req.body;
  const teamMember = await TeamMember.findByPk(id);

  if (!teamMember) {
    return res.status(404).json({ success: false, message: "Team member not found" });
  }

  const uploadedImage = req.files?.image?.[0];
  let filename = teamMember.filename;
  let filepath = teamMember.filepath;
  let imageUrl = teamMember.imageUrl;

  if (uploadedImage) {
    if (teamMember.filepath) {
      const sanitizedPath = teamMember.filepath.replace(/^\/+/, "");
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
    imageUrl = null;
  }

  await teamMember.update({
    name,
    designation,
    contact_no,
    is_featured: is_featured === "true" || is_featured === true,
    filename,
    filepath,
    imageUrl,
  });

  return res.status(200).json({
    message: "Team member updated successfully",
    data: {
      id: teamMember.id,
      name,
      designation,
      contact_no,
      is_featured: teamMember.is_featured,
      imageUrl,
      filepath,
    },
  });
});

const deleteTeamMember = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const teamMember = await TeamMember.findByPk(id);

  if (!teamMember) {
    return res.status(404).json({ message: "Team member not found" });
  }

  if (teamMember.filepath) {
    const sanitizedPath = teamMember.filepath.replace(/^\/+/, "");
    const localPath = path.resolve(__dirname, "..", "storage", sanitizedPath);
    if (fs.existsSync(localPath)) {
      try {
        fs.unlinkSync(localPath);
      } catch (err) {
        console.warn("Failed to delete local file:", err.message);
      }
    }
  }

  await teamMember.destroy();
  return res.status(200).json({
    success: true,
    message: "Team member deleted successfully",
  });
});

const getAllTeamMembers = asyncHandler(async (req, res) => {
  const teamMembers = await TeamMember.findAll({
    order: [["createdAt", "DESC"]],
  });
  return res.status(200).json({ success: true, data: teamMembers });
});

const getFeaturedTeamMembers = asyncHandler(async (req, res) => {
  const featuredMembers = await TeamMember.findAll({
    where: { is_featured: true },
    attributes: { exclude: ['id', 'contact_no'] },
    order: [["createdAt", "DESC"]],
  });
  return res.status(200).json({
    success: true,
    data: featuredMembers,
  });
});

module.exports = {
  createTeamMember,
  getAllTeamMembers,
  getFeaturedTeamMembers,
  updateTeamMember,
  deleteTeamMember,
};
