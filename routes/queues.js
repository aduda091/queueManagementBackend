const express = require('express');
const router = express.Router();
const passport = require('passport');
const Facility = require('../models/facility');
const Queue = require('../models/queue');

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
    }
);

module.exports = router;