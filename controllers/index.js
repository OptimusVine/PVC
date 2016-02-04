var mongoose = require('mongoose');

var plmAuth = require('../middlewares/auth/autodeskplm'); 

var ToDo = mongoose.model('ToDo');
var Wine = mongoose.model('Wine');

var ToDoCtrl = require('./todo')

exports.fetchPlmWine = function(req, res){
	plmAuth.fetchWine(req, res, function(data){
		d = plmAuth.parseToWine(data);		
		wine = new Wine(d);
		wine.addWine();
	})
}