var request = require('request');
var events = require('events');
var mongoose = require('mongoose');

// var Wine = mongoose.model('Wine');

var keys = require ('../../private/keys.js');

var token = keys.asana.token;
var options;
var data;

var resetDataTask = function(){
	data = {

	}
}


var resetOptionsProject = function(project){
	options = {
    "method":"GET",
    "url": "https://app.asana.com/api/1.0/tasks?project=" + project,
    "headers": {
        "Accept": "application/json"
    ,   "Authorization": "Bearer " + token
    }}}

var resetOptionsTask = function(task){
	options = {
    "method":"GET",
    "url": "https://app.asana.com/api/1.0/tasks/" + task,
    "headers": {
        "Accept": "application/json"
    ,   "Authorization": "Bearer " + token
    }}}

var getProject = function(){
	resetOptionsProject(88419022206391)		
 request(options, function(err, response){
	if(err){
			console.log(err);
		} else if (response.statusCode != 200) {
			console.log('Response Status Code: ' + response.statusCode)
		} else {
		console.log('Status Code: ' + response.statusCode)
		var resBody = JSON.parse(response.body);
		console.log(resBody)
		}
})}

var getTask = function(){
	resetOptionsTask(88419022206392)		
 request(options, function(err, response){
	if(err){
			console.log(err);
		} else if (response.statusCode != 200) {
			console.log('Response Status Code: ' + response.statusCode)
		} else {
		console.log('Status Code: ' + response.statusCode)
		var resBody = JSON.parse(response.body);
		console.log(resBody.data)
		}
})}

var putTask = function(){
	resetOptionsTask(88502579263090)
	options.method = "PUT"		
	options.json = {}
	options.json.data = {
	//	'completed': false,
	//	'assignee': 10363492364586
	}
 request(options, function(err, response){
	if(err){
			console.log(err);
		} else if (response.statusCode != 200) {
			console.log('Response Status Code: ' + response.statusCode)
			console.log(response.body)
		} else {
		console.log('Status Code: ' + response.statusCode)
	//	var resBody = JSON.parse(response.body);
		console.log(response.body)
		}
})}

var createTask = function(name){

	options = {
    "method":"POST",
    "url": "https://app.asana.com/api/1.0/tasks",
    "headers": {
        "Accept": "application/json",
        "Authorization": "Bearer " + token
    },
	json: {
		data: {
			"workspace": 2733326967720,
			"name": name,
			"assignee": 10363492364586
		}}}

 request(options, function(err, response){
	if(err){
			console.log(err);
		} else if (response.statusCode != 200) {
			console.log('Response Status Code: ' + response.statusCode)
			console.log(response.body)
		} else {
		console.log('Status Code: ' + response.statusCode)
		console.log(response.body)
		}
})
}

var addTaskToProject = function(task, project){

	options = {
    "method":"POST",
    "url": "https://app.asana.com/api/1.0/tasks/" + task + "/addProject",
    "headers": {
        "Accept": "application/json",
        "Authorization": "Bearer " + token
    },
	json: {
		data: {
		//	"workspace": 2733326967720,
		//	"name": name,
			"project": project
		}}}

 request(options, function(err, response){
	if(err){
			console.log(err);
		} else if (response.statusCode != 200) {
			console.log('Response Status Code: ' + response.statusCode)
			console.log(response.body)
		} else {
		console.log('Status Code: ' + response.statusCode)
		console.log(response.body)
		}
})
}

//getTask()
addTaskToProject(88502579263090, 88419022206391)
//putTask()
//createTask("Create a task via the API");
console.log(options)