const mongoose = require('mongoose');
const validator = require('validator');

// Facility Schema
const FacilitySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    mail: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email',
            isAsync: false
        }
    },
    telephone: {
        type: String,
        required: true,
        trim: true
    }
});

const Facility = (module.exports = mongoose.model('Facility', FacilitySchema));

module.exports.getFacilityById = function (id, callback) {
    Facility.findById(id, callback);
};

module.exports.addFacility = function (newFacility, callback) {
    newFacility.save(callback);
};
