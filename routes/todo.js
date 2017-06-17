var express = require('express');
var router = express.Router();
var pass = require('./../middleware/pass');

// Get Homepage
/*
router.get('/', pass.ensureAuthenticated, function(req, res){
	res.render('index');
});
*/

router.get('/', function (req, res) {
  res.render('todo/projects',{
    pageTitle : 'Projects Page',
    welcomeMessage : 'This is projects page' //,
    //layout: 'layouts/layout'
  });
});

router.get('/dash', function (req, res) {
  res.render('todo/dash');
});

router.get('/plain', function (req, res) {
  res.render('todo/plain');
});

module.exports = router;
