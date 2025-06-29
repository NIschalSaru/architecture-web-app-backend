const Client = require("./client.js");
const Project = require("./project.js");
const ProjectType = require("./projectType.js");
const Media = require("./media.js");

const models = { Client, Project, ProjectType, Media };

Object.values(models)
  .filter((model) => typeof model.associate === "function")
  .forEach((model) => model.associate(models));

module.exports = models;
