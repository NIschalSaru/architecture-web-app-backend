const ProjectType = require("../../model/projectType.js");
const { asyncHandler } = require("../../services/async.handler.js");

const createProjectType = asyncHandler(async (req, res) => {
  const { title, status } = req.body;
  if (!title || !status) {
    return res.status(400).json({ message: "Title and status are required" });
  }
  try {
    const data = await ProjectType.create({ title, status });
    res.status(201).json({
      message: "Record created successfully",
      data,
    });
  } catch (error) {
    console.error("Error creating Record:", error.message);
    res.status(500).json({ message: "Failed to create Record." });
  }
});

const getAllProjectTypes = asyncHandler(async (req, res) => {
  try {
    const projectTypes = await ProjectType.findAll({
      attributes: ["id", "title", "status"],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ success: true, data: projectTypes });
  } catch (error) {
    console.error("Error fetching Data:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

const getProjectTypesByStatus = asyncHandler(async (req, res) => {
  try {
    const projectTypes = await ProjectType.findAll({
      attributes: ["id", "title", "status"],
      where: { status: true },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ success: true, data: projectTypes });
  } catch (error) {
    console.error("Error fetching Data:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

const updateProjectType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, status } = req.body;
  const projectType = await ProjectType.findByPk(id);
  if (!projectType) {
    return res
      .status(404)
      .json({ success: false, message: "ProjectType not found" });
  }
  await projectType.update({ title, status });
  res.status(200).json({
    message: "Data updated successfully",
    data: projectType,
  });
});

const deleteProjectType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const projectType = await ProjectType.findByPk(id);
  if (!projectType) {
    return res.status(404).json({ success: false, message: "Data not found" });
  }
  try {
    await projectType.destroy();
    res.status(200).json({
      success: true,
      message: "Data deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting ProjectType:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete ProjectType",
    });
  }
});

module.exports = {
  createProjectType,
  getAllProjectTypes,
  getProjectTypesByStatus,
  updateProjectType,
  deleteProjectType,
};
