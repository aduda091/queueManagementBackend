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
        if(existingReservation) res.status(409).json({success: false, msg: 'Already in this queue'});
        else {
            Queue.findById(req.params.id).then(queue => {
                //load current and next properties of the selected queue
                let number = queue.next;
                let current = queue.current;
                let newReservation = new Reservation({
                    user: req.user.id,
                    queue: req.params.id,
                    number: number,
                    current: current
                });
                Reservation.addReservation(newReservation, (err, reservation) => {
                    if(err) {
                        res.status(500).json({success: false, msg: 'Failed to enter queue', err})
                    } else {
                        //update queue's next property
                        Queue.findOneAndUpdate({_id: req.params.id}, {next: number+1}, {new: true, runValidators: true})
                            .then(newQueue => {
                                res.json({success: true, msg: 'Entered queue', reservation: reservation});
                            })
                            .catch(error => {
                                res.status(500).json({success: false, msg: 'Failed to enter queue', err:error});
                            })

                    }
                })
            });
        }
    });




});

module.exports = router;