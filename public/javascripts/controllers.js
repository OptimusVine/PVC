var app = angular.module('PVC', ['ui.router']);

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
		console.log(auth.getUserStatus())
	}])

app.controller('loginController', 
	['$scope', '$state', 'auth',
	function($scope, $state, auth){
		console.log(auth.getUserStatus())

		$scope.login = function(){
			// initial values
			$scope.error = false;
			$scope.disabled = true;

			// call login from service
			auth.login($scope.loginForm.username, $scope.loginForm.password)
				//handle success
				.then(function(){
					$state.go('wines');
					$scope.disabled = false;
					$scope.loginForm = {};
				})
				// handle error
				.catch(function(){
					$scope.error = true;
					$scope.errorMessage = "Invalid Username and/or password";
					console.log($scope.errorMessage)
					$scope.disabled = true;
					$scope.loginForm = {};
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

app.controller('WineCtrl', [
	'$scope',
	'wines',
	'wine',
	'auth',
	function($scope, wines, wine, auth){

		console.log(auth.getUserStatus());

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