var app = angular.module('PVC', ['ui.router']);

  // =========================================================================
  // FACTORIES ===============================================================
  // =========================================================================

app.factory('auth', ['$q', '$timeout', '$http', function($q, $timeout, $http){
	//create user variable
	var user = null;

	return ({
		isLoggedIn: isLoggedIn,
		getUserStatus: getUserStatus,
		login: login,
		logout, logout,
		register, register
	})

	function isLoggedIn(){
		if(user){return true;} 
		else {return false;}
		}

	function getUserStatus(){
		return user;
	}

	function login(username, password){
		// create a new instance of deferred
		var deferred = $q.defer();

		//send a post request to the user
		$http.post('/login', {email: username, password, password})
			// handle success
			.success(function(data, status){
				if (status === 200 && data.status){
					user = true;
					console.log('success here')
					deferred.resolve();
				}
			})
			//handle error
			.error(function(data){
				user = false;
				console.log('failure here')
				deferred.reject();
			})

		return deferred.promise;
	}

	function logout(){
		// create a new instance of deferred
		  var deferred = $q.defer();

		  // send a get request to the server
		  $http.get('/logout')
		    // handle success
		    .success(function (data) {
		      user = false;
		      deferred.resolve();
		    })
		    // handle error
		    .error(function (data) {
		      user = false;
		      deferred.reject();
		    });

		  // return promise object
		  return deferred.promise;
	}

    function register(){
	// create a new instance of deferred
	 var deferred = $q.defer();

 	 // send a post request to the server
	  $http.post('/signup', {username: username, password: password})
	    // handle success
	    .success(function (data, status) {
	      if(status === 200 && data.status){
	        deferred.resolve();
	      } else {
	        deferred.reject();
	      }
	    })
	    // handle error
	    .error(function (data) {
	      deferred.reject();
	    });

	  // return promise object
	  return deferred.promise;
	}

	}])

app.factory('wines', ['$http', function($http){
	var o = {
		wines: []
	}

	o.getAll = function() {
		return $http.get('/wines').success(function(data){
			angular.copy(data, o.wines);
		});
	};

	o.create = function(wine) {
		return $http.post('/wines', wine).success(function(data){
			o.wines.push(data).error(console.log(error));
		})
	};

	o.get = function(id) {
		return $http.get('/wines/' + id).then(function(res){
			return res.data;
		})
	}

	o.addComment = function(id, comment) {
		return $http.post('/wines/' + id + '/comments', comment)
	}

	o.addToDo = function(toDo) {
		return $http.post('/todos', toDo)
	}

	o.markComplete = function(todo) {
			return $http.put('/todos/' + todo)
			}

	o.getIncomplete = function(id) {
			return $http.get('/wines/' + id + '/todos/incomplete')
	}

	o.search = function(item) {
		return $http.get('/search/' + item).success(function(data){
			angular.copy(data, o.wines);
		})
	}

	o.sendMail = function(todo){
		return $http.post('/submit', todo)
	}

	return o;
}])

app.factory('workspaces', ['$http', function($http){
	var o = {
		workspaces: []
	}

	o.getAll = function() {
		return $http.get('/workspaces').success(function(data){
			angular.copy(data, o.workspaces);
		})
	}

	o.getPublic = function() {
		return $http.get('/workspaces/public').success(function(data){
			angular.copy(data, o.workspaces);
		})
	}

	o.isEmpty = function(){
		return o.workspaces.length > 0;
	}

	return o;
}])

app.factory('todos', ['$http', function($http){
	var o = {
		todos: []
	}
		o.getAll = function() {
		return $http.get('/todos/incomplete').success(function(data){
			angular.copy(data, o.todos);
		});
	};

		o.markComplete = function(todo) {
			return $http.put('/todos/' + todo).success(function(){
				o.getAll()
			})
		}


	return o
}])

app.factory('wine', ['$http', function($http){
	o = {
		wine: []
	}

	return o;
}])

app.factory('user', ['$http', 'auth', function($http, auth){
	o = {
		google:{
			email: null,
			name: null,
			token: null
			},
		facebook:{
			name: null,
			token: null
			},
		local:{
			email: null
			}
		}

	o.get = function(){
		return $http.get('/profile').success(function(data){
			angular.copy(data, o);
			console.log(data)
		})
	}

	return o;
}])


  // =========================================================================
  // CONTROLLERS =============================================================
  // =========================================================================

app.controller('AuthCtrl', [
	'$scope',
	'user',
	function($scope, user){
		$scope.user = user.username;
	}
	])

app.controller('navCtrl',
	['$scope', 'auth', 
	function($scope, auth){
		console.log('NavCtrl Auth : ' + auth.getUserStatus())
		$scope.isLoggedIn = auth.isLoggedIn;
		$scope.currentUser = auth.getUserStatus()
	}])

app.controller('loginController', 
	['$scope', '$state', 'auth',
	function($scope, $state, auth){
		console.log('Auth Status : ' + auth.getUserStatus())

		$scope.login = function(){
			// initial values
			$scope.error = false;
		//	$scope.disabled = true;

			// call login from service
			auth.login($scope.loginForm.username, $scope.loginForm.password)
				//handle success
				.then(function(){
					$state.go('profile');
					$scope.disabled = false;
					$scope.loginForm = {};
				})
				// handle error
				.catch(function(){
					$scope.error = true;
					$scope.errorMessage = "Invalid Username and/or password";
				//	$scope.disabled = true;
					$state.reload();
				})
		}
	}])

app.controller('MainCtrl', [
	'$scope',
	'user',
	'workspaces',
	function($scope, user, workspaces){
		$scope.user = user.username;
  		$scope.test = 'Hello world!';
  		$scope.workspaces = workspaces.workspaces
  		$scope.isEmpty = workspaces.isEmpty;
}]);

app.controller('ProfileCtrl', [
	'$scope',
	'auth',
	'user',
	function($scope, auth, user){
		$scope.user = user;
	}
	])

app.controller('WineCtrl', [
	'$scope',
	'wines',
	'wine',
	'auth',
	function($scope, wines, wine, auth){

		console.log('Wine Ctrl Auth : ' + auth.getUserStatus());

		$scope.wines = wines.wines;
		if(wine){$scope.wine = wine};
		$scope.winesLength = wines.wines.length;
		
		$scope.completeToDo = function(todo){
			wines.markComplete(todo)
			.success(function(){
				$scope.remove(todo)
				})
		}

		$scope.remove = function(todo) { 
			console.log(todo)
			for (i = 0; i< $scope.wine.todos.length; i++){
				if (todo === $scope.wine.todos[i]._id){
					console.log($scope.wine.todos[i]._id + ' equals ' + todo)
					$scope.wine.todos.splice(i,1);
				}
			}  
		}


		$scope.addWine = function(){
			// if(!scope.name || !$scope.vintage || !$scope.varietal) {return;}
			wines.create({
				name: $scope.name,
				varietal: $scope.varietal,
				vintage: $scope.vintage
			}).error(function(error){
				if(error.name === 'ValidationError'){
					console.log('CHEESE')
				}
				console.log(error);
				$scope.error = error;
			})
			$scope.name = "";
			$scope.varietal = "";
			$scope.vintage = "";
		}

		$scope.addToDo = function(){
			if($scope.name === '' | $scope.summary === ''){ return; }
			var tempToDo = {
				name: $scope.name,
				summary: $scope.summary,
				wines: $scope.wine

			};
				wines.addToDo(tempToDo).success(function(todo){
					$scope.wine.todos.push(todo)
				})
				$scope.name = '';
				$scope.summary = '';
		}

		$scope.sendMail = function(todo){
			wines.sendMail(todo)
		}

		$scope.addComment = function(){
			if($scope.body === '') {return;}
				wines.addComment(wine._id, {
					body: $scope.body
				}).success(function(comment){
					$scope.wine.comments.push(comment)
				})
			$scope.body = '';
		}
	}])

app.controller('WorkspacesCtrl', [
	'$scope',
	'workspaces',
	function($scope, workspaces){
		$scope.test = 'This is the workspaces site';
		$scope.workspaces = workspaces.workspaces;
		$scope.isEmpty = workspaces.isEmpty;
	}])

app.controller('ToDosCtrl', [
	'$scope',
	'todos',
	function($scope, todos){
		$scope.todos = todos.todos;

		$scope.hasWine = function(){
			return $scope.todos.wines > 0;
		}

		$scope.completeToDo = function(todo){
			todos.markComplete(todo)
		}

	}])

  // =========================================================================
  // ROUTING / STATES ========================================================
  // =========================================================================

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider

  	.state('auth', {
  		url: '/login',
  		templateUrl: '/login.html',
  		controller: 'loginController',
  		access: {restricted: false}
  	})


    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl',
      access: {restricted: true},
      resolve: {
    		workspacesPromise: ['workspaces', function(workspaces){
    			return workspaces.getPublic()
    		}]
    	}
    })

    .state('wines', {
    	url: '/wines',
    	templateUrl: '/wines.html',
    	controller: 'WineCtrl',
    	access: {restricted: true},
    	resolve: {
    		winePromise: ['wines', function(wines){
    			return wines.getAll();
    		}]
    	}
    })

    .state('todos', {
    	url: '/todos',
    	templateUrl: '/todos.html',
    	controller: 'ToDosCtrl',
    	access: {restricted: true},
    	resolve: {
    		toDoPromoise: ['todos', function(todos){
    			return todos.getAll();
    		}]
    	}
    })

    .state('wine', {
    	url: '/wines/{id}',
    	templateUrl: '/wine.html',
    	controller: 'WineCtrl',
    	access: {restricted: true},
    	resolve: {
    		wine: ['$stateParams', 'wines', function($stateParams, wines){
    			return wines.get($stateParams.id);
    		}], 
    		winePromise: ['wines', function(wines){
    			return wines.getAll();
    		}]
    	}
    })

    .state('search', {
    	url: '/search/{query}',
    	templateUrl: '/wines.html',
    	controller: 'WineCtrl',
    	access: {restricted: true},
    	resolve: {
    		winePromise: ['$stateParams', 'wines', function($stateParams, wines){
    			return wines.search($stateParams.query)
    		}]
    	}
    })

    .state('profile', {
    	url: '/profile',
    	templateUrl: '/profile.html',
    	controller: 'ProfileCtrl',
    	access: {restricted: true},
    	resolve: {
    		userPromise: ['user', function(user){
    			console.log('im here')
    			return user.get();
    		}]}
    })

    .state('workspaces', {
    	url: '/workspaces',
    	templateUrl: '/workspaces.html',
    	controller: 'WorkspacesCtrl',
    	access: {restricted: true},
    	resolve: {
    		workspacesPromise: ['workspaces', function(workspaces){
    			return workspaces.getAll()
    		}]

    	}
    })

  $urlRouterProvider.otherwise('home');
}]);


 
app.run(function ($rootScope, $state, auth) {
  $rootScope.$on('$stateChangeStart', function (event, next, current) {
  	if (next.name === 'auth') {
  		return;
  	}
  	if (next.access.restricted && auth.isLoggedIn() === false) {
  		console.log('Next State : ' + next.name + ' isLoggedin : ' + auth.isLoggedIn())
  		console.log('Set state to Auth')
  		event.preventDefault();
        $state.go('auth');
    } else {
    	console.log('Next State : ' + next.name + ' isLoggedin : ' + auth.isLoggedIn())
    	return;
    }
  });
});


