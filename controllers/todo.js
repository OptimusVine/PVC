var mongoose = require('mongoose');


var plmAuth = require('../middlewares/auth/autodeskplm'); 
var asana = require('../middlewares/auth/asana');

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


// Called via the Admin/Update/Todos Route
// This will go and pull in all of the tasks, then get 
exports.getAsanaTasks = function(req, res){
	console.log('In Controller');
	asana.getTasks(req, res, function(data){
		var r;
		for (i=0; i<data.data.length; i++){
			r = data.data[i];
			console.log('Record ' + i + ' is : ' + r.id);	
			asana.enterAsanaTodo(r);
			}	
			res.json(data);	
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
	if (!req.body.wines){
	req.body.wines = [];
		for(i = 0; req.body['wines[' + i + ']']; i++){
		req.body.wines.push(req.body['wines[' + i + ']'])
		}
	}
	
	asanaAndSave(req, function(result){
		var todo = new ToDo(result);
		todo.save(function(err, todoX){
			if(err){return res.send.err;}
			// For each wine, add the ToDo to the Wine
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
	})

}

var asanaAndSave = function(req, cb){
	var data = req.body
	asana.createTask(data.name, function(asanaResult){
		data.asana_id = asanaResult.id
		cb(data);
	})
}

exports.todoGetIncomplete = function(req, res){
	var query = ToDo.find({'complete': false})
	query.exec(function(err, todos){
		res.json(todos);
	})
}

exports.todoPut = function(req, res){
	asana.completeTask(req.todo, function(){
		req.todo.completeIt(function(err, todo){
			res.json(todo)
		})
	})
}

exports.todoPutByIdAssign = function(req, res){
	console.log('attempting to assign by id');
		console.log(req.assignee);
		asana.assignTask(req.assignee, req.todo, function(result){
			todo = req.todo
			console.log('Result:')
			console.log(result)
			todo.asana_assignee = result.data.assignee
	//		console.log('REQ ASSIGNEE: '+ req.assignee);
	//		console.log('TODO ASSIGNEE '+ todo.assignee);
			console.log(todo)
			todo.save(function(err, t){
				if(err){console.log(err)}
				console.log('Todo Saved');
				console.log(t);
				res.send(t)
			});
		})
		//res.send('done')
}
