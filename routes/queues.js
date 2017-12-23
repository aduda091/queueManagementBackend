const express = require('express');
const router = express.Router();
const passport = require('passport');
const Facility = require('../models/facility');
const Queue = require('../models/queue');
const Reservation = require('../models/reservation');

// Read a single queue by ID
router.get('/:id', (req, res, next) => {
    Queue.findById(req.params.id)
        .populate('facility')
        .exec()
        .then(queue => {
            //todo: add reservations?
            res.send(queue);
        })
        .catch(err => {
            res.status(404).send(err);
        })
});

// Edit a single queue by ID
router.put('/:id', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    let role = req.user.role;
    //protect route, limit to admins only
    if (role !== 'admin')
        res.status(403).json({success: false, msg: 'Unauthorized'});

    Queue.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, runValidators: true})
        .then(queue => {
            res.send(queue);
        })
        .catch(err => {
            res.status(404).send(err);
        });

});


//admin route for NEXT user - set queue's current number to the next found reservation's number property, return current reservation data
router.delete('/:id/next', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    let role = req.user.role;
    //protect route, limit to admins only
    if (role !== 'admin')
        res.status(403).json({success: false, msg: 'Unauthorized'});

    //first find selected queue's properties
    Queue.findById(req.params.id).then(queue => {
        let current = queue.current;
        let next = queue.next;
        //empty queue
        if (current === 0 && next === 1) res.status(500).json({success: false, msg: 'Unable to proceed - empty queue'});
        else if (current === 0) {
            //non-empty queue but current is 0 - never used NEXT before
            Reservation.findOne({queue: req.params.id})
                .populate('user')
                .exec()
                .then(nextReservation => {
                    //set queue's current property to first reservation's number
                    queue.current = nextReservation.number;
                    queue.save((err, updatedQueue) => {
                        if (err) {
                            //problem editing queue
                            res.status(500).json({success: false, msg: 'Unable to update queue', err});
                        }
                        else {
                            //successfully updated current queue's current number to first reservation's number
                            res.send(nextReservation);
                        }
                    });

                })
                .catch(err => {
                    res.status(500).json({success: false, msg: 'Unable to update queue', err});
                })
        } else {
            //non-empty queue, used NEXT before
            //find reservations belonging to this queue
            Reservation.find({queue: req.params.id})
                .populate('user')
                .exec()
                .then(reservations => {
                    let currentReservation = reservations[0];
                    //remove currently serving reservation
                    currentReservation.remove().then(() => {
                        if (reservations.length > 1) {
                            //there is a next user after current
                            let nextReservation = reservations[1];
                            //set queue's current property to first reservation's number
                            queue.current = nextReservation.number;
                            queue.save((err, updatedQueue) => {
                                if (err) {
                                    //problem editing queue
                                    res.status(500).json({success: false, msg: 'Unable to update queue', err});
                                }
                                else {
                                    //successfully updated current queue's current number to next reservation's number
                                    res.send(nextReservation);
                                }
                            });

                        } else {
                            //the current user was last in queue
                            res.json({success: true, msg: 'No more users in queue'})
                        }
                    });

                })
                .catch(err => {
                    res.status(500).json({success: false, msg: 'Unable to update queue', err});
                });
        }
    })
});

//admin route to RESET current queue - delete all reservations and set current/next numbers to 0/1
router.delete('/:id/reset', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    let role = req.user.role;
    //protect route, limit to admins only
    if (role !== 'admin')
        res.status(403).json({success: false, msg: 'Unauthorized'});
    //delete all reservations in the selected queue
    Reservation.remove({queue: req.params.id}).then(response => {

        Queue.findOneAndUpdate({_id: req.params.id}, {current: 0, next: 1}, {new: true, runValidators: true})
            .then(queue => {
                if (queue.current === 0 && queue.next === 1) {
                    res.json({success: true, msg: 'Queue reset successful'});
                } else {
                    res.status(500).json({success: false, msg: 'Unable to reset queue', err});
                }
            })

    });
});
module.exports = router;