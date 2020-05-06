// create instance of router
var express = require('express');
var router = express.Router();
var passport = require('passport');
var CLIENT_HOME_PAGE_URL = "http://localhost:3000";

// auth with google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// 
router.get('/google/callback', passport.authenticate('google', { failureRedirect: "/", session: true }),
    function(req, res) {
        var token = req.user.token;
        // res.redirect("http://localhost:3000/");
        // change 
        res.redirect("http://localhost:3000/");
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
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;