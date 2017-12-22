const express = require('express');
const router = express.Router();
const passport = require('passport');
const Queue = require('../models/queue');
const Reservation = require('../models/reservation');

// Read a single reservation by ID
router.get('/:id', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    Reservation.findById(req.params.id)
        .populate({path: 'queue', populate: {path: 'facility'}})
        .exec()
        .then(reservation => {
            res.send(reservation);
        })
        .catch(err => {
            res.status(404).send(err);
        })
});

// Delete a single reservation by ID  (i.e. exit queue)
router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    Reservation.findOne({_id: req.params.id})
        .then((reservation) => {
            if (reservation.user === req.user.id || req.user.role === "admin") {
                reservation.remove().then(() => {
                    res.json({success: true, msg: 'Successfully removed reservation'});
                })
            } else {
                res.status(403).json({success: false, msg: 'Unable to remove another user\'s reservation'});
            }

        })
        .catch(err => {
            res.status(404).json({success: false, msg: 'Unable to find reservation', err});
        })
});

// Read all reservations in a Queue by ID
router.get('/queue/:queueId', (req, res, next) => {
    Reservation.find({queue: req.params.queueId})
        .select('id user number time')
        .populate({path: 'user', select: 'id firstName lastName mail'})
        .exec()
        .then(reservations => {
            res.send(reservations);
        })
});

module.exports = router;
