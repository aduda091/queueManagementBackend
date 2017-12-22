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
            res.send(err, 404);
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

// Enter a queue by ID
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
                    console.log("queue:", queue);
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

//todo: admin route for NEXT user - increase queue's current by 1, edit all reservations in that queue (current property), mreturn current reservation data
//todo: list all reservations in a queue (admin list view) - sort by time, number
module.exports = router;