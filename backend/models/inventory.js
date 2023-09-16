'use strict'

const mongoose = require("mongoose");

const inventorySchema = mongoose.Schema({
    product: {type: mongoose.Schema.ObjectId, ref: 'Produc', required: true},
    quantity: {type: Number, required: true},
    admin: {type: mongoose.Schema.ObjectId, ref:'Admin', required: true},
    supplier: {type: String, required: true},
    createdAt: {type: Date, default: Date.now, required: true}
});

module.exports = mongoose.model('Inventory', inventorySchema);