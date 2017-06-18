var express = require('express');
var router = express.Router();
var pass = require('./../middleware/pass');

// Get Homepage
router.get('/', pass.ensureAuthenticatedUI, function(req, res){
	res.render('index',{layout: 'layouts/layout' });
});

module.exports = router;
