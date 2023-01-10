const express = require('express');

const router = express.Router();

const mongoose = require('mongoose');

const User = require('../models/users');

router.post('/sendotp', async function(req,res,next) {
    const phoneNumber = req.body.phoneNumber;
    const otp = Math.floor(100000 + Math.random() * 900000);
    const user = await User.find({phone : phoneNumber}).exec();
   if(user.length < 1){
    const data = await saveUserAndSendOtp(phoneNumber,otp);
    res.status(data.code).send(data);
   }
   const data = await updateAndSendOtp(phoneNumber,otp);
    res.status(data.code).send(data);
});

async function saveUserAndSendOtp(phone,otp){
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        name: "NA",
        phone : phone,
        otp : otp,
    });
   var result = await user.save();
   if(result._id != null){
    return {'code' : 200,
             'otp' : otp,
             'message' : 'Otp send successful'
           };
   }
   return {'code' : 500,'message' : 'Server Error'};
}
async function updateAndSendOtp(phone,otp){
    const query = { phone: phone};
    var newvalues = {$set: {otp: otp} };
  const result =  await User.updateOne(query,newvalues);
  if(result.acknowledged){
    return {
        'code' : 200,
        'otp' : otp,
        'message' : 'Otp send successful'
    };
  }
  return {'code' : 500,'message' : 'Server Error'};
}

router.post('/verifyotp', async function(req,res,next){
    const phoneNumber = req.body.phoneNumber;
    const otp = req.body.otp;
    const user = User.findOne({phone : phoneNumber}).exec();
    if(user.otp == otp && user.phone == phoneNumber){
        return res.status(200).json({
            'code': 200,
            'message' : 'Otp verify successfull',
            'token' : 'hjegrew3473bvch7rt37tr'
        });
    }
    return res.status(401).json({
        'code': 400,
        'message' : 'Otp does`t match',
    }); 
});

module.exports = router;
