const express = require('express');
const router = express.Router();
const passport = require('passport');
const Facility = require('../models/facility');
const Queue = require('../models/queue');

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
            //todo: embed queues?
        })
        .catch(err => {
            res.status(404).send(err);
        });
});

// Read a single facility by ID
router.get('/:id', (req, res, next) => {
    Facility.findById(req.params.id)
        .then(facility => {
            //disable ORM to customize response
            let response = facility.toObject();
            Queue.find({facility: req.params.id})
                .populate('facility', 'name')
                .exec()
                .then(queues => {
                    response.queues = queues;
                    res.send(response);
                })
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

// Add a queue to selected facility
router.post('/:id', passport.authenticate('jwt', {session: false}), (req, res, next) => {
        let role = req.user.role;
        //protect route, limit to admins only
        if (role !== 'admin')
            res.status(403).json({success: false, msg: 'Unauthorized'});

        let newQueue = new Queue({
            name: req.body.name,
            facility: req.params.id
        });

        Queue.addQueue(newQueue, (err, facility) => {
            if (err) {
                res.status(500).json({success: false, msg: 'Failed to create queue', err});
            } else {
                res.json({success: true, msg: 'Queue created'});
            }
        });


    }
);

module.exports = router;
