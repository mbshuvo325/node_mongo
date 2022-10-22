
const express = require('express');

const router = express.Router();

const mongoose = require('mongoose');

const Product = require('../models/product');

router.get('/',function(req,res,next) {
    
});
router.post('/',function(req,res,next) {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product.save().
    then(result => {
        console.log(result);
    }).
    catch(err => {
        console.log(err);
    })
});

module.exports = router;