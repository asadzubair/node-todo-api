const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash')
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email: {
       type: String,
       required: true,
       minlength: 1,
       trim: true,
       unique: true,
       validate: {
           validator: validator.isEmail,
           message: '{VALUE} is not an email'
       }
    },
    password: {
       type: String,
       required: true,
       minlength: 6,       
    },
    tokens: [{
        access: {
            type: String,
            required: false
        },
        token: {
            type: String,
            required: false
        }
    }]
});

UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({
        _id: user._id.toHexString(),
        access
    }, 'abc123').toString();

    user.tokens.push({
        access,
        token
    });

    return user.save().then( () => {
        return token;
    });

}

UserSchema.statics.findByToken = function(token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, 'abc123');
        
    } catch (error) {
        
        return Promise.reject('no entry');
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    })
}

UserSchema.pre('save', function(next) {
    var user = this;

    if(user.isModified('password')) {
        console.log('password is modified');
        bcrypt.genSalt(10, (err, salt) => {
            console.log('salt - ', salt);
            bcrypt.hash(user.password, salt, (err, hash) => {
                console.log('hash - ', hash);
                user.password = hash;
                 next();
            });
           
        })
        
    }else {
        next();
    }
})


UserSchema.methods.toJSON = function() {
    var user = this;
    var userObj = user.toObject();
    return _.pick(userObj, ['_id', 'email']);
}

var User = mongoose.model('User', UserSchema);

module.exports = {User};