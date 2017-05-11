const bcrypt = require('bcrypt');
const express = require('express');
const User = require('../models').User;
const database = require('../database');
const Account = require('../models').Account;

const router = new express.Router();

router.post('/signup', function(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const confirmation = req.body.confirmation;

    User.findOne({ where: { email: email } }).then(function(user) {
        if (user !== null) {
            req.flash('signUpMessage', 'Email is already in use.');
            return res.redirect('/');
        }
        if (password !== confirmation) {
            req.flash('signUpMessage', 'Passwords do not match.');
            return res.redirect('/');
        }

        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(password, salt);

    database.transaction(function (t){
        
        return User.create({
            email: email,
            password: hashedPassword,
            salt: salt
        }, {transaction: t}).then(function (user){
            return Account.create({
                user_id: user.id
            }, {transaction: t});
            });
        
        }).then(function(response) {
            // Account.create({user_id : response.dataValues.id})
            req.flash('signUpMessage', 'Signed up successfully!');
            return res.redirect('/');
        });

    });
});


router.post('/signin',  function(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const remember = req.body.remember;

    User.findOne({ where: { email: email } }).then(function(user) {
        if (user === null) {
            req.flash('signInMessage', 'Incorrect email.');
            return res.redirect('/');
        }

        const match = bcrypt.compareSync(password, user.password);
        if (!match) {
            req.flash('signInMessage', 'Incorrect password.');
            return res.redirect('/');
        }

        req.flash('statusMessage', 'Signed in successfully!');
        req.session.currentUser = user.email;
        if (remember) {
            req.session.cookie.maxAge = 1000 * 60 * 60;
        }
        res.redirect('/profile');
    });
});


// function retrieveSignedInUser(req, res, next) {
//   req.user = req.session.currrentUser;
//   next();
// }

router.get('/signout', function(req, res) {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
