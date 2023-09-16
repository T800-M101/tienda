'use strict'

const Product = require("../models/product");
const Inventory = require("../models/inventory");
const bcrypt = require("../helpers/bcrypt");
const jwt = require("../helpers/jwt");
const fs = require("fs");
const path = require("path");
const inventory = require("../models/inventory");

const register_product = async (req, res) => {
    if (!req.user || req.user.role !== 'admin' ) return res.status(500).send( { message: 'No access granted.'})
   
    try { 
        
        const data = req.body; 
        const img_path = req.files.portada.path;
        const img_name = img_path.split('/')[8];
        data.portada = img_name;
        data.slug = data.name.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
        const product = await Product.create(data);
        const inventory = await Inventory.create({
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
        
    } catch (error) {
        res.status(500).send({ message: 'Product was not created.'})
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
        res.status(200).send({ message: 'Product info updated correctly.'})
         
        }
    } catch (error) {
        res.status(400).send({ message: 'Product info was not updated.'});
    }
}


const getProducts = async (req, res) => {
    if (!req.user || !req.user.role === 'admin') return  res.status(403).send({ message: 'No Access Granted.'});
    
    try {
        const filter = req.params['filter'];
        const data = await Product.find({ name: new RegExp(filter, 'i')});
        res.status(200).send({ products: data });
        
    } catch (error) {
        res.status(500).send({ message: 'Data not found' });
    }
}

const getProductById = async (req, res) => {
    if (!req.user || !req.user.role === 'admin') return  res.status(403).send({ message: 'No Access Granted.'});

    
    try {
        const id = req.params['id'];
        const productFound = await Product.findById({_id: id}); 
        res.status(200).send({ data:productFound });
        
    } catch (error) {
        res.status(500).send({ message: 'Data not found' });
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
        res.status(200).send({ message: 'Product deleted correctly.'});
    } catch (error) {
        res.status(400).send({ message: 'Product was not deleted.'});
    }
}

const getInventoryById = async (req, res) => {
    
    if (!req.user || !req.user.role === 'admin') return  res.status(403).send({ message: 'No Access Granted.'});

    try {
        const id = req.params['id'];

        const inventory = await Inventory.find({product: id}).populate('admin').sort({ createdAt: -1 });
        
        res.status(200).send({ message: 'Inventory data', data: inventory });
        
    } catch (error) {
        res.status(500).send({ message: `Inventory for product with id ${id} not found.`})
    }

}


const deleteInventoryById = async (req, res) => {

    if (!req || req.user.role !== 'admin') return  res.status(403).send({ message: 'No Access Granted.'});

    try {
        const id = req.params['id'];

        const inventoryRemoved = await Inventory.findByIdAndRemove( {_id : id});

        const productFound = await Product.findById( {_id: inventoryRemoved.product});

        let newStock = productFound.stock - inventoryRemoved.quantity;

        const productUpdated = await Product.findByIdAndUpdate({ _id : inventoryRemoved.product}, { stock: newStock});

        res.status(200).send( {message: 'Inventory updated.', data: productUpdated});
        
    } catch (error) {
        res.status(500).send({ message: 'Inventory could not be deleted.'});
    }
            
}


const modifyInventory = async (req, res) => {
    if (!req || req.user.role !== 'admin') return  res.status(403).send({ message: 'No Access Granted.'});

    try {
        let data = req.body; 

        const inventoryCreated = await Inventory.create(data);

        const productFound = await Product.findById( {_id: inventoryCreated.product});

        let newStock = productFound.stock + inventoryCreated.quantity;

        const productUpdated = await Product.findByIdAndUpdate({ _id : inventoryCreated.product}, { stock: newStock});
        
        res.status(200).send( { message: 'New stock added.', data });

    } catch (error) {
        res.status(500).send( { message: error.message });
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
    deleteInventoryById,
    modifyInventory
}