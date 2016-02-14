var mongoose = require('mongoose');

var Workspace = mongoose.model('Workspaces') 
var Comment = mongoose.model('Comment') 
var Obj = mongoose.model('Obj')
var ToDo = mongoose.model('ToDo')
var Wine = mongoose.model('Wine') 

exports.wineGet = function(req, res, next){
	Wine.find(function(err, wines){
		res.json(wines)
	})
}

exports.winePost = function(req, res, next){
		var wine = new Wine(req.body);
		wine.owner_id = req.user._id
		console.log(req.user)
		// post.author = req.payload.username;
		wine.save(function(err, wine){
			if(err){return next(err);}
			res.json(wine);
			});
		}

exports.wineGetById = function(req, res){
		req.wine.populate('comments', function(err, wine){
			if (err){return next(err);}
				req.wine.populate('todos', function(err, wine){
					if (err) {return next(err);}
					res.json(req.wine)
				})
			});	
		}

exports.wineGetByIdComments = function(req, res, next){
		var query = Comment.find({'wine':req.wine});
			query.exec(function(err, comments){
				if (err) {return next(err);}
				if (!comments) {return next(new Error("Can't find any comments"));}
				res.json(comments)
			})
		}

exports.winePostByIdComments = function(req, res, next){
		var comment = new Comment(req.body);
		comment.wine = req.wine;
		console.log(req.user._doc.local.displayName)
		comment.author = req.user._doc.local.displayName;
		console.log(Date.now())
		comment.dateCreated = Date.now();

		comment.save(function(err, comment){
			if (err) { return next(err);}
			req.wine.comments.push(comment);
			req.wine.save(function(err, wine){
				if(err) {return next(err);}
				res.json(comment)
				})
			})
		}

exports.wineGetByIdTodosIncomplete = function(req, res, next){
		var query = ToDo.find({$and: [{'complete': false}, {'wines': req.wine}]});
		query.exec(function(err, todos){
			if (err) {return next(err);}
				if (!todos) {return next(new Error("Can't find any todos"));}
				res.json(todos)
		})
}
