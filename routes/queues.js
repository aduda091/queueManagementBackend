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



//todo: admin route for NEXT user - set queue's current number to the next found reservation's number property, return current reservation data
//router.
//todo: admin route to RESET current queue - delete all reservations and set current/next numbers to 0/1
module.exports = router;