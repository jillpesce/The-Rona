// create instance of router
var express = require('express');
var router = express.Router();
var passport = require('passport');
var CLIENT_HOME_PAGE_URL = "http://localhost:3000";

// auth login 
router.get('/login', (req, res) => {
    // res.render('login', { user : req.user });
    if (req.user) {
        res.json({
            success: true,
            message: "user has successfully authenticated",
            user: req.user,
            cookies: req.cookies
        });
    }
});

// auth logout
router.get('/logout', (req, res) => {
    // handled with passports
    req.logout();
    res.redirect(CLIENT_HOME_PAGE_URL);
});

// auth with google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// callback route for google to redirect to
router.get('/google/callback', passport.authenticate('google'), (req, res) => {
    console.log("in callback");
    res.redirect(CLIENT_HOME_PAGE_URL);
    // if(req.user.isNewUser) {
    //     console.log('we got a new User');
    //     //res.render('signup', { user: req.user, message: null } );
    // } else {
    //     console.log('redirect to profile');
    //     //res.redirect('/profile/');
    // }
});

module.exports = router;