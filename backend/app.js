'use strict'

const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
require('dotenv').config();
const port = process.env.port || 4201;

//Importing routes
const customer_route = require("./routes/customer");
const admin_route = require("./routes/admin");
const product_route = require("./routes/product");
const coupon_route = require("./routes/coupon");


// Initialize express
const app = express();

// DB conection
 mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.l3fu03a.mongodb.net/tienda`)
.then(() => {
    app.listen(port, function() {
        console.log('Server running on port '+ port);
    });
})
.catch((err) => {
    console.log(err);
});

// Middleware
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json({limit: '50mb', extended: true}));

// EnableCORS
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*'); 
    res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods','GET, PUT, POST, DELETE, OPTIONS');
    res.header('Allow','GET, PUT, POST, DELETE, OPTIONS');
    next();
});

// Call routes
app.use('/api', customer_route);
app.use('/api', admin_route);
app.use('/api', product_route);
app.use('/api', coupon_route)



module.exports = app;