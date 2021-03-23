const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const crypto = require('crypto');
const routes = require('./routes');
const connection = require('./config/database');
const cors = require("cors");
const morgan = require('morgan');
// Package documentation - https://www.npmjs.com/package/connect-mongo
const MongoStore = require('connect-mongo')(session);
const cookieParser = require("cookie-parser")

/**
 * -------------- GENERAL SETUP ----------------
 */

// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require('dotenv').config();

// Create the Express application
var app = express();

app.use(morgan());

app.use(cors(
    {
        origin:"http://localhost:8080",
        credentials:true,
        
    }
))

app.use(express.json());
app.use(express.urlencoded({extended: true}));


/**
 * -------------- SESSION SETUP ----------------
 */

const sessionStore = new MongoStore({ mongooseConnection: connection, collection: 'sessions' });

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 ,
    }
}));


/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */

// Need to require the entire Passport config module so app.js knows about it
require('./config/passport');

app.use(passport.initialize());
app.use(passport.session());

// app.use((req, res, next) => {
//     console.log(req.session);
//     console.log(req.user);
//     next();
// });

/**
 * -------------- ROUTES ----------------
 */

// Imports all of the routes from ./routes/index.js
app.use(routes);

/**
 * -------------- SERVER ----------------
 */

// Server listens on http://localhost:3000
app.listen(3000,()=>{
    console.log("Backend has already start");
});