var express = require('express');
var router = express.Router();
var pass = require('./../middleware/pass');

// Get Homepage
router.get('/', pass.ensureAuthenticated, function(req, res){
	res.render('index');
});

module.exports = router;
