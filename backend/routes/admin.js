'use strict'

const express = require("express");
const adminController = require("../controllers/AdminController");
const auth = require("../middleware/authenticate");

const api = express.Router();

api.post('/register_admin', adminController.register_admin);
api.post('/login_admin', adminController.login_admin);
api.get('/getAdmins', auth.auth, adminController.getAdmins);
api.get('/getAdminById/:id', auth.auth, adminController.getAdminById);
api.put('/updateAdmin/:id', auth.auth, adminController.updateAdmin);
api.delete('/deleteAdmin/:id', auth.auth, adminController.deleteAdmin);


module.exports = api;