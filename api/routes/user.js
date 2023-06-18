const express = require('express');

const router = express.Router();

//const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');

const User = require('../models/users'); 

const helper = require('../helpers/user_helper');

router.get('/getuser', async function(req,res,next){
    const token = req.headers.authorization.split(' ')[1];
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    try{
        const verified = jwt.verify(token,jwtSecretKey);
    if(verified){
        const id = verified.userId;
        User.findById(id, function (err, docs) {
        if (err){
            console.log(err);
            res.status(400).send({
                'code' : 400,
                'error' : err
            });
        }
        else{
            var newUser = docs.toObject();
            delete newUser.otp;
            delete newUser.device_id;
            delete newUser.__v;
            res.status(200).send({
                'code' : 200,
                'user' : newUser  
            });
        }
    });
    }else{
        res.status(401).send(error);
    }
    }catch(e){
        res.status(401).send(e);
    }
});

router.post('/sendotp', async function(req,res,next) {
    const phoneNumber = req.body.phoneNumber;
    const otp = Math.floor(100000 + Math.random() * 900000);
    const user = await helper.findUser(phoneNumber);
   if(user.length < 1){
    const data = await helper.saveUserAndSendOtp(phoneNumber,otp);
    res.status(data.code).send(data);
   }
   const data = await helper.updateAndSendOtp(phoneNumber,otp);
    res.status(data.code).send(data);
});
router.post('/verifyotp', async function(req,res,next){
    const phoneNumber = req.body.phoneNumber;
    const otp = req.body.otp;
    var result = await helper.findUser(phoneNumber);
    if(result.code !== 404){
        if(result.otp === otp){
            await helper.updateToken(result._id);
            var user = await helper.findUser(phoneNumber);
            var newUser = user.toObject();
            delete newUser.otp;
            delete newUser.device_id;
            delete newUser.__v;
            return res.status(200).send({
                'code': 200,
                'message' : 'Otp verify successfull',
                'user' : newUser
            });
        }else{
            return res.status(202).send({
                'code': 303,
                'message' : 'Otp not match',

            }); 
        }
    }else{
        return res.status(200).send(result); 
    }
});

router.put('/update/:userId', async function(req,res,next){
    const id = req.params.userId;
    var newvalues = { 
            name: req.body.name,
            profile_image: req.body.image,
            address : req.body.address
    };
     User.findByIdAndUpdate(id,newvalues,function(err, docs){
        if (err){
            console.log(err);
            res.status(400).send({
                'code' : 400,
                'message' : 'User update unSuccessful',
            });
        }
        else{
            console.log(docs);
            var newUser = docs.toObject();
                delete newUser.otp;
                delete newUser.device_id;
                delete newUser.__v;
                delete newUser.token;
            res.status(200).send({
                'code' : 200,
                'message' : 'User update successful',
                'user' : newUser
            });
        }
    });
});
 
module.exports = router;
