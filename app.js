const express = require('express');

const app = express();

const morgan = require("morgan");

const bodyparser = require('body-parser');

const mongoose = require('mongoose');

const productRoute = require('./api/routes/product');

mongoose.connect('mongodb://127.0.0.1:27017/product_db').then(()=>{
    console.log("Server Connect");
});


app.use(morgan('dev'));
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

app.use('/product', productRoute);

app.use(function(req, res, next){
    const error = new Error('Error occured');
    error.status = 404;
    next(error);
});

app.use(function(error, req, res, next){
res.status(error.status || 500);
res.json({
    error: {
        message: "Internal Server Error",
        code: error.status || 500,
    }
});
});

module.exports = app;