
const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type : String, required: true},
    phone: {type : String, required: true},
    point: {type : Number, default: 0,require: false},
    profile_image:{type : String, default: null,require: false},
    address:{type : String, default: null,require: false},
    otp: {type : Number,default: null,require: false},
    token: {type : String, default: null,require: false},
    device_id: {type : String, default: null,require: false},
});

module.exports = mongoose.model('user',usersSchema);