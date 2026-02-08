const Client = require("./client.js");
const Project = require("./project.js");
const ProjectType = require("./projectType.js");
const ProjectVideo = require("./projectVideo.js");
const Media = require("./media.js");

const models = { Client, Project, ProjectType, ProjectVideo, Media };

Object.values(models)
  .filter((model) => typeof model.associate === "function")
  .forEach((model) => model.associate(models));

module.exports = models;
