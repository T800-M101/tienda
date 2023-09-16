'use strict'

const mongoose = require("mongoose");

const customerSchema = mongoose.Schema({
    name: {type: String, required: true},
    lastname: {type: String, required: true},
    country: {type: String, required: false},
    email: {type: String, required: true},
    password: {type: String, default: '123456789',required: true},
    profile: {type: String, default: 'profile.png', required: true},
    phone: {type: String, required: false},
    gender: {type: String, required: false},
    birthdate: {type: String, required: false},
    dni: {type: String, required: false},
    createdAt: {type: Date, default: Date.now, required: true}
});

module.exports = mongoose.model('Customer', customerSchema);