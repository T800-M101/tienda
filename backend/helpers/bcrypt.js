const bcrypt = require("bcryptjs");


const encryptPassword = (password) => {
    const SALT_WORK_FACTOR = 10;
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, SALT_WORK_FACTOR)
        .then(hash => {
            resolve(hash);
        })
        .catch(err => {
            reject(err);
        })
    });
}

const comparePasswords = (pass1, pass2) => {
    return bcrypt.compare(pass1, pass2);
}


module.exports = {
    encryptPassword,
    comparePasswords
} 

