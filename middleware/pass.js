var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passportJWT = require("passport-jwt");
//var users = require("./users.js");
//var cfg = require("./config.js");
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;
var params = {
    secretOrKey: 'mybadasskey',
    jwtFromRequest: ExtractJwt.fromAuthHeader()
};


//localimports
var User = require('../models/user');
/*
passport.use(new JwtStrategy(params, function(jwt_payload, done) {
    User.findOne({id: jwt_payload.id}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            done(null, user);
        } else {
            done(null, false);
            // or you could create a new account
        }
    });
}));
*/
/*
var localStrat = new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
 });
*/
var localStrat = new LocalStrategy((username,password,done) =>{
  User.findByCredentials(username,password).then((user) =>{
    done(null, user);
  }).catch((e) =>{
    done(null,false,{message: e})
  })
})

passport.use(localStrat);

passport.serializeUser((user,done) =>{
//  console.log('serializeUser',user.password);
  done(null,user.id);
});

passport.deserializeUser((id,done) =>{
  User.findOne({_id:id}).then((user) =>{
    if(!user){
      return done(null,null)
    }
    console.log('User Found deserializeUser')
    done(null,user)
  }).catch((e) =>{
    console.log(e);
    done(e,null);
  })
})

/*
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});
*/
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = {ensureAuthenticated}
