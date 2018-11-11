const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const config = require('./../config');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 2,
        trim: true,
        validate: {
            validator: (email) => {
                return validator.isEmail(email);
            },
            message: '{VALUE} is not valid email'
        }
    },
    password: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isMaster: {
        type: Boolean,
        default: false
    },
    tokens: [{
        token: {type: String},
        access: {type: String, default: 'auth'}
    }]
}, {
    timestamps: true
});

userSchema.methods.toJSON = function(){
    const user = this;
    return _.pick(user, ['_id', 'username', 'email']);
}

userSchema.methods.generateToken = function(){
    const user = this;
    const access = 'Auth';
    const token = jwt.sign({_id: user._id.toHexString()}, config.JWT_SECRET).toString();

    user.tokens.push({
        access,
        token
    })

    return user.save().then(() => {
        return token;
    })
}

userSchema.pre('save', function(next) {
    const user = this;
    if(user.isModified('password')){
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            })
        })
    } else {
        next();
    }
})

userSchema.statics.findByToken = function(token) {
    const User = this;
    let decoded = null;

    try {
        decoded = jwt.verify(token, config.JWT_SECRET);
    } catch (error) {
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token
    })
}

userSchema.statics.findByCredentials = function(email, password) {
    const User = this;
    return User.findOne({email}).then(user => {
        if(!user){
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if(res){
                    return resolve(user);
                } else {
                    return reject();
                }
            })
        })
    })
}

module.exports = mongoose.model('User', userSchema);