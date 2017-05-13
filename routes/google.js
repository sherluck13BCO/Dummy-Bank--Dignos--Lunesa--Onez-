const express = require('express');
const passport = require('../config/passport');
var router_google = express.Router();


router_google.get('/auth/google', passport.authenticate('google', { scope: [
       'https://www.googleapis.com/auth/plus.login',
       'https://www.googleapis.com/auth/userinfo.profile',
       'https://www.googleapis.com/auth/userinfo.email',
       'profile',
       'email'
       ] 
}));

router_google.get('/auth/google/callback',
  passport.authenticate('google', {
        failureRedirect: '/'
    }),
    function(req, res) {
        req.session.currentUser = req.user.displayName;
        res.redirect('/profile');
    }
);


module.exports = router_google;

