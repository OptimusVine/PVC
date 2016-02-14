var request = require('request');
var events = require('events');
var mongoose = require('mongoose');

// Call needed models
var ToDo = mongoose.model('ToDo')
var Wine = mongoose.model('Wine');

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
		return resBody;
		}
})}

exports.completeTask = function(todo, cb){
	options = {
    "method":"PUT",
    "url": "https://app.asana.com/api/1.0/tasks/" + todo.asana_id,
    "headers": {
        "Accept": "application/json"
    ,   "Authorization": "Bearer " + token
    },
    json: {
    	data: {
    		"completed": true
    		}
    	}
	}

	request(options, function(err, response){
		if(err){
			console.log(err);
		} else if (response.statusCode != 200) {
			console.log('Response Status Code: ' + response.statusCode)
		} else {
		console.log('Status Code on Complete-TASK: ' + response.statusCode)
	//	var resBody = JSON.parse(response.body);
		console.log("Complete Task response : " + response)
		cb();
		}
	})
}

var getTask = function(asanaId, cb){

	resetOptionsTask(asanaId)		
 request(options, function(err, response){
	if(err){
			console.log(err);
		} else if (response.statusCode != 200) {
			console.log('Response Status Code: ' + response.statusCode)
		} else {
		console.log('Status Code on GET-TASK: ' + response.statusCode)
		var resBody = JSON.parse(response.body);
		//console.log(resBody.data)
		cb( resBody.data);
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

exports.assignTask = function(assignee, todo, cb){
	resetOptionsTask(todo.asana_id);
	options.method = "PUT"		
	options.json = {}
	options.json.data = {
		'assignee': assignee
	}
	console.log(options)
	request(options, function(err, response){
	if(err){
			console.log(err);
		} else if (response.statusCode != 200) {
			console.log('Response Status Code: ' + response.statusCode)
			console.log(response.body)
		} else {
		console.log('Status Code: ' + response.statusCode)
	//	var resBody = JSON.parse(response.body);
	//	console.log(response.body)
		cb(response.body)
		}
	})
}

exports.createTask = function(name, cb){

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
			"name": name
		//	"assignee": 10363492364586
		}}}

 request(options, function(err, response){
	if(err){
			console.log(err);
		} else if (response.statusCode != 201) {
			console.log('Response Status Code: ' + response.statusCode)
			console.log(response.body)
		} else {
		console.log('Status Code: ' + response.statusCode)
		res = response.body.data
		addTaskToProject(res.id, 88419022206391)
		cb(res)
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
	//	console.log(response.body)
		}
})
}

exports.getTasks = function(req, res, cb){
	resetOptionsProject(88419022206391)		
 	request(options, function(err, response){
	if(err){
			console.log(err);
		} else if (response.statusCode != 200) {
			console.log('Response Status Code: ' + response.statusCode)
		} else {
		console.log('Status Code: ' + response.statusCode)
		var resBody = JSON.parse(response.body);
	//	console.log(resBody)
		cb(resBody);
		}
})
}

// It is passed in an Asana Record 
// It checks if there is a TODO with this record
		// If there is calls the getTask function, and uses the result to update it
		// If there is NO task, it creates on in the record in the DB
exports.enterAsanaTodo = function(asanaRecord){
	query = ToDo.findOne({'asana_id': asanaRecord.id})
	query.exec(function(err, todo){
		if(!todo){
					console.log('no to do found with Asana id : ' + asanaRecord.id)
					t = new ToDo({
						name: asanaRecord.name,
						asana_id: asanaRecord.id
					})
					t.save()
					return;
				} else {
				//	console.log(todo)
					getTask(todo.asana_id, function(result){updateAsanaTodo(result)})
					return;
				}
		})
}

// When checking the project, if there is something existing, it will get dumped to this function
// The function will check Asana for more details and update the record appropriately.
var updateAsanaTodo = function(asanaResult){
	if (asanaResult.id){
		//console.log(asanaResult.id + " id's is " + asanaResult.name)
		conditions = {'asana_id': asanaResult.id};
		update = {  name: asanaResult.name,
					summary: asanaResult.notes,
					complete: asanaResult.completed,
					dateDue: asanaResult.due_on,
					dataAdded: asanaResult.created_at,
					asana_assignee: asanaResult.assignee
				};
		//console.log(update)
		queryF = ToDo.findOneAndUpdate(conditions, update)
		queryF.exec(function(err, todo){
		//	console.log('Query executed with result: ' + todo)
			return;
		})
		
	} else {
		console('There is no ID')
		return;
	}
}

//getProject()
//getTask(89442456495909, function(result){crossPollenateToWine(result)})
//addTaskToProject(89105394654871, 88419022206391)
//putTask()
//createTask("Manage this task via the API, and bring it into PVC");
console.log(options)