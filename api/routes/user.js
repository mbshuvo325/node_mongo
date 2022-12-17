const express = require('express');

const router = express.Router();

const mongoose = require('mongoose');

const User = require('../models/users');

router.post('/sendotp',function(req,res,next){
    const phoneNumber = req.body.phoneNumber;
    User.find({phone : phoneNumber}).exec().
    then(doc =>{
        const otp = Math.floor(100000 + Math.random() * 900000);
        if(doc.length < 1){
         saveUserAndSendOtp(phoneNumber,otp).then(result=>{
            console.log(result);
         res.status(200).json(result);
         });
        }
        let result = updateAndSendOtp(phoneNumber,otp);
        res.status(200).json(result);
    }).catch(err=>{
        console.log(err);
    })
});

async function saveUserAndSendOtp(phone,otp){
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        name: "NA",
        phone : phone,
        otp : otp,
    });
    user.save().then(result =>{
        return {'code' : 200};
    }).catch(err =>{
        return {'code' : 200};
    });
}

function updateAndSendOtp(phone,otp){
    const query = { phone: phone};
    var newvalues = {$set: {otp: otp} };
    User.updateOne(query,newvalues,function(err,res){
        if(err) {
            var result = {
                'code': 400,
                'message' : "not found"
            };
            return result;
        }
        var success = {
            'code': 200,
            'message' : "success"
        };
        return success;
    });
}

router.post('/verifyotp',function(req,res,next){
    const phoneNumber = req.body.phoneNumber;
    const otp = req.body.otp;
    User.findOne({phone : phoneNumber}).exec().
    then(doc =>{
       if(doc.otp == otp && doc.phone == phoneNumber){
        return res.status(200).json({
            'code': 200,
            'message' : 'Otp verify successfull',
            'token' : 'hjegrew3473bvch7rt37tr'
        });
       }
       return res.status(400).json({
        'code': 400,
        'message' : 'Otp does`t match',
    }); 

    }).catch(err=>{
        console.log(err);
    })
});


router.get('/test',function(req,res,next){
getData(5).then(rs=>{
    res.status(200).json(rs);
});
});

async function getData(a){
    if(a==5){
        return {'code' : 200,'message' : "cool"};
    }
    return {'code' : 400};
}

module.exports = router;
