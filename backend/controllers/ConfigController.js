const Config = require('../models/config');
const fs = require("fs");
const path = require('path');


const getConfig = async (req, res) => {

    if(!req.user || req.user.role !== 'admin') {
        res.status(500).send({message: 'No Access Granted'});
    }

    try {
        const config = await Config.findById({ _id: '652d5e50eb970bd5ad0bc472'});
        res.status(200).send({message: 'Config found.', config});
    } catch (error) {
        res.status(500).send({message: 'Config not found.', error});
    }

}

const getConfigPublic = async (req, res) => {

    try {
        const config = await Config.findById({ _id: '652d5e50eb970bd5ad0bc472'});
        res.status(200).send({message: 'Config found.', config});
    } catch (error) {
        res.status(500).send({message: 'Config not found.', error});
    }

}

const getLogo = async (req, res) => {
    const img = req.params['img'];
    fs.stat('./uploads/configurations/'+img, function(err) {
        if(!err) {
            const path_img = path.join(__dirname, '..', 'uploads/configurations/'+img);
            res.status(200).sendFile(path.resolve(path_img));
        } else {
            const path_img = path.join(__dirname, '..', 'uploads/no-image.png');
            res.status(500).sendFile(path.resolve(path_img));
        }
    });
}


const updateConfig = async (req, res) => {
    if(!req.user || req.user.role !== 'admin') {
        res.status(500).send({message: 'No Access Granted'});
    }

    try {
        const data = req.body;
        let configUpdated = undefined;
        if(req.files) {
            const img_path = req.files.logo.path;
            const img_name = img_path.split('/')[8];
            const logo_name = img_name;

            configUpdated = await Config.findByIdAndUpdate({_id: '652d5e50eb970bd5ad0bc472'}, {
                categories: JSON.parse(data.categories),
                title: data.title,
                logo: logo_name,
                serie: data.serie,
                correlative: data.correlative
            });

              
        fs.stat('./uploads/configurations/'+configUpdated.logo, function(err) {
            if (!err) {
            // fs.unlink removes images of that are not useful
            fs.unlink('./uploads/configurations/'+configUpdated.logo, () => {
                if (err) {
                    throw(err);
                }
            });
            }
        });
        res.status(200).send({message: 'config updated', configUpdated})


        }else {
            configUpdated = await Config.findByIdAndUpdate({_id: '652d5e50eb970bd5ad0bc472'}, {
                categories: data.categories,
                title: data.title,
                serie: data.serie,
                correlative: data.correlative
            });
            res.status(200).send({message: 'config updated', configUpdated})
        }
        // const config = await Config.create({
        //     categories: [],
        //     title: 'Createx',
        //     logo: 'logo.png',
        //     serie: '001',
        //     correlative: '000001'
        // });
    } catch (error) {
        res.status(500).send({message: 'Config not created', error})
    }
}






module.exports = {
    getConfig,
    getConfigPublic,
    getLogo,
    updateConfig
}