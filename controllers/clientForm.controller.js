const { asyncHandler } = require("../services/async.handler.js");
const ClientForm = require("../model/clientForm.js");
const ALLOWED_STATUS = ["checked", "unchecked", "declined"];

const createClientForm = asyncHandler(async (req, res) => {
  let data = req.body;
  if (!data.status) {
    data.status = "unchecked";
  } else if (!ALLOWED_STATUS.includes(data.status)) {
    return res.status(400).json({
      message: "Invalid status value",
      allowed: ALLOWED_STATUS,
    });
  }
  const newForm = await ClientForm.create(data);
  return res.status(201).json({
    message: "Client form created successfully",
    data: newForm,
  });
});

const getAllClientForms = asyncHandler(async (req, res) => {
  const forms = await ClientForm.findAll();
  return res.status(200).json({
    message: "Client forms fetched successfully",
    data: forms,
  });
});

const updateClientForm = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const form = await ClientForm.findByPk(id);
  if (!form) {
    return res.status(404).json({
      message: "Client form not found",
    });
  }
  if (req.body.status && !ALLOWED_STATUS.includes(req.body.status)) {
    return res.status(400).json({
      message: "Invalid status value",
      allowed: ALLOWED_STATUS,
    });
  }
  await form.update(req.body);
  return res.status(200).json({
    message: "Client form updated successfully",
    data: form,
  });
});

const deleteClientForm = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const form = await ClientForm.findByPk(id);
  if (!form) {
    return res.status(404).json({
      message: "Client form not found",
    });
  }
  await form.destroy();
  return res.status(200).json({
    message: "Client form deleted successfully",
  });
});

const getStatusOptions = (req, res) => {
  const statuses = ["checked", "unchecked", "declined"];
  const status = statuses.map((status) => ({ key: status, value: status }));
  return res.status(200).json({
    message: "Status options fetched successfully",
    data: status,
  });
};

module.exports = {
  createClientForm,
  getAllClientForms,
  getStatusOptions,
  updateClientForm,
  deleteClientForm,
};
