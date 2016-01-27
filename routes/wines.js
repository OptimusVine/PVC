var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Wine = mongoose.model('Wine') // based on called index.js in app.js --- this should allow me to variablize all models
var Workspace = mongoose.model('Workspaces') // based on called index.js in app.js --- this should allow me to variablize all models
var Comment = mongoose.model('Comment') // based on called index.js in app.js --- this should allow me to variablize all models

//router.get('/wines', function(req, res, next){
//	Wine.find(function(err, wines){
//		res.json(wines)
//	})
//})

module.exports = router;