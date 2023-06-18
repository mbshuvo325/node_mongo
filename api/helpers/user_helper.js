const jwt = require('jsonwebtoken');

const User = require('../models/users');

async function findUser(phoneNumber){
    const user = await User.find({phone : phoneNumber}).exec();
    if(user.length > 0){
       return user[0];
    }else{
        return {'code': 404,'message' : 'User not found!'};
    }
}
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

async function updateToken(userId){
    const query = {_id: userId};
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let data = {
        time: Date(),
        userId: userId,
    }
    const token = jwt.sign(data, jwtSecretKey);
    var newvalues = {$set: {token: token} };
    const result =  await User.updateOne(query,newvalues);
    return result;
}

module.exports = { findUser,saveUserAndSendOtp,updateAndSendOtp,updateToken};