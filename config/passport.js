const passport = require('passport');
const TwitterPassport = require('passport-twitter');
var GooglePassport = require( 'passport-google-oauth2' ).Strategy;
const User = require('../models').User;

passport.use(new TwitterPassport({
    consumerKey: '7mNd39P1eKcfpBF42skNxU6gV',
    consumerSecret: 'ng5453RTqS1ltO7AWyowl53RYk6KMqqRK72gpOq5Plm7QRmME0',
    callbackURL: 'http://localhost:3000/auth/twitter/callback'
}, function(token, secret, profile, cb) {
    User.findOrCreate({
        where: { 
            email: profile.username,
            name: profile.displayName },
        defaults: { password: '' }
    }).then(function(result) {
        cb(null, result[0]);
    });
}));

passport.use(new GooglePassport({
    clientID: '505652816138-lu9iqtrh4eq63oovgq81uge0ie98s2mp.apps.googleusercontent.com',
    clientSecret: 'nK_FMWXElCSjjXUeTwwZc61M',
    callbackURL: 'http://localhost:3000/auth/google/callback',
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

// passport.use(new GooglePassport({
//     clientID: '505652816138-lu9iqtrh4eq63oovgq81uge0ie98s2mp.apps.googleusercontent.com',
//     clientSecret: 'nK_FMWXElCSjjXUeTwwZc61M',
//     callbackURL: 'http://localhost:3000/auth/google/callback',
//     passReqToCallback   : true
//   },
//   function(request, accessToken, refreshToken, profile, done, cb) {
//     process.nextTick(function () {
//     User.findOrCreate({
//         where: { 
//             // email: profile.emails[0].value,
//             name: profile.displayName },
//         defaults: { password: '' }
//     }).then(function(result) {
//         cb(null, result[0]);
//     });
//     });
//   }
// ));



passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findOne({ where: { id: id } }).then(function(user) {
        done(null, user);
    });
});





module.exports = passport;