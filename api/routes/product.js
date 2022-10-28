
const express = require('express');

const router = express.Router();

const mongoose = require('mongoose');

const Product = require('../models/product');

router.get('/',function(req,res,next) {
    Product.find().exec().
    then(doc=>{
        res.status(200).json({
            'products':doc,
        });
    }).catch(err=>{
        console.log(err);
    });
});
router.post('/',function(req,res,next) {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product.save().
    then(result => {
        res.status(200).json({
            'product': product,
        });
    }).
    catch(err => {
        console.log(err);
    })
});

router.get('/:productId',function(req,res,next){
    const productId = req.params.productId;
    Product.findById(productId).
    exec().
    then(doc=>{
        if(doc){
            res.status(200).json({
                'product': doc,
            });
        }else{
            res.status(404).json({
                'message': 'no product found',
            });
        }
    }).catch(err=>{
        console.log(err);
    });
});

router.delete('/:productId',function(req,res,next){
    const productId = req.params.productId;
    Product.remove({_id : productId}).
    exec().
    then(doc=>{
        res.status(200).json({
            'message': 'successfuly delete product',
        });
    }).catch(err=>{
        console.log(err);
    });
});

module.exports = router;