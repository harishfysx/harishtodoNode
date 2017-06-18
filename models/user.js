var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const validator = require('validator');

// User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index:true
	},
	email: {
    type: String,
    required: true,
    minlength: 1,
    trim : true,
    unique : true,
    validate : {
      isAsync: true,
      validator: validator.isEmail,
      message : '{VALUE} is not valid email'
    }
  },
	password: {
    type: String,
    required: true,
    minlength: 6
  },
	name: {
		type: String
	},
  tokens :[{
    access : {
      type: String,
      required :true
    },
    token : {
      type: String,
      required :true
    }
  }]

});

//
UserSchema.methods.toJSON = function (){
  var user = this;
  var userObject = user.toObject();
  return _.pick(userObject,['_id','email','username','password']);

};
//
UserSchema.methods.generateAuthToken = function (){
  var user = this;
  //var access = 'auth';
  console.log('user sent for token gen',user._id);
	//var token = jwt.sign({ foo: 'bar' }, 'shhhhh').toString()
  var token = jwt.sign({_id:user._id.toHexString()},'mybadasskey',{expiresIn : 180}).toString();
		console.log('generating token',token)
		//var token = jwt.sign( user._id.toHexString(),process.env.JWT_SECRET).toString();
		return Promise.resolve(token);
  // user.tokens.push({access,token});
  // return user.save().then(() =>{
  //   return token;
  // })
};

//
UserSchema.statics.findByCredentials = function(username,password){
  var User = this;
  return User.findOne({username}).then((user) =>{
    if(!user){
      return Promise.reject('Invalid Username ');
    }
    return new Promise((resolve,reject) =>{
			//console.log('comparing password',user.password)
      bcrypt.compare(password,user.password,(err,res) =>{
        if(res){
					console.log('user resolved ')
					//var userObject = user.toObject();
          resolve(user);
        }else{
          reject('Invalid password');
        }
      })
    })
  })
}

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}
