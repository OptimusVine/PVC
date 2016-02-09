var app = angular.module('PVC', ['ui.router']);

  // =========================================================================
  // FACTORIES ===============================================================
  // =========================================================================

app.factory('auth', ['$q', '$timeout', '$http', '$window', function($q, $timeout, $http, $window){
	//create user variable
	var user = null;

	return ({
		isLoggedIn: isLoggedIn,
		getUserStatus: getUserStatus,
		login: login,
		logout: logout,
		register: register,
		checkVerify: checkVerify
	})

	function isLoggedIn(){
		if(localStorage['PVC-Token']){return true;} 
		else {return false;}
		}

	function checkVerify(){
		console.log('Hitting /verify with : ' + $window.localStorage)
		$http.get('/api', {
			headers: {Authorization: 'Bearer ' + $window.localStorage['PVC-Token']}
		})
			.success(function(data){
				console.log(data)
				return true;
			})
			.error(function(data){
				console.log(data)
				return false;
			})
	}

	function getUserStatus(){
		return user;
	}

	function login(username, password){
		// create a new instance of deferred
		var deferred = $q.defer();
		user = null;

		//send a post request to the user
		$http.post('/login', {email: username, password, password})
			// handle success
			.success(function(data, status){
				if (status === 200 && data.status){
					user = true;
					$window.localStorage['PVC-Token'] = data.token;
					//console.log(data)
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
		      localStorage.clear();
		  	  console.log('Token after Logout : ' + $window.localStorage['PVC-Token'])
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

app.factory('wines', ['$http', '$window', function($http, $window){
	var o = {
		wines: []
	}

	var token = {headers: {Authorization: 'Bearer '+ localStorage['PVC-Token']}}

	o.getAll = function() {
		return $http.get('/wines', token).success(function(data){
			angular.copy(data, o.wines);
		});
	};

	o.create = function(wine) {
		return $http.post('/wines', wine, token).success(function(data){
			o.wines.push(data).error(console.log(error));
		})
	};

	o.get = function(id) {
		console.log(localStorage)
		return $http.get('/wines/' + id, token).then(function(res){
			console.log('Did I complete this?')
			return res.data;
		})
	}

	o.addComment = function(id, comment) {
		return $http.post('/wines/' + id + '/comments', comment, token)
	}

	o.addToDo = function(toDo) {
		return $http.post('/todos', toDo, token)
	}

	o.markComplete = function(todo) {
			return $http.put('/todos/' + todo)
			}

	o.getIncomplete = function(id) {
			return $http.get('/wines/' + id + '/todos/incomplete', token)
	}

	o.search = function(item) {
		return $http.get('/search/' + item, token).success(function(data){
			angular.copy(data, o.wines);
		})
	}

	o.sendMail = function(todo){
		return $http.post('/submit', todo, token)
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

app.factory('user', ['$http', 'auth', '$window', function($http, auth, $window){
	o = {
		user: null,
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
			if(o.user === null){
				console.log('copying data ' + data)
				angular.copy(data, o);
				return o.user;
			}
			else {
				return o.user;
			}
		}).error(function(error){
			if (error) {
				console.log("error : " + JSON.stringify(error))
				return;
			}  

		}

		)
	}

	o.logout = function(){
		return $http.get('/logout')
	}

	return o;
}])


  // =========================================================================
  // CONTROLLERS =============================================================
  // =========================================================================

app.controller('AuthCtrl', [
	'$scope',
	'user',
	'$window',
	function($scope, user, $window){
		$scope.user = user.username;
		console.log($window.localStorage)
	}
	])

app.controller('navCtrl',
	['$scope', 'auth', '$state',
	function($scope, auth, $state){
		console.log('NavCtrl Auth : ' + auth.getUserStatus())
		console.log('localStorage : ' + localStorage)
		$scope.isLoggedIn = auth.isLoggedIn;
		$scope.currentUser = auth.getUserStatus()

		$scope.logOut = function(){
			auth.logout()
			localStorage.clear();
			$state.go('home')
		}	
	}])

app.controller('loginController', 
	['$scope', '$state', 'auth', '$window',
	function($scope, $state, auth, $window){
		console.log('Auth Status : ' + auth.getUserStatus())
		$scope.login = function(){
			// initial values
			$scope.error = false;
//			$scope.disabled = true;

			// call login from service
			auth.login($scope.loginForm.username, $scope.loginForm.password)
				//handle success
				.then(function(){
					$state.go('profile');
					$scope.disabled = false;
					$scope.loginForm = {};
					return;
				})
				// handle error
				.catch(function(){
					$scope.error = true;
					$scope.errorMessage = "Invalid Username and/or password";
				//	$scope.disabled = true;
					$state.reload();
					return;
				})
			}

		$scope.verify = function(){
			auth.checkVerify();
			return;

		}
	}])

app.controller('MainCtrl', [
	'$scope',
	'user',
	'$state',
	'workspaces',
	'$window',
	function($scope, user, $state, workspaces, $window){
		console.log($window.localStorage)
		$scope.user = user.username;
  		$scope.test = 'Hello world!';
  		$scope.workspaces = workspaces.workspaces
  		$scope.isEmpty = workspaces.isEmpty;
}]);

app.controller('ProfileCtrl', [
	'$scope',
	'auth',
	'user',
	'$state',
	'$window',
	function($scope, auth, user, $state, $window){
		$scope.user = user;

		$scope.logout = function(){	
			auth.logout()
			localStorage.clear();
			$state.go('home')

			}
		}
	])

app.controller('WineCtrl', [
	'$scope',
	'wines',
	'wine',
	'auth',
	'$window',
	function($scope, wines, wine, auth, $window){

		console.log('Wine Ctrl Auth : ' + auth.getUserStatus());
		console.log($window.localStorage)

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
      access: {restricted: false},
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
    			wines.getAll().success(function(){
    				return;
    			})
    				.error(function(error){
    					console.log(error)
    				})
    				
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
    			if(user.user === null){
    			//	console.log('user is null in resolve')
    			} else {
    				return;
    			//	console.log('user is NOT null in resolve')
    			}
    			if( user.get()){
    			// console.log('in the .get of resolve')
    			} else {
    			// console.log('never fired')
    			}} 
    		]}
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


 
app.run(function ($http, $rootScope, $state, auth, $window) {
  $rootScope.$on('$stateChangeStart', function (event, next, nextParams, current, currentParams) {
  	if (next.name === 'auth') {
  		return;
  	}
  	if (next.access.restricted && !localStorage['PVC-Token']) {
  		console.log('Next State : ' + next.name + ' Token : ' + localStorage + ' N.A.R : ' + next.access.restricted)
  		console.log('Set state to Auth')
  		event.preventDefault();
        $state.go('auth');
    } else if (next.name === 'login'){

    } else{
    /*	$http.get('/verify', {headers: {Authorization: 'Bearer ' + $window.localStorage['PVC-Token']}})
    		.success(function(){
    			console.log('*** Token Verified, proceeding with State Change To : ' + next.name)
    		})
    		.error(function(){
    			console.log($window.localStorage)
    			console.log('Authorization has failed. Sending to Auth')
    			event.preventDefault();
    			$state.go('auth');
    		}) */
    	}
  });
});


