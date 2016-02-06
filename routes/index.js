var express = require('express');
var router = express.Router();
var passport = require('passport');
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
//var Account = mongoose.model('Account')

// var plmAuth = require('../middlewares/auth/autodeskplm'); // Check TO-DO code for a change here

var controller = require('../controllers/index')

var isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	console.log("we're about to redirect")
	res.redirect('/')
}

router.route('/submit')
	.post(messages.sendMail)

router.route('/users')
	.post(userController.postUsers)
	.get(userController.getUsers);

router.route('/todos')
	.get(todoController.todoGet)
	.post(todoController.todoPost)

router.route('/todos/incomplete')
	.get(todoController.todoGetIncomplete)

router.route('/todos/:todo')
	.get(todoController.todoGetById)
	.put(todoController.todoPut)


router.get('/', function(req, res, next) {
  res.render('index', {user: req.user});
});


  // =========================================================================
  // AUTHORIZATION ROUTES AND LOGIC ==========================================
  // =========================================================================
router.route('/signup')
	.get(function(req, res){
		res.render('signup.ejs', { message: req.flash('signupMessage')});
	})
	.post(passport.authenticate('local-signup', {
		successRedirect : '/profile',
		failureRedirect : '/signup',
		failureFlash : true
	}))



router.route('/profile')
	.get(isLoggedIn, function(req, res){
		res.json(req.user)
	})

router.route('/auth')
	.get(function(req, res){
		res.render('auth.ejs');
	})

router.route('/login')
	.get(function(req, res){
		res.render('login', {user : req.user, message: req.flash('LoginMessage')});
	})
	.post(function(req, res, next){
		passport.authenticate('local-login', function(err, user, info){
			if(err){
				return res.status(500).json({err:err});
			}
			if(!user){
				return res.status(401).json({err:info});
			}
			req.logIn(user, function(err){
				if(err){
					return res.status(500).json({err: 'Could not load'})
				}
				res.status(200).json({status: 'Login Successful'})
			})
		})(req, res, next);
	})

// FACEBOOK ROUTES
// route for facebook authentication and login
router.route('/auth/facebook')
	.get(passport.authenticate('facebook', {scope: 'email'}));
// handle the callback after facebook has authenicated the user
router.route('/auth/facebook/callback')
	.get(passport.authenticate('facebook', {
		successRedirect: '/#/profile',
		failureRedirect: '/'
	}))

// GOOGLE ROUTES
// route for google authentication and login
router.route('/auth/google')
	.get(passport.authenticate('google', {scope: ['profile', 'email'] }))
// the callback after google has authenticated the user
router.route('/auth/google/callback')
	.get(passport.authenticate('google', {
		successRedirect: '/#/profile',
		failureRedirect: '/'
	}))

// Authorize --- CONNECTING EXISTING USER TO OTHER SOCIAL ACCOUNTS
	//LOCALLY
router.route('/connect/local')
	.get(function(req, res){
	res.render('connect-local.ejs', { message: req.flash('LoginMessage')})
	})
	.post(passport.authenticate('local-signup', {
		successRedirect: '/#/profile',
		failureRedirect: '/connect/local',
		failureFlash: true
	}))

	//FACEBOOK
router.route('/connect/facebook')
	.get(passport.authorize('facebook', {scope: 'email'}))

router.route('/connect/facebook/callback')
	.get(passport.authorize('facebook', {
		successRedirect: '/profile',
		failureRedirect: '/'
	}))

	//GOOGLE
router.route('/connect/google')
	.get(passport.authorize('google', {scope: ['profile', 'email']}))

router.route('/connect/google/callback')
	.get(passport.authorize('google', {
		successRedirect: '/profile',
		failureRedirect: '/'
	}))

router.get('/logout', function(req, res) {
	   	req.logout();
    	res.redirect('/');
});

router.route('/unlink/facebook')
	.get(function(req, res){
		var user = req.user;
		user.facebook.token = undefined;
		user.save(function(err){
			res.redirect('/#/profile');
		})
	})

router.route('/unlink/google')
	.get(function(req, res){
		var user = req.user;
		user.google.token = undefined;
		user.save(function(err){
			res.redirect('/profile');
		})
	})

  // =========================================================================
  // END OF AUTH ROUTES  =====================================================
  // =========================================================================

router.route('/comments')
	.get(function(req, res, next){
		console.log('this is the comment route!')
		res.send('this is the comment route, go to a wine first!');
	});

router.route('/wines')
	.get(isLoggedIn, wineController.wineGet)
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


router.get('/test/wine', function(req, res, next){
		var wine = plmAuth.receiveWine()
		var obj = new Obj(wine);
		obj.save();
		res.json(obj)

})


router.param('record', function(req, res, next, id){
	req.record = id;
	return next();
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