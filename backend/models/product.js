'use strict'

const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name : {type: String, required: true},
    slug: {type: String, required: true},
    gallery: [{type: Object, required: false}],
    portada: {type: String, required: true},
    price: {type: Number, required: true},
    description: {type: String, required: true},
    content: {type: String, required: true},
    stock: {type: Number, required: true},
    nsales: {type: Number, default: 0, required: true},
    npoints: {type: Number, default: 0, required: true},
    category: {type: String, required: true},
    state: {type: String, default: 'Edit', required: true},
    createdAt: {type: Date, default: Date.now, required: true}
});

module.exports = mongoose.model('Product', productSchema);