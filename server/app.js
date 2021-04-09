const express = require('express');
const session = require('express-session');
const passport = require('passport');
const routes = require('./routes');
const connection = require('./config/database');
const cors = require("cors");
const MongoStore = require('connect-mongo')(session);
const cookieParser = require("cookie-parser");

/**
 * -------------- GENERAL SETUP ----------------
 */

// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require('dotenv').config();

const app = express();


app.use(cors(
    {
        origin:"http://localhost:8080",
        credentials:true,
        
    }
));


app.use(express.json());
app.use(express.urlencoded({extended: true}));


/**
 * -------------- SESSION SETUP ----------------
 */

const sessionStore = new MongoStore({ mongooseConnection: connection, collection: 'sessions' });

app.use((req,res,next)=>{
console.log("Before session middleware")
console.log(req.session);
next()
})

app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 ,
        secure:false,
    }
}));

app.use((req,res,next)=>{
    console.log("After session middleware")
    console.log(req.session);
    console.log("Before passport session");
    console.log(req.user? "User is added":"No user");
    console.log("User auth?"+req.isAuthenticated())
    next()
});

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */

// Need to require the entire Passport config module so app.js knows about it
require('./config/passport');


app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next)=>{
    console.log("After passport session")
    console.log("User auth?"+req.isAuthenticated())

    console.log(req.user? "User is added":"No user");
    next();
});

// app.use((req, res, next) => {
//     console.log(req.session);
//     console.log(req.user);
//     next();
// });

app.use(express.static("./public"))

app.use(routes);

app.listen(3000, ()=>{
    console.log("Backend has already start");
});