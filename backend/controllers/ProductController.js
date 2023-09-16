'use strict'

const Product = require("../models/product");
const Inventory = require("../models/inventory");
const bcrypt = require("../helpers/bcrypt");
const jwt = require("../helpers/jwt");
const fs = require("fs");
const path = require("path");
const inventory = require("../models/inventory");

const register_product = (req, res) => {
    if (!req.user || req.user.role !== 'admin' ) return res.status(500).send( { message: 'No access granted.'})
   
    try { 
        
        const data = req.body; 
        const img_path = req.files.portada.path;
        const img_name = img_path.split('/')[8];
        data.portada = img_name;
        data.slug = data.name.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
        Product.create(data).then(product => {
            Inventory.create({
                admin: req.user.sub,
                quantity: data.stock,
                supplier: 'First record',
                product: product._id
            });
        
            res.status(200).send({
                message: 'Product created.',
                data: product,
                inventorory: product
            });
        });
        
        
        
    } catch (error) {
        res.status(500).send({ message: error})
    }
}


const updateProduct = async(req, res) => {
    if (!req || req.user.role !== 'admin') return  res.status(403).send({ message: 'No Access Granted.'});
    try {
        let productUpdated = undefined;
        const id = req.params['id'];
        const data = req.body; 
        data.slug = data.name.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
        if (req.files) {
            const img_path = req.files.portada.path;
            const img_name = img_path.split('/')[8];
            data.portada = img_name;


         productUpdated = await Product.findByIdAndUpdate({ _id:id }, { 
            name: data.name,
            stock: data.stock,
            price: data.price,
            category: data.category,
            description: data.description,
            content: data.content,
            slug: data.slug,
            portada: data.portada
        });

        // productUpdated receives the info of the product before being updated
        if(!productUpdated) return res.status(400).send({ message: 'Product info was not updated.'});
        
        fs.stat('./uploads/products/'+productUpdated.portada, function(err) {
            if (!err) {
            // fs.unlink removes images of that are not useful
            fs.unlink('./uploads/products/'+productUpdated.portada, () => {
                if (err) {
                    throw(err);
                }
            });
            }
        });

        res.status(200).send({ message: 'Product info updated correctly.'})

        } else {
         productUpdated = await Product.findByIdAndUpdate({ _id:id }, { 
                name: data.name,
                stock: data.stock,
                price: data.price,
                category: data.category,
                description: data.description,
                content: data.content,
                slug: data.slug,
            });
        // productUpdated receives the info of the product before being updated
        if(!productUpdated) return res.status(400).send({ message: 'Product info was not updated.'});

        res.status(200).send({ message: 'Product info updated correctly.'})
         
        }
    } catch (error) {
        res.status(500).send({ message: error});
    }
}

const getProducts = async (req, res) => {
    if (!req.user || !req.user.role === 'admin') return  res.status(403).send({ message: 'No Access Granted.'});
    
    try {
        const filter = req.params['filter'];
        const data = await Product.find({ name: new RegExp(filter, 'i')});

        if (!data) return res.status(500).send({ message: 'Data not found' });

        res.status(200).send({ products: data });
        
    } catch (error) {
        res.status(500).send({ message: error });
    }
}

const getProductById = async (req, res) => {
    if (!req.user || !req.user.role === 'admin') return  res.status(403).send({ message: 'No Access Granted.'});

    const id = req.params['id'];

    try {
        const productFound = await Product.findById({_id: id}); 

        if (!productFound) return res.status(500).send({ message: 'Data not found' });

        res.status(200).send({ data:productFound });
        
    } catch (error) {
        res.status(500).send({ message: error });
    }
}

const getPortada = async (req, res) => {
    const img = req.params['img'];
    fs.stat('./uploads/products/'+img, function(err) {
        if(!err) {
            const path_img = path.join(__dirname, '..', 'uploads/products/'+img);
            res.status(200).sendFile(path.resolve(path_img));
        } else {
            const path_img = path.join(__dirname, '..', 'uploads/no-image.png');
            res.status(500).sendFile(path.resolve(path_img));
        }
    });
}

const deleteProduct = async(req, res) => {
    if (!req || req.user.role !== 'admin') return  res.status(403).send({ message: 'No Access Granted.'});

    try {
        const id = req.params['id'];
        const body = req.body;
        const productDeleted = await Product.findByIdAndRemove({ _id:id });
        if(!productDeleted) return res.status(400).send({ message: 'Product was not deleted.'})

        res.status(200).send({ message: 'Product deleted correctly.'})
        
    } catch (error) {
        
    }
}

const getInventoryById = (req, res) => {
    
    if (!req.user || !req.user.role === 'admin') return  res.status(403).send({ message: 'No Access Granted.'});

    const id = req.params['id'];
    try {
        Inventory.find({product: id}).populate('admin').then(inventory => {
            res.status(200).send({
                message: 'Inventory data',
                data: inventory[0]
            });
        })
        .catch(error => {
            res.status(500).send({ message: `Inventory for product with id ${id} not found.`})
        });
        
    } catch (error) {
        res.status(500).send({ message: error});
    }

}


const deleteInventoryById = (req, res) => {

    if (!req || req.user.role !== 'admin') return  res.status(403).send({ message: 'No Access Granted.'});

    try {
        const id = req.params['id'];
        Inventory.findByIdAndRemove( {_id : id})
        .then(inventoryRemoved => {
            Product.find( {_id: inventoryRemoved.product})

            .then( productFound => {
                let newStock = productFound[0].stock - inventoryRemoved.quantity;
                Product.findByIdAndUpdate({ _id : inventoryRemoved.product}, { stock: newStock})
                
                .then( productUpdated => {
                    res.status(200).send( {message: 'Inventory updated.', data: productUpdated});
                });
            });
        })
        .catch(error => {
            res.status(500).send({ message: 'Inventory could not be deleted.'});
        });
        
    } catch (error) {
        res.status(500).send({ message: error});
    }
        
        
        
  

}

module.exports = {
    register_product,
    updateProduct,
    getProducts,
    getProductById,
    getPortada,
    deleteProduct,
    getInventoryById,
    deleteInventoryById
}