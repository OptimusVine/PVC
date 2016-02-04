var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var messages = require('../helpers/mailgun')

var todoController = require('../controllers/todo')
var wineController = require('../controllers/wine')
var userController = require('../controllers/user')
var authController = require('../controllers/auth')

// These must all be REQUIRED in app.js by requiring the models
var Workspace = mongoose.model('Workspaces') 
var Comment = mongoose.model('Comment') 
var Obj = mongoose.model('Obj')
var ToDo = mongoose.model('ToDo')
var Wine = mongoose.model('Wine') 
var User = mongoose.model('User')

// var plmAuth = require('../middlewares/auth/autodeskplm'); // Check TO-DO code for a change here

//var controller = require('../controllers/index')

router.route('/submit')
	.post(messages.sendMail)

router.route('/users')
	.post(userController.postUsers)
	.get(authController.isAuthenticated, userController.getUsers);

router.route('/todos')
	.get(authController.isAuthenticated, todoController.todoGet)
	.post(authController.isAuthenticated, todoController.todoPost)

router.route('/todos/incomplete')
	.get(todoController.todoGetIncomplete)

router.route('/todos/:todo')
	.get(todoController.todoGetById)
	.put(todoController.todoPut)


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.route('/comments')
	.get(function(req, res, next){
		console.log('this is the comment route!')
		res.send('this is the comment route, go to a wine first!');
	});

router.route('/wines')
	.get(wineController.wineGet)
	.post(wineController.winePost);


router.route('/wines/:wine')
	.get(wineController.wineGetById)

router.route('/wines/:wine/comments')
	.get(wineController.wineGetByIdComments)
	.post(wineController.winePostByIdComments)

router.route('/wines/:wine/todos/incomplete')
	.get(wineController.wineGetByIdTodosIncomplete)

router.route('/workspaces')
	.get(function(req, res, next){
		Workspace.find(function(err, workspaces){ res.json(workspaces) })
	})
	.post(function(req, res, next){
		var workspace = new Workspace(req.body);
		workspace.addWorkspace(function(err, workspace){
			if(err) { return next(err);}
			res.json(workspace);
		})
	})



router.route('/workspaces/public')
	.get(function(req, res, next){
		var query = Workspace.find({'public':true});
			query.exec(function(err, workspaces){
				if (err) {return next(err);}
				if (!workspaces) {return next(new Error("Can't find any workspaces"));}
				res.json(workspaces)
			})
	})

router.route('/workspaces/:workspace/public')
	.put(function(req, res, next){
		req.workspace.setPublic(function(err, workspace){
			if (err) {return next(err);}
			res.json(workspace)
		})
	})

router.get('/admin/update/workspaces', function(req, res, next){
	var counter = 0;
	plmAuth.getWorkspaces(function(result){
			var workspaceData = result
			// res.write(JSON.stringify(workspaceData, null, 2));
			workspaceData.forEach(function(workspace){
				var tempWorkspace = new Workspace(workspace)
				tempWorkspace.addWorkspace();
				counter = counter + 1;
			})
		})
		res.send('Workspaces Updated with ' + counter + ' workspaces');
	})

router.route('/workspaces/:workspace')
	.get(function(req, res, next){
			res.json(req.workspace)
	})
	.put(function(req, res, next){
		req.workspace.setPublic()
		res.json(req.workspace)
	})

router.route('/search/:search')
	.get(function(req, res, next){
		var re = new RegExp(req.query, 'i');
		Wine.find({'$or':[{ 'name': re }, {'varietal': re}]}).sort({'vintage': 1})
			.exec(function(err, wines) {
    		res.json(wines);
	})
		})

router.route('/external/PLM/workspaces/52/items/:record')
	.get(function(req, res, next){
		controller.fetchPlmWine(req, res);
	})

router.param('record', function(req, res, next, id){
	req.record = id;
	return next();
})

router.get('/test/wine', function(req, res, next){
		var wine = plmAuth.receiveWine()
		var obj = new Obj(wine);
		obj.save();
		res.json(obj)

})

router.param('workspace', function(req, res, next, id){
	var query = Workspace.findById(id);
	query.exec(function(err, workspace){
		if (err){ return next(err); }
		if (!workspace) {return next(new Error('can\'t find workspace')); }
		req.workspace = workspace;
		return next()
	})
})


router.param('wine', function(req, res, next, id){
	var query = Wine.findById(id);
	query.exec(function(err, wine){
		if (err){ return next(err); }
		if (!wine) {return next(new Error('can\'t find wine')); }
		req.wine = wine;
		return next()
	})
})

router.param('todo', function(req, res, next, id){
	var query = ToDo.findById(id);
	query.exec(function(err, todo){
		if (err){ return next(err); }
		if (!todo) {return next(new Error('can\'t find todo')); }
		req.todo = todo;
		return next()
	})
})

router.param('search', function(req, res, next, query){
	req.query = query;
		return next()
	})




module.exports = router;