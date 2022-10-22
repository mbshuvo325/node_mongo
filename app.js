const express = require('express');

const app = express();

const morgan = require("morgan");

const bodyparser = require('body-parser');

const mongoose = require('mongoose');

const productRoute = require('./api/routes/product');

mongoose.connect("mongodb+srv://node-api:node-api@node-api.5shxmmm.mongodb.net/?retryWrites=true&w=majority",(err) => {
    if(err) throw err;
    console.log('connected to MongoDB')
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