const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const faker = require('faker');

router.post('/addRandomUser', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    let role = req.user.role;
    //protect route, limit to admins only
    if (role !== 'admin')
        res.status(403).json({success: false, msg: 'Unauthorized'});

    let firstName = faker.name.firstName();
    let lastName = faker.name.lastName();
    let mail = firstName.toLowerCase() + "." + lastName.toLowerCase() + "@test.com",
    newUser = new User({
        firstName,
        lastName,
        mail,
        password: "test"
    });

    //prevent registration if mail is taken
    User.getUserByMail(mail, (error, foundUser) => {
        if (!foundUser) {
            User.addUser(newUser, (err, user) => {
                if (err) {
                    res.json({success: false, msg: 'Failed to register user', err});
                } else {
                    res.json({success: true, msg: 'User registered', user});
                }
            });
        } else {
            res.status(409).json({success: false, msg: 'Failed to register user, mail is already taken'})
        }
    });

});

module.exports = router;