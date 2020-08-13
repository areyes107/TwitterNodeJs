const express = require("express");
const api = express.Router();
const commandsController = require("../controllers/commands.controller");
const authentication = require("../middleware/authentication");

api.post("/commands", authentication.ensureAuth, commandsController.commands);

module.exports = api;
