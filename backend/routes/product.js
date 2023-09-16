'use strict'

const express = require("express");
const productController = require("../controllers/ProductController");
const path = require("path");

const api = express.Router();
const auth = require("../middleware/authenticate");
const multiparty = require("connect-multiparty");
const img_path = multiparty({uploadDir: path.join(__dirname, '..', 'uploads/products')});

api.post('/register_product', [auth.auth, img_path], productController.register_product);
api.get('/getProducts/:filter?', auth.auth, productController.getProducts);
api.get('/getProductById/:id', auth.auth, productController.getProductById);
api.get('/getPortada/:img', productController.getPortada);
api.put('/updateProduct/:id', [auth.auth, img_path], productController.updateProduct);
api.delete('/deleteProduct/:id', auth.auth, productController.deleteProduct);
api.get('/getInventoryById/:id', auth.auth, productController.getInventoryById);
api.delete('/deleteInventoryById/:id', auth.auth, productController.deleteInventoryById);
api.post('/modifyInventory', auth.auth, productController.modifyInventory);




module.exports = api;
