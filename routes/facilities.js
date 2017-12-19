const express = require('express');
const router = express.Router();
const passport = require('passport');
const config = require('../config/database');
const Facility = require('../models/facility');

// Add New Facility
router.post('/', (req, res, next) => {
  let newFacility = new Facility({
      name: req.body.name,
      address: req.body.address,
      mail: req.body.mail,
      telephone: req.body.phone
  });

  Facility.addFacility(newFacility, (err, facility) => {
    if (err) {
      res.json({ success: false, msg: 'Failed to create facility' });
    } else {
      res.json({ success: true, msg: 'Facility created' });
    }
  });
});

// Read all facilities
router.get('/', (req, res, next) => {
    Facility.find().then(facilities => {
        res.send(facilities);
    })
});

module.exports = router;
