var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var mongoosePaginate = require('mongoose-paginate');
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

var Schema = mongoose.Schema;
var userschema = new Schema({
    _id: { type: String},
    fullName: { type: String, default: '' },
    userName: { type: String, default: '' },
    profileImage: { type: String, default: '' },
    phoneNumber: { type: String, default: '' },
    email: { type: String, default: '' },
    address: { type: String, default: '' },
    dob: { type: Date},
    email_verify: { type: Boolean, default: false },
    otp:{ type: String, default: '' },
    otpVerify: { type: String, enum: ['0', '1',], default: '0' },
    password: { type: String, default: '' },
    cart: [{ type: String }],
    buyProduct: [{ type: String }],
    authToken: { type: String, default: '' },
    appType: { type: String, enum: ['IOS', 'ANDROID', 'BROWSER']},
    deviceToken: { type: String, default: '' },
    status: { type: String, enum: ['yes', 'no',], default: 'yes'  },
    
    }, 
    {
            timestamps: true
    });
userschema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password'))
        return next();
    
    bcrypt.hash(user.password, null, null, function (err, hash) {
        if (err) {
            return next(err);
        }
        if(user.password !== ""){
            user.password = hash;
        }
        next();
    });
});

userschema.plugin(mongoosePaginate);
userschema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('User', userschema);