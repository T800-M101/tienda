'use strict'

const express = require("express");
const customerController = require("../controllers/CustomerController");

const api = express.Router();

const auth = require("../middleware/authenticate");




api.post('/register_customer', customerController.register_customer);
api.post('/login_customer', customerController.login_customer);
api.get('/getCustomers', auth.auth, customerController.getCustomers);


module.exports = api;
