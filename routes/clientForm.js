const router = require("express").Router();
const {
  createClientForm,
  getAllClientForms,
  getStatusOptions,
  updateClientForm,
  deleteClientForm,
} = require("../controllers/clientForm.controller.js");
const ProtectRoute = require("../middleware/protect.route.js");

router.post("/", ProtectRoute, createClientForm);
router.put("/:id", ProtectRoute, updateClientForm);
router.delete("/:id", ProtectRoute, deleteClientForm);
router.get("/", ProtectRoute, getAllClientForms);
router.get("/status", ProtectRoute, getStatusOptions);

module.exports = router;
