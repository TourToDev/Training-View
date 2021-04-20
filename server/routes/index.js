const router = require('express').Router();
const passport = require('passport');
const path = require("path");

const connection = require('../config/database');
const User = connection.models.User;

const genPassword = require('../lib/passwordUtils').genPassword;
const isAuth = require('./authMiddleware').isAuth;
const basicInfoRoute = require("./basicInfoRoute");
const workoutsCollectionsRoute = require("./workoutsCollectionRoute");


/**
 * -------------- POST ROUTES ----------------
 */

router.post('/login',passport.authenticate('local'),(req,res)=>res.send(req.user))

router.post('/register', (req, res) => {
    const requestBody = req.body;
    const saltHash = genPassword(requestBody.pw);
    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newUser = new User({
        username: requestBody.uname,
        hash: hash,
        salt: salt,
        realName: requestBody.realName,
        email:requestBody.email,
    });

    newUser.save()
        .then((user) => {
            console.log(user);
            res.send("Created Successfully")
        });
 });


router.use('/userBasic', basicInfoRoute)

router.use('/workoutsCollection',workoutsCollectionsRoute)

 /**
 * -------------- GET ROUTES ----------------
 */


router.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// When you visit http://localhost:3000/login, you will see "Login Page"
router.get('/login', (req, res, next) => {
   
    const form = '<h1>Login Page</h1><form method="POST" action="/login">\
    Enter Username:<br><input type="text" name="uname">\
    <br>Enter Password:<br><input type="password" name="pw">\
    <br><br><input type="submit" value="Submit"></form>';

    res.send(form);
});

// When you visit http://localhost:3000/register, you will see "Register Page"
router.get('/register', (req, res, next) => {

    const form = '<h1>Register Page</h1><form method="post" action="register">\
                    Enter Username:<br><input type="text" name="uname">\
                    <br>Enter Password:<br><input type="password" name="pw">\
                    <br><br><input type="submit" value="Submit"></form>';

    res.send(form);
    
});

/**
 * Lookup how to authenticate users on routes with Local Strategy
 * Google Search: "How to use Express Passport Local Strategy"
 * 
 * Also, look up what behaviour express session has without a maxage set
 */
router.get('/protected-route', isAuth, (req, res, next) => {
    res.send(`You made it to the route.
    "User:"+${req.user}`);
});

// Visiting this route logs the user out
router.get('/logout', (req, res, next) => {
    req.logout();
    res.send("Log out")
});

router.get('/login-success', (req, res, next) => {
    res.send('<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>');
});

router.get('/login-failure', (req, res, next) => {
    res.send('You entered the wrong password.');
});

module.exports = router;