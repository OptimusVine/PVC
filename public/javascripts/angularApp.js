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

	return o;
}])

app.controller('MainCtrl', [
'$scope',
function($scope){
  $scope.test = 'Hello world!';
}]);

app.controller('WineCtrl', [
	'$scope',
	'wines',
	function($scope, wines){
		$scope.wines = wines.wines;
		
	}])

app.controller('WorkspacesCtrl', [
	'$scope',
	'workspaces',
	function($scope, workspaces){
		$scope.test = 'This is the workspaces site';
		$scope.workspaces = workspaces.workspaces;
	}])

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl'
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

	