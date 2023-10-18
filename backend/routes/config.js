'use strict'

const express = require("express");
const configController = require("../controllers/ConfigController");
const path = require("path");

const api = express.Router();

const auth = require("../middleware/authenticate");

const multiparty = require("connect-multiparty");
const img_path = multiparty({uploadDir: path.join(__dirname, '..', 'uploads/configurations')});


api.get('/getConfig', auth.auth, configController.getConfig);
api.get('/getConfigPublic', configController.getConfigPublic);
api.get('/getLogo/:img', configController.getLogo);
api.put('/updateConfig/:id', [auth.auth, img_path], configController.updateConfig);






module.exports = api;