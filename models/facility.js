const mongoose = require('mongoose');

// Facility Schema
const FacilitySchema = mongoose.Schema({
    name: String,
    address: String,
    mail: String,
    telephone: String,
});

const Facility = (module.exports = mongoose.model('Facility', FacilitySchema));

module.exports.getFacilityById = function (id, callback) {
    Facility.findById(id, callback);
};

module.exports.addFacility = function (newFacility, callback) {
    newFacility.save(callback);
};
