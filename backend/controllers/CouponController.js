const Coupon = require('../models/coupon');

const create_coupon = async(req, res) => {

    if (req.user && req.user.role) {
        const data = req.body;
        const reg = await Coupon.create(data);
        res.status(200).send({
            message: 'Coupon created.',
            data: reg
        }) 
    } else {
        res.status(500).send({
            message: 'No Access Granted.'
        })
    }

}

const getCoupons = async (req, res) => {
   
    if (!req.user || !req.user.role === 'admin') return  res.status(403).send({ message: 'No Access Granted.'});

    try {
        const data = await Coupon.find();
        res.status(200).send({ message:data, data });
        
    } catch (error) {
        res.status(500).send({ message: 'Coupons not found' });
    }
    
}

const getCouponById = async (req, res) => {
    if (!req.user || !req.user.role === 'admin') return  res.status(403).send({ message: 'No Access Granted.'});

    
    try {
        const id = req.params['id'];
        const couponFound = await Coupon.findById({_id: id}); 
        res.status(200).send({ data:couponFound });
        
    } catch (error) {
        res.status(500).send({ message: 'Coupon not found' });
    }
}

const updateCoupon = async(req, res) => {
    if (!req || req.user.role !== 'admin') return  res.status(403).send({ message: 'No Access Granted.'});
    
    try {
        const id = req.params['id'];
        const data = req.body; 
        const couponUpdated = await Coupon.findByIdAndUpdate({ _id:id }, { 
            code: data.code,
            type: data.type,
            value: data.value,
            limit: data.limit
        });
        console.log(couponUpdated)
        res.status(200).send({ message: 'Coupon updated correctly.', data: couponUpdated})
    } catch (error) {
        res.status(400).send({ message: 'Coupon was not updated.'});
    }
}

const deleteCoupon = async(req, res) => {
    if (!req || req.user.role !== 'admin') return  res.status(403).send({ message: 'No Access Granted.'});

    try {
        const id = req.params['id'];
        const body = req.body;
        const couponDeleted = await Coupon.findByIdAndRemove({ _id:id });
        res.status(200).send({ message: 'Coupon deleted correctly.'});
    } catch (error) {
        res.status(400).send({ message: 'Coupon was not deleted.'});
    }
}


module.exports = {
    create_coupon,
    getCoupons,
    getCouponById,
    updateCoupon,
    deleteCoupon
}

