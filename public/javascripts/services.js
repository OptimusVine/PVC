var app = angular.module('PVC', ['ui.router']);

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

app.factory('user', ['$http', function($http){
	o = {
		isLogged: false,
		username: 'TEMPORARY',
		permission: {
			admin: false,
			user: false
		}
	};

	$http.get('/')

	return o;
}])