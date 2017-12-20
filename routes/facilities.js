const express = require('express');
const router = express.Router();
const passport = require('passport');
const config = require('../config/database');
const Facility = require('../models/facility');

// Add New Facility
router.post('/', passport.authenticate('jwt', {session: false}), (req, res, next) => {

        let role = req.user.role;

        //protect route, limit to admins only
        if (role !== 'admin')
            res.status(403).json({success: false, msg: 'Unauthorized'});
        let newFacility = new Facility({
            name: req.body.name,
            address: req.body.address,
            mail: req.body.mail,
            telephone: req.body.telephone,
        });

        Facility.addFacility(newFacility, (err, facility) => {
            if (err) {
                res.json({success: false, msg: 'Failed to create facility'});
            } else {
                res.json({success: true, msg: 'Facility created'});
            }
        });
    }
);

// Read all facilities
router.get('/', (req, res, next) => {
    Facility.find()
        .then(facilities => {
            res.send(facilities);
        })
        .catch(err => {
            res.status(404).send(err);
        });
});

// Read a single facility by ID
router.get('/:id', (req, res, next) => {
    Facility.findById(req.params.id)
        .then(facility => {
            res.send(facility);
        })
        .catch(err => {
            res.status(404).send(err);
        });
});

// Edit a single facility by ID
router.put('/:id', passport.authenticate('jwt', {session: false}), (req, res, next) => {
        let role = req.user.role;
        //protect route, limit to admins only
        if (role !== 'admin')
            res.status(403).json({success: false, msg: 'Unauthorized'});

        Facility.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, runValidators: true})
            .then(facility => {
                res.send(facility);
            })
            .catch(err => {
                res.status(404).send(err);
            });
    }
);

module.exports = router;
