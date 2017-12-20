const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');
const validator = require('validator');

// User Schema
const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    mail: {
        type: String,
        required: true,
        alias: 'username',
        trim: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email',
            isAsync: false
        },

    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'user',
    },
});

const User = (module.exports = mongoose.model('User', UserSchema));

//validate mail even on update
UserSchema.pre('update', function(next) {
    this.options.runValidators = true;
    next();
});

module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
};

module.exports.getUserByMail = function (mail, callback) {
    const query = {mail: mail};
    User.findOne(query, callback);
};

module.exports.addUser = function (newUser, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
};
