// create instance of router
var express = require('express');
var router = express.Router();
var passport = require('passport');
var CLIENT_HOME_PAGE_URL = "https://the-rona.herokuapp.com/";

// auth with google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: "/", session: true }),
    function (req, res) {
        try {
            var token = req.user.token;
            res.redirect(CLIENT_HOME_PAGE_URL);
        } catch (err) {
            console.error(err.message);
        }
    }
);

// Used after auth to get the user object
router.get('/login/success', async (req, res) => {
    try {
        if (req.user) {
            res.json({ isAuthenticated: true });
        } else {
            res.json({ isAuthenticated: false }).status(401).send('Not Authorized');
        }
    } catch (err) {
        //console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;