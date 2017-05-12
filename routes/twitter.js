const express = require('express');
const passport = require('../config/passport');
var router_twitter = express.Router();

router_twitter.get('/auth/twitter', passport.authenticate('twitter'));
router_twitter.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
        failureRedirect: '/'
    }),
    function(req, res) {
        req.session.currentUser = req.user.name;
        console.log("USER " + req.session.currentUser);
        console.log("WHYYY"); 
        res.redirect('/profile');
    }
);

module.exports = router_twitter;