const express = require('express');
const passport = require('../config/passport');
var router_google = express.Router();



// router_google.get('/auth/google',
//   passport.authenticate('google', { scope: ['profile'] }));

// router_google.get('/auth/google/callback', 
//   passport.authenticate('google', { failureRedirect: '/' }),
//   function(req, res) {

//   	// req.session.currentUser = req.user.name;
//    //  console.log("USER " + req.session.currentUser + "NISULOD<=?");
//     // Successful authentication, redirect home.
//     res.redirect('/profile');
//   });



// router_google.get('/auth/google',
//   passport.authenticate('google', { scope: ['profile'] }));

// router_google.get('/auth/google/callback', 
//   passport.authenticate('google', { failureRedirect: '/' }),
//   function(req, res) {

//   	// req.session.currentUser = req.user.name;
//    //  console.log("USER " + req.session.currentUser + "NISULOD<=?");
//     // Successful authentication, redirect home.
//     res.redirect('/profile');
//   });






router_google.get('/auth/google', passport.authenticate('google', { scope: [
       'https://www.googleapis.com/auth/plus.login',
       'https://www.googleapis.com/auth/plus.profile.emails.read'] 
}));

router_google.get('/auth/google/callback', 
    	passport.authenticate('google', { 
    		successRedirect: '/profile',
    		failureRedirect: '/'
}));


module.exports = router_google;

