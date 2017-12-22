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
    Reservation.findOne({ _id: req.params.id, user: req.user.id})
        .then( (reservation)=> {
            if(reservation.user = req.user.id) {
                reservation.remove().then( ()=> {
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

module.exports = router;
