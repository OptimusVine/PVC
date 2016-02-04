var app = angular.module('PVC', ['ui.router']);

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

app.controller('MainCtrl', [
	'$scope',
	'workspaces',
	function($scope, workspaces){
  		$scope.test = 'Hello world!';
  		$scope.workspaces = workspaces.workspaces
  		$scope.isEmpty = workspaces.isEmpty;
}]);

app.controller('WineCtrl', [
	'$scope',
	'wines',
	'wine',
	function($scope, wines, wine){

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

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl',
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
    	resolve: {
    		winePromise: ['$stateParams', 'wines', function($stateParams, wines){
    			return wines.search($stateParams.query)
    		}]
    	}
    })

    .state('workspaces', {
    	url: '/workspaces',
    	templateUrl: '/workspaces.html',
    	controller: 'WorkspacesCtrl',
    	resolve: {
    		workspacesPromise: ['workspaces', function(workspaces){
    			return workspaces.getAll()
    		}]

    	}
    })

  $urlRouterProvider.otherwise('home');
}]);

	