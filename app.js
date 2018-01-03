const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

//Firebase
const admin = require("firebase-admin");
const serviceAccount = require("./config/justintimeandroi-1497564015565-firebase-adminsdk-pydad-e8847ed0e6.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://justintimeandroi-1497564015565.firebaseio.com"
});

/*   skeleton project (user registration, authorization and login) taken from Brad Traversy at https://github.com/bradtraversy/nodeauthapp  */

// Connect To Database
mongoose.Promise = global.Promise;
mongoose.connect(config.database, {useMongoClient: true});

// On Connection
mongoose.connection.on('connected', () => {
    console.log('Connected to database');
});

// On Error
mongoose.connection.on('error', err => {
    console.log('Database error: ' + err);
});

const app = express();

// Port Number
const port = process.env.PORT || 3000;

// CORS Middleware
app.use(cors());

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

/***     Routes    ***/
const users = require('./routes/users');
app.use('/users', users);

const facilities = require('./routes/facilities');
app.use('/facilities', facilities);

const queues = require('./routes/queues');
app.use('/queues', queues);

const reservations = require('./routes/reservations');
app.use('/reservations', reservations);

const tests = require('./routes/tests');
app.use('/tests', tests);

// Start Server
app.listen(port, () => {
    console.log('Server started on port ' + port);
});
