var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var exphbs = require('express-handlebars');
var  hbs = require('hbs');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');

//mongoose.connect('mongodb://localhost/loginapp');

//local requires
require('./config/config');
var mongoose = require('./db/mongoose');
var db = mongoose.connection;
var routes = require('./routes/index');
var users = require('./routes/users');
var todo = require('./routes/todo');

// Init App
var app = express();

// View Engine
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine','hbs');
app.use(express.static( __dirname + '/public'));

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());



// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});


//routes
app.use('/', routes);
app.use('/users', users);
app.use('/todo',todo);

// Set Port
//app.set('port', (process.env.PORT || 3000));

app.listen(process.env.PORT, function(){
	console.log(`Example app listening on port ${process.env.PORT}!`)
});
