'use strict'

const Customer = require("../models/customer");
const bcrypt = require("../helpers/bcrypt");
const jwt = require("../helpers/jwt");

const register_customer = (req, res) => {
    const data = req.body;
    // Validate password
    if (!data.password) {
        res.status(500).send({
            message: 'No password provided.'
        });
        return;
    }

    bcrypt.encryptPassword(data.password)
        .then(hash => {
            data.password = hash;
            // Validate if there is a customer using email
            Customer.find({ email: data.email })
                .then(customer => {
                    if (customer.length === 0) {
                        // Register customer
                        Customer.create(data)
                            .then(registeredCustomer => {
                                res.status(201).send({
                                    message: 'Customer registered.',
                                    customer:registeredCustomer
                                });
                             });
                    }else {
                        res.status(500).send({
                        message: 'The customer already exists in DB.'
                    });
                 }
            })
        .catch(err => {
            console.log(err);
            res.status(500).send({message: err});
        });
    });

}


const login_customer = (req, res) => {
    const data = req.body;

    //Look up customer in DB
    Customer.find({email: data.email})
    .then( customer => {
        if(customer.length === 0) {
            res.status(500).send({
                message: 'Customer not found.',
            });
        }else {
            const user = customer[0];
            // Match passwords
            bcrypt.comparePasswords(data.password, user.password)
            .then(match => {
                if(match) {
                        res.status(200).send({
                            message: 'Customer found.',
                            user,
                            token: jwt.createToken(user)
                        });
                }else {
                        res.status(401).send({
                            message: 'Wrong Credentials.'
                        });
                    }
                })
            .catch(err => {
                res.status(401).send({
                    err
                });
            })
        }
    });

}

const getCustomers = async (req, res) => {
    if (!req.user || !req.user.role === 'admin') return  res.status(403).send({ message: 'No Access Granted.'});
    
    const data = await Customer.find();
    res.status(200).send({ data });
}

module.exports = {
    register_customer,
    login_customer,
    getCustomers
}