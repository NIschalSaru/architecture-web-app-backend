const router = require("express").Router();
const {
  createProjectType,
  getAllProjectTypes,
  getProjectTypesByStatus,
  updateProjectType,
  deleteProjectType,
} = require("../controllers/project/projectType.controller.js");

const {
  createProject,
  updateProject,
  deleteProject,
  getClientByProjectTypeId,
  getProjectByClientId,
  deleteMediaById,
  getProjectById,
  getAllProjects,
  getAllClients,
  getLatestProjects,
} = require("../controllers/project/project.controller.js");
const ProtectRoute = require("../middleware/protect.route.js");
const { uploadImages } = require("../middleware/multer.middleware.js");

// Project Type Routes
router.post("/project-types/", ProtectRoute, createProjectType);
router.get("/project-types/", getAllProjectTypes);
router.get("/active-project-types/", getProjectTypesByStatus);
router.put("/project-types/:id", ProtectRoute, updateProjectType);
router.delete("/project-types/:id", ProtectRoute, deleteProjectType);

// Project Routes
router.post("/", ProtectRoute, uploadImages, createProject);
router.put("/:id", ProtectRoute, uploadImages, updateProject);
router.delete("/:id", ProtectRoute, deleteProject);
router.delete("/media/:id", ProtectRoute, deleteMediaById);
router.get("/get-clients/:project_type_id", getClientByProjectTypeId);
router.get("/get-project/:client_id", getProjectByClientId);
router.get("/get-project-by-id/:id", getProjectById);
router.get("/get-projects", getAllProjects);
router.get("/get-clients", getAllClients);
router.get("/get-latest-projects", getLatestProjects);

module.exports = router;
