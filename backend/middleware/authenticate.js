'use strict'

const jwt = require("jwt-simple");
const moment = require("moment");
const secret = "memotoga";

exports.auth = (req, res, next) => {
    if (!req.headers.authorization) return res.status(403).send({ message: 'No Headers Error' });
    
    // get token and replace charcters that may cause an error
    const token = req.headers.authorization.replace(/['"]+/g,'');

    // split token
    const segment = token.split('.');

    // validate constant segment
    if (segment.length !== 3) return res.status(403).send({ message: 'Invalid Token.' });

    // validate token expiration
    try {
        // get decoded token
        const payload = jwt.decode(token, secret);
       
        //moment.unix gets the current date
        if(payload.exp <= moment.unix()) return res.status(403).send({ message: 'Expired Token.' });
        
        // Send payload (decode token) through the property user in the request
        req.user = payload;
        
    } catch (error) {
        res.status(403).send({ message: 'Invalid Token.' });
    }
    
    next();
}