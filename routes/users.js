var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var _ = require('lodash');

//local imprts
var User = require('../models/user');
var passjwt = require('./../middleware/pass-jwt')

// Register
router.get('/register', function(req, res){
	res.render('register',{layout: 'layouts/layout' });
});

// Login
router.get('/login', function(req, res){
	res.render('login',{layout: 'layouts/layout' });
});

// Register User
router.post('/register', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newUser = new User({
			name: name,
			email:email,
			username: username,
			password: password
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/users/login');
	}
});
//login local passport strategy
router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/');
  });


//login local passport jwt
router.post('/authenticate',(req,res) =>{
	var body = _.pick(req.body, ['username', 'password']);
	User.findByCredentials(body.username,body.password).then((user) =>{
		//console.log(user)
		return user.generateAuthToken().then((token) => {
			if(!token){
				return res.send('token not recievd');
			}
			res.header('x-auth', token).send(token);
			//res.header('x-auth', token).send(user);
			console.log(token)


		})
		//res.send(user.email)
	}).catch((e) =>{
		res.status(400).send(e)
	})
 	//res.send(body)
})
//jwt authenticated dashboard passjwt
router.get('/dash',passport.authenticate('jwt'),(req,res) =>{
	res.send('Welcome to dashboard')
})
//

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});

module.exports = router;
