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
            if(reservation)res.send(reservation);
            else res.status(404).json({success: false, msg: 'Unable to find reservation'});
        })
        .catch(err => {
            res.status(404).send(err);
        })
});

// Enter a queue by ID - create new reservation
router.post('/:id', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    //first check if the user is already in the selected queue
    Reservation.findOne({user: req.user.id, queue: req.params.id}).then(existingReservation => {
        if (existingReservation) res.status(409).json({success: false, msg: 'Already in this queue'});
        else {
            Queue.findOne({_id: req.params.id})
                .populate('facility')
                .exec()
                .then(queue => {
                    //load next property of the selected queue to set as user's number
                    let number = queue.next;
                    let newReservation = new Reservation({
                        user: req.user.id,
                        queue: req.params.id,
                        number: number
                    });
                    Reservation.addReservation(newReservation, (err, reservation) => {
                        if (err) {
                            res.status(500).json({success: false, msg: 'Failed to enter queue', err})
                        } else {
                            //update queue's next property
                            Queue.findOneAndUpdate({_id: req.params.id}, {next: number + 1}, {
                                new: true,
                                runValidators: true
                            })
                                .then(newQueue => {
                                    let response = reservation.toObject();
                                    response.queue = queue;
                                    res.json({success: true, msg: 'Entered queue', reservation: response});
                                })
                                .catch(error => {
                                    res.status(500).json({success: false, msg: 'Failed to enter queue', err: error});
                                })
                        }
                    })
                });
        }
    });
});

// Exit a queue by reservation ID - delete reservation
router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    Reservation.findOne({_id: req.params.id})
        .then((reservation) => {
            if (reservation.user.toString() === req.user.id.toString() || req.user.role === "admin") {
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
    //todo: sort by time or number?
    Reservation.find({queue: req.params.queueId})
        .select('id user number time')
        .populate({path: 'user', select: 'id firstName lastName mail'})
        .exec()
        .then(reservations => {
            if(reservations.length) res.send(reservations);
            else res.status(404).json({success: false, msg: 'Unable to find reservations'});
        })
});

module.exports = router;
