'use strict'

const express = require("express");
const couponController = require("../controllers/CouponController");

const api = express.Router();

const auth = require("../middleware/authenticate");


api.get('/getCoupons', auth.auth, couponController.getCoupons);
api.get('/getCouponById/:id', auth.auth, couponController.getCouponById);
api.post('/create_coupon', auth.auth,  couponController.create_coupon);
api.put('/updateCoupon/:id', auth.auth, couponController.updateCoupon);
api.delete('/deleteCoupon/:id', auth.auth, couponController.deleteCoupon);



module.exports = api;