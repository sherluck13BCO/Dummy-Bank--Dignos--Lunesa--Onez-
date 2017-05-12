const express = require('express');
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const consolidate = require('consolidate');
const passport = require('./config/passport');
const database = require('./database');
const User = require('./models').User;
const Account = require('./models').Account;
const middlewares = require("middlewares");
const app = express();

app.engine('html', consolidate.nunjucks);
app.set('views', './views');

// app.use(bodyparser.urlencoded());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cookieparser('secret-cookie'));
app.use(session({ resave: false, saveUninitialized: false, secret: 'secret-cookie' }));
app.use(flash());
app.use(passport.initialize());

app.use('/static', express.static('./static'));
app.use(require('./routes/auth'));
app.use(require('./routes/twitter'));
app.use(require('./routes/google'));


app.get('/', function(req, res) {
	res.render('index.html');
});


var user = function retrieveSignedInUser(req, res, next) {
    req.user = req.session.currentUser;
    next();
}


app.use(user);







app.get('/profile', requireSignedIn, function(req, res) {

	const email = req.user;
	const name = email;
	User.findOne({ where: {name: name} }).then(function(user) {
		res.render('profile.html', {
			user: user
		});
	});
});

app.post('/transfer', requireSignedIn, function(req, res) {
	const recipient = req.body.recipient;
	const amount = parseInt(req.body.amount, 10);

	const  email = req.user;
	// User.findOne({ where: { email: email } }).then(function(sender) {
	// 	User.findOne({ where: { email: recipient } }).then(function(receiver) {
	// 		Account.findOne({ where: { user_id: sender.id } }).then(function(senderAccount) {
	// 			Account.findOne({ where: { user_id: receiver.id } }).then(function(receiverAccount) {
	// 				database.transaction(function(t) {
	// 					return senderAccount.update({
	// 						balance: senderAccount.balance - amount
	// 					}, { transaction: t }).then(function() {
	// 						return receiverAccount.update({
	// 							balance: receiverAccount.balance + amount
	// 						}, { transaction: t });
	// 					});
	// 				}).then(function() {
	// 					req.flash('statusMessage', 'Transferred ' + amount + ' to ' + recipient);
	// 					res.redirect('/profile');
	// 				});
	// 			});
	// 		});
	// 	});
	// });

	const q1 = "SELECT user_id, balance FROM accounts WHERE user_id IN (SELECT id FROM users WHERE email= '" + email + "')";
	const q2 = "SELECT user_id, balance FROM accounts WHERE user_id IN (SELECT id FROM users WHERE email= '" + recipient + "')";

	database.query(q1, { model: Account}).then(function(senderAccount) {
		database.query(q2, { model:Account}).then(function(receiverAccount) {
			database.transaction(function(t) {

				var  sendBal = senderAccount.map(function(sensor){ return sensor.balance });
					console.log(sendBal)
				var recBal= receiverAccount.map(function(sensor){ return sensor.balance });
				recBal = parseInt(recBal);
					console.log(recBal)
				var  sendid = senderAccount.map(function(sensor){ return sensor.user_id });
				console.log("she")
				console.log(sendid)
				var recid= receiverAccount.map(function(sensor){ return sensor.user_id });
				console.log(recid)

						return Account.update({
							balance: sendBal - amount
						},{ where: {id: sendid} }, { transaction: t }).then(function() {
							return Account.update({
								balance: recBal + amount
							},{ where: {id: recid} }, { transaction: t });
						});
					}).then(function() {
						req.flash('statusMessage', 'Transferred ' + amount + ' to ' + recipient);
						res.redirect('/profile');
					});
  
 	 })

  })

	// database.query(q1,{ replacements: { balance: balance.value - amount}, type: database.QueryTypes.SELECT }).then(function(projects) {
 //  console.log(projects)
 //   })
	// 	database.query(q2,{ replacements: { balance: balance.value + amount}, type: database.QueryTypes.SELECT }).then(function(projects) {
 //  console.log(projects)
 //   })


	






});

app.post('/deposit', requireSignedIn, function(req, res) {
	const amount = parseInt(req.body.depositamt, 10);

	const  email = req.user;
	User.findOne({ where: { email: email } }).then(function(owner) {
			Account.findOne({ where: { user_id: owner.id } }).then(function(ownerAccount) {
				
					database.transaction(function(t) {
						return ownerAccount.update({
							balance: ownerAccount.balance + amount
						});
					}).then(function() {
						req.flash('statusMessage', 'Deposited ' + amount + ' to account');
						res.redirect('/profile');
					});
				});
			});
		});



app.post('/withdraw', requireSignedIn, function(req, res) {
	const amount = parseInt(req.body.withdrawamt, 10);

	const  email = req.user;
	User.findOne({ where: { email: email } }).then(function(owner) {
			Account.findOne({ where: { user_id: owner.id } }).then(function(ownerAccount) {
				
					database.transaction(function(t) {
						return ownerAccount.update({
							balance: ownerAccount.balance - amount
						});
					}).then(function() {
						req.flash('statusMessage', 'Withdrawed ' + amount + ' from account');
						res.redirect('/profile');
					});
				});
			});
		});



/*app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
        failureRedirect: '/'
    }),
    function(req, res) {
        req.session.currentUser = req.user.email;
        res.redirect('/profile');
    }
);*/

// app.use(require('./routes/twitter'));

function requireSignedIn(req, res, next) {
    if (!req.session.currentUser) {
        return res.redirect('/');
    }
    next();
}

// function retrieveSignedInUser(req, res, next) {
//   req.user = req.session.currrentUser;
//   next();
// }

// function retrievesSignedInUser(req, res, next){

// 	next();
// }



app.listen(3000, function() {
	console.log('Server is now running at port 3000');
});