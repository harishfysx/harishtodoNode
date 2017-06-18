var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passportJWT = require("passport-jwt");
//var users = require("./users.js");
//var cfg = require("./config.js");
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;
var opts = {
    secretOrKey: 'mybadasskey',
    jwtFromRequest: ExtractJwt.fromAuthHeader()
};


//localimports
var User = require('../models/user');

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
});
//
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
  console.log('passort jwt is being used',jwt_payload._id)
    User.findOne({_id: jwt_payload._id}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            done(null, user);
            console.log('jwt returned user',user)
        } else {
            done(null, false);
            // or you could create a new account
        }
    });
}));

//
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = {ensureAuthenticated}
