const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");
const TeamMember = require("../model/teamMember.js");
const { asyncHandler } = require("../services/async.handler.js");

const createTeamMember = asyncHandler(async (req, res) => {
  const { name, designation, contact_no, is_featured, order } = req.body;

  if (!name || !designation) {
    return res
      .status(400)
      .json({ message: "Name and designation are required" });
  }

  if (order === undefined || order === null || order === "") {
    return res.status(400).json({ message: "Order is required" });
  }

  const existingOrder = await TeamMember.findOne({
    where: { order: parseInt(order) },
  });

  if (existingOrder) {
    return res
      .status(400)
      .json({ message: "This order position is already occupied" });
  }

  const uploadedImage = req.files?.image?.[0];

  let filename = null;
  let filepath = null;
  let imageUrl = null;

  if (uploadedImage) {
    const folderName = dayjs().format("YYYYMMDD");
    filename = uploadedImage.filename;
    filepath = `/uploads/${folderName}/${filename}`;
  }

  const data = await TeamMember.create({
    name,
    designation,
    contact_no,
    is_featured: is_featured,
    order: parseInt(order),
    filename,
    filepath,
    imageUrl,
  });

  return res.status(201).json({
    message: "Team member created successfully",
    data: {
      id: data.id,
      name: data.name,
      designation: data.designation,
      contact_no: data.contact_no,
      is_featured: data.is_featured,
      order: data.order,
      imageUrl: data.imageUrl,
      filepath: data.filepath,
    },
  });
});

const updateTeamMember = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, designation, contact_no, is_featured, order } = req.body;

  const teamMember = await TeamMember.findByPk(id);
  if (!teamMember) {
    return res
      .status(404)
      .json({ success: false, message: "Team member not found" });
  }

  let finalOrder = teamMember.order;

  if (order !== undefined) {
    const parsedOrder = parseInt(order, 10);

    if (Number.isNaN(parsedOrder)) {
      return res.status(400).json({
        success: false,
        message: "Order must be a valid integer",
      });
    }

    if (parsedOrder !== teamMember.order) {
      const existingOrder = await TeamMember.findOne({
        where: { order: parsedOrder },
      });

      if (existingOrder) {
        return res
          .status(400)
          .json({ success: false, message: "This order position is already occupied" });
      }
    }

    finalOrder = parsedOrder;
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
    name: name ?? teamMember.name,
    designation: designation ?? teamMember.designation,
    contact_no: contact_no ?? teamMember.contact_no,
    is_featured: is_featured ?? teamMember.is_featured,
    order: finalOrder,
    filename,
    filepath,
    imageUrl,
  });

  return res.status(200).json({
    success: true,
    message: "Team member updated successfully",
    data: {
      id: teamMember.id,
      name: teamMember.name,
      designation: teamMember.designation,
      contact_no: teamMember.contact_no,
      is_featured: teamMember.is_featured,
      order: teamMember.order,
      imageUrl: teamMember.imageUrl,
      filepath: teamMember.filepath,
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

  await teamMember.update({ order: null });
  await teamMember.destroy();

  return res.status(200).json({
    success: true,
    message: "Team member deleted successfully",
  });
});

const getAllTeamMembers = asyncHandler(async (req, res) => {
  const teamMembers = await TeamMember.findAll({
    order: [["order", "ASC"]],
  });

  return res.status(200).json({ success: true, data: teamMembers });
});

const getFeaturedTeamMembers = asyncHandler(async (req, res) => {
  const featuredMembers = await TeamMember.findAll({
    where: { is_featured: true },
    attributes: { exclude: ["id", "contact_no"] },
    order: [["order", "ASC"]],
  });

  return res.status(200).json({
    success: true,
    data: featuredMembers,
  });
});

module.exports = {
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getAllTeamMembers,
  getFeaturedTeamMembers,
};
