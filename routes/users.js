const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');

// Register
router.post('/register', (req, res, next) => {
  let newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    mail: req.body.mail,
    password: req.body.password,
  });

  User.addUser(newUser, (err, user) => {
    if (err) {
      res.json({ success: false, msg: 'Failed to register user' });
    } else {
      res.json({ success: true, msg: 'User registered' });
    }
  });
});

// Authenticate
router.post('/login', (req, res, next) => {
  const mail = req.body.mail;
  const password = req.body.password;

  User.getUserByMail(mail, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.json({ success: false, msg: 'User not found' });
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        const token = jwt.sign({ data: user }, config.secret, {
          expiresIn: 2592000, // 1 month
        });

        res.json({
          success: true,
          token: 'JWT ' + token,
          user: {
            firstName: user.firstName,
            lastName: user.lastName,
            mail: user.mail,
            role: user.role,
          },
        });
      } else {
        return res.json({ success: false, msg: 'Wrong password' });
      }
    });
  });
});

// Profile
router.get(
  '/me',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    res.json({ user: req.user });
  }
);

module.exports = router;
