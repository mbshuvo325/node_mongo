
const express = require('express');

const router = express.Router();

const mongoose = require('mongoose');

const Product = require('../models/product');

router.get('/',async function(req,res,next) {
    try{
        var products = await Product.find();
        res.status(200).json({
            'statusCode' : 200,
            'message' : 'successfuly get products',
            'products': products
         });
    }catch(err){
        res.status(400).json({
            'statusCode' : err.statusCode,
            'error' : err,
        });
    }
});
router.post('/',async function(req,res,next) {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    try{
    var newProduct = await product.save();
    res.status(200).json({
        'statusCode' : 200,
        'message' : 'successfuly add product',
        'product': newProduct
        });
    }catch(err){
        res.status(400).json({
            'statusCode' : 400,
            'error' : err,
        });
        console.log(err);
    }
});

router.get('/:productId', async function(req,res,next){
    const productId = req.params.productId;
    try{
        var product = await Product.findById(productId);
        res.status(200).json({
            'statusCode' : 200,
            'message' : 'successfuly get product',
            'product': product
        });
    }catch(err){
        res.status(400).json({
            'statusCode' : err.statusCode,
            'error' : err,
        });
    }
});

router.delete('/:productId', async function(req,res,next){
    try{
        await Product.findByIdAndRemove({_id : req.params.productId});
        res.status(200).json({
            'statusCode' : 200,
            'message' : 'successfuly delete product',
        });
    }catch(err){
        res.status(400).json({
            'statusCode' : err.statusCode,
            'error' : err,
        });
    }
});

router.patch('/:productId', async function(req,res,next) {
    try{
        var product = await Product.findByIdAndUpdate(req.params.productId,{$set:{name : req.body.name,price:req.body.price}});
            res.status(200).json({
                'statusCode' : 200,
                'message' : 'successfully update product',
                'product': product
            });
    }catch(err){
        res.status(400).json({
            'statusCode' : 400,
            'error' : err,
        });
    }
});


module.exports = router;