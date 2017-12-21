const mongoose = require('mongoose');
const Facility = require('./facility');
const Queue = require('./queue');
const User = require('./user');

// Reservation Schema
const ReservationSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    queue: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Queue',
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    },
    number: {
        type: Number,
        required: true,
        min: 1
    },
    current: {
        type: Number,
        required: true,
        min: 0
    }
});


const Reservation = (module.exports = mongoose.model('Reservation', ReservationSchema));

module.exports.addReservation = function (newReservation, callback) {
    newReservation.save(callback);
};