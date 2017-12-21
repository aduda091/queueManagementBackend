const mongoose = require('mongoose');
const Facility = require('./facility');

// Queue Schema
const QueueSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    facility: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Facility',
        required: true
    },
    current: {
        type: Number,
        default: 0,
        min: 0
    },
    next: {
        type: Number,
        default: 0,
        min: 0
    }

});

const Queue = (module.exports = mongoose.model('Queue', QueueSchema));

module.exports.addQueue = function (newQueue, callback) {
    newQueue.save(callback);
};