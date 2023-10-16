'use strict'

const mongoose = require("mongoose");

const couponSchema = mongoose.Schema({
    code: { type: String, required:true },
    type: { type: String, required:true }, // Porcentaje o precio fijo
    value: { type: Number, required:true },
    limit: { type: Number, required:true },
    createdAt: { type: Date, default: Date.now, required: true }
});

module.exports = mongoose.model('Coupon', couponSchema);