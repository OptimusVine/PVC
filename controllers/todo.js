var mongoose = require('mongoose');


var plmAuth = require('../middlewares/auth/autodeskplm'); 

// Call needed models
var ToDo = mongoose.model('ToDo')
var Wine = mongoose.model('Wine');

exports.fetchPlmWine = function(req, res){
	plmAuth.fetchWine(req, res, function(data){
		d = plmAuth.parseToWine(data);		
		wine = new Wine(d);
		wine.addWine();
	})
}


exports.todoGet = function(req, res){
	ToDo.find(function(err, todos){
		res.json(todos)
		})
}


exports.todoGetById = function(req, res){
	res.json(req.todo)
}


exports.todoPost = function(req, res, next){
	console.log('ME here : ' + req.body.wines)
	if (!req.body.wines){
	req.body.wines = [];
		for(i = 0; req.body['wines[' + i + ']']; i++){
		req.body.wines.push(req.body['wines[' + i + ']'])
		}
	}
	console.log('Now me here : ' + req.body.wines)
	var todo = new ToDo(req.body);
		todo.save(function(err, todoX){
			if(err){return res.send.err;}
			if(todo.wines){
				for (i=0;i<todo.wines.length; i++){
					query = Wine.findOne({'_id': todo.wines[i]})
					query.exec(function(err, wine){
						if (!wine) { console.log('No wine found') }

						else if (wine){
							wine.todos.push(todo);
							wine.save();
							console.log('saved ' + wine.name + ' todo : ' + todo.name)
						}

						 else {
						 	console.log(wine);
							console.log('We did not push into anything')
						}
					})
				}
			}
		})
	res.json(todo);
}

exports.todoGetIncomplete = function(req, res){
	var query = ToDo.find({'complete': false})
	query.exec(function(err, todos){
		res.json(todos);
	})
}

exports.todoPut = function(req, res){
	req.todo.completeIt(function(err, todo){
		res.json(todo)
	})
}
