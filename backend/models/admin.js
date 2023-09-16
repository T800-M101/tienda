'use strict'

const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
    name: {type: String, required: true},
    lastname: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, default: '123456789', required: true},
    phone: {type: String, required: true},
    role: {type: String, required: true},
    dni: {type: String, required: true},
    createdAt: {type: Date, default: Date.now, required: true}
});

module.exports = mongoose.model('Admin', adminSchema);