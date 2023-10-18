'use strict'

const mongoose = require("mongoose");

const configSchema = mongoose.Schema({
    categories: [{type: Object, required: true}],
    title: {type: String, required: true},
    logo: {type: String, required: true},
    serie: {type: String, required: true},
    correlative: {type: String, required: true},
    // createdAt: {type: Date, default: Date.now, required: true}
});

module.exports = mongoose.model('Config', configSchema);