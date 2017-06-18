var express = require('express');
var router = express.Router();
var pass = require('./../middleware/pass');
var User = require('./../models/user');
const {Todo} = require('./../models/todo');

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

//POST /todos handle
router.post('/todos',(req, res) => {
    var todo = new Todo({
        text: req.body.text,
        //_creator : req.user._id
    });
    todo.save().then((doc) => {
        res.send(doc)
    }, (e) => {
        res.status(400).send(e)
    });

});


module.exports = router;
