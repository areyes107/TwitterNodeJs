const express = require("express");
const api = express.Router();
const userController = require("../controllers/user.controller");
const authentication = require("../middleware/authentication");

api.post("/commands", authentication.ensureAuth, userController.commands);

module.exports = api;
