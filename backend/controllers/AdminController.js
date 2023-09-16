'use strinct'

const Admin = require("../models/admin"); 
const bcrypt = require("../helpers/bcrypt");
const jwt = require("../helpers/jwt");

const register_admin = (req, res) => {
    const data = req.body;
    // Validate password
    if (!data.password) {
        // res.status(500).send({
        //     message: 'No password provided.'
        // });
        // return;
        data.password = '123456789';
    }

    bcrypt.encryptPassword(data.password)
        .then(hash => {
            data.password = hash;
            // Validate if there is an admin using email
            Admin.find({ email: data.email })
                .then(admin => {
                    if (admin.length == 0) {
                        // Register admin
                        Admin.create(data)
                            .then(registeredAdmin => {
                                res.status(201).send({
                                    message: 'Admin registered.',
                                    admin:registeredAdmin
                                });
                             });
                    }else {
                        res.status(500).send({
                        message: 'The admin already exists in DB.'
                    });
                 }
            })
        .catch(err => {
                    console.log(err);
                    res.status(500).send({message: err});
                });
        });
}

const login_admin = (req, res) => {
    const data = req.body;

    // Look up admin in DB
    Admin.find({email: data.email})
    .then( administrator => {
        if(administrator.length === 0) {
            res.status(500).send({
                message: 'Admin not found.',
            });
        }else {
            const admin = administrator[0];
            // Match passwords
            bcrypt.comparePasswords(data.password, admin.password)
            .then(match => {
                if(!match) return res.status(401).send({ message: 'Wrong credentials.' })

                res.status(200).send({
                    message: 'Admin found',
                    admin,
                    token: jwt.createToken(admin)
                });
            })
            .catch(err => {
                res.status(401).send({ err });
            });
        }
    });

}

const getAdmins = async(req, res) => {
    if (!req.user || !req.user.role === 'admin') return  res.status(403).send({ message: 'No Access Granted.'});
    
    try {
        const data = await Admin.find();

        if (!data) return res.status(500).send({ message: 'Data not found' });

        res.status(200).send({ data });
        
    } catch (error) {
        res.status(500).send({ message: error });
    }
   
}

const getAdminById = async (req, res) => {
    if (!req.user || !req.user.role === 'admin') return  res.status(403).send({ message: 'No Access Granted.'});

    const id = req.params['id'];

    try {
        const adminFound = await Admin.findById({_id: id}); 

        if (!adminFound) return res.status(500).send({ message: 'Data not found' });

        res.status(200).send({ data:adminFound });
        
    } catch (error) {
        res.status(500).send({ message: error });
    }
}

const updateAdmin = async(req, res) => {
    if (!req || req.user.role !== 'admin') return  res.status(403).send({ message: 'No Access Granted.'});

    try {
        const id = req.params['id'];
        const body = req.body;
        const adminUpdated = await Admin.findByIdAndUpdate({ _id:id }, { 
            name: body.name,
            lastname: body.lastname,
            dni: body.dni,
            email: body.email,
            phone: body.phone,
            role: body.role
         });
        if(!adminUpdated) return res.status(400).send({ message: 'Admin info was not updated.'})

        res.status(200).send({ message: 'Admin info updated correctly.'})
        
    } catch (error) {
        
    }
}

const deleteAdmin = async(req, res) => {
    if (!req || req.user.role !== 'admin') return  res.status(403).send({ message: 'No Access Granted.'});

    try {
        const id = req.params['id'];
        const body = req.body;
        const adminDeleted = await Admin.findByIdAndRemove({ _id:id });
        if(!adminDeleted) return res.status(400).send({ message: 'Admin was not deleted.'})

        res.status(200).send({ message: 'Admin deleted correctly.'})
        
    } catch (error) {
        
    }
}


module.exports = {
    register_admin,
    login_admin,
    getAdmins,
    getAdminById,
    updateAdmin,
    deleteAdmin
}