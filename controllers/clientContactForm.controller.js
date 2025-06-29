const ClientContactForm = require("../model/clientContactForm.js");
const { asyncHandler } = require("../services/async.handler.js");

const createClientContactForm = asyncHandler(async (req, res) => {
  const { name, phone, requirements, services } = req.body;
  if (!name || !requirements || !services || !phone) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields.",
    });
  }

  try {
    const data = await ClientContactForm.create({
      name,
      phone,
      requirements,
      services,
    });
    res.status(201).json({
      success: true,
      message: "Client contact form submitted successfully.",
      data,
    });
  } catch (error) {
    console.error("Error creating contact form:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create contact form.",
    });
  }
});

const getAllClientContactForms = asyncHandler(async (req, res) => {
  try {
    const data = await ClientContactForm.findAll({
      attributes: [
        "id",
        "name",
        "phone",
        "requirements",
        "services",
        "createdAt",
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error fetching contact forms:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve contact forms.",
    });
  }
});

const deleteClientContactForm = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const formEntry = await ClientContactForm.findByPk(id);
  if (!formEntry) {
    return res.status(404).json({
      success: false,
      message: "Contact form not found.",
    });
  }
  try {
    await formEntry.destroy();
    res.status(200).json({
      success: true,
      message: "Contact form deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting contact form:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete contact form.",
    });
  }
});

module.exports = {
  createClientContactForm,
  getAllClientContactForms,
  deleteClientContactForm,
};
