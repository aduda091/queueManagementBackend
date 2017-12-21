const mongoose = require('mongoose');
const Facility = require('./facility');
const Queue = require('./queue');
const User = require('./user');

// Reservation Schema
const ReservationSchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    queue: {
        type: Schema.Types.ObjectId,
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
        min: 0
    }
});


module.exports.addReservation = function (newReservation, callback) {
    newReservation.save(callback);
};

const Reservation = (module.exports = mongoose.model('Reservation', ReservationSchema));