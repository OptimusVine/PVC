exports.todoGet = function(req, res){
	ToDo.find(function(err, todos){
		res.json(todos)
		})
}

exports.todoGetById = function(req, res){
	res.json(req.todo)
}

exports.todoPost = function(req, res){
	var todo = new ToDo(req.body);
		todo.save(function(err, todo){
			if(err){return res.send.err;}
			res.json(todo);
		});
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