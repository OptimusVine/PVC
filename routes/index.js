var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Wine = mongoose.model('Wine') // based on called index.js in app.js --- this should allow me to variablize all models
var Workspace = mongoose.model('Workspaces') // based on called index.js in app.js --- this should allow me to variablize all models
var Comment = mongoose.model('Comment') // based on called index.js in app.js --- this should allow me to variablize all models

var plmAuth = require('../middlewares/auth/autodeskplm'); // Check TO-DO code for a change here

/*
router.get('/', function(req, res, next){
	text= plmAuth.getCookie();
	res.render(text);
	console.log('GET at ' + req.url)
})
*/

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.route('/comments')
	.get(function(req, res, next){
		console.log('this is the comment route!')
		res.send('this is the comment route, go to a wine first!');
	});

router.route('/wines')
	.get(function(req, res, next){
		Wine.find(function(err, wines){ 
			res.json(wines)
			})
		})
	.post(function(req, res, next){
		var wine = new Wine(req.body);
		// post.author = req.payload.username;
		wine.save(function(err, wine){
			if(err){return next(err);}
			res.json(wine);
			});
		});

router.route('/wines/:wine')
	.get(function(req, res){
		req.wine.populate('comments', function(err, wine){
			if (err){return next(err);}
			res.json(req.wine)
			});	
		})

router.route('/wines/:wine/comments')
	.get(function(req, res, next){
		var query = Comment.find({'wine':req.wine});
			query.exec(function(err, comments){
				if (err) {return next(err);}
				if (!comments) {return next(new Error("Can't find any comments"));}
				res.json(comments)
			})
		})
	.post(function(req, res, next){
		var comment = new Comment(req.body);
		comment.wine = req.wine;
		comment.save(function(err, comment){
			if (err) { return next(err);}
			req.wine.comments.push(comment);
			req.wine.save(function(err, wine){
				if(err) {return next(err);}
				res.json(comment)
				})
			})
		})

router.route('/workspaces')
	.get(function(req, res, next){
		Workspace.find(function(err, workspaces){ 
			res.json(workspaces)
			})
	})
	.post(function(req, res, next){
		var workspace = new Workspace(req.body);
		workspace.addWorkspace(function(err, workspace){
			if(err) { return next(err);}
			res.json(workspace);
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

// Small test rout to push  and save a Wine
router.get('/test/:workspace', function(req, res, next){
		var workspace = req.workspace;
		workspace.uri = "I have changed this URI!!! HAHAHAHAHA"
		workspace.addWorkspace();
 		res.end()
})

/*  Directing how to handle the Workspace parameter  */
router.param('workspace', function(req, res, next, id){
	var query = Workspace.findById(id);
	query.exec(function(err, workspace){
		if (err){ return next(err); }
		if (!workspace) {return next(new Error('can\'t find workspace')); }
		req.workspace = workspace;
		return next()
	})
})

/*  Directing how to handle the Workspace parameter  */
router.param('wine', function(req, res, next, id){
	var query = Wine.findById(id);
	query.exec(function(err, wine){
		if (err){ return next(err); }
		if (!wine) {return next(new Error('can\'t find wine')); }
		req.wine = wine;
		return next()
	})
})

module.exports = router;