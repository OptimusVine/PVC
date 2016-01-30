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
			o.wines.push(data)
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
		
		$scope.refreshWines = function(){
			$scope.wines = wines.getAll();
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

	