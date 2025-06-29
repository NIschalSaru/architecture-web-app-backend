const router = require("express").Router();
const {
  createClientContactForm,
  getAllClientContactForms,
  deleteClientContactForm,
} = require("../controllers/clientContactForm.controller.js");
const ProtectRoute = require("../middleware/protect.route.js");

router.post("/", ProtectRoute, createClientContactForm);
router.delete("/:id", ProtectRoute, deleteClientContactForm);
router.get("/", ProtectRoute, getAllClientContactForms);

module.exports = router;
