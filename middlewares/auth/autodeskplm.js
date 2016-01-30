var request = require('request');
var events = require('events');

var keys = require ('../../private/keys.js');
var userId = keys.userId;
var password = keys.password;

var sessionid = "";
var cookieString = "";
var workspaces;

var param = {
		"header": {
			"Content-Type": "application/json"
		,	"Accept": "application/json"
		}
	,	"userID": userId
	,	"password": password
}

var options;

var resetOptions = function(){
	options = {
    "method":"GET",
    "url": "https://clubw.autodeskplm360.net/api/rest/v1/",
    "headers": {
        "Accept": "application/json"
    ,   "Cookie": ""
    }}}

resetOptions();

var setOptions = function(dest, cookie){
	options.url += dest
	options.headers.Cookie += cookie
	return options
}

var receiveWorkspaces = function(){
	console.log('receiveWorkspaces');
	setOptions("workspaces", "");
	console.log(options);
	request(options, function(err, response){
		if(err){
			console.log(err);
		} else if (response.statusCode == 500) {
			console.log('Response Status Code: ' + response.statusCode + ' Internal Error')
			
		} else {
		console.log('Status Code: ' + response.statusCode)
		var resBody = JSON.parse(response.body);
		console.log("Repsonse with Category: " + resBody.list.data[0].data.category)
		// console.log(resBody);
		workspaces = arrayWorkspaces(resBody.list);
		//workspaces = resBody;
		}
	});
}

var receiveWines = function(){
	console.log('Get Wines from PLM');
	resetOptions;
	setOptions("workspaces/52/items", cookieString);
	console.log(options.headers.Cookie);
	console.log(options.url);
	request(options, function(err, response){
		if(err){
			console.log(err);
		} else if (response.statusCode == 500) {
			console.log('Response Status Code: ' + response.statusCode + ' Internal Error')
			
		} else {
		console.log('Status Code: ' + response.statusCode)
		var resBody = JSON.parse(response.body);
		console.log(resBody.list)
		//workspaces = arrayWorkspaces(resBody.list);
		}
	})

}

var arrayWorkspaces = function(data){
	var counter = 0;
	var wsArray = [];
	var wsObject = Object.keys(data);
	wsObject.forEach(function(workspace) {
  		var items = Object.keys(data[workspace]);
  		items.forEach(function(item) {
    		var value = data[workspace][item];
    		wsArray.push(value);
    		//console.log(workspace+': '+item+' = '+ JSON.stringify(value));
 			});
		});
	return wsArray;
	}


exports.getCookie = function() {
		return cookieString;
	}

exports.getWorkspaces = function(callback) {
	// console.log(workspaces)
	callback(workspaces);
}

var getAuth = function(){
	console.log(' : Requesting PLM Authentication \n -------------------------')
	request.post('https://clubw.autodeskplm360.net/rest/auth/1/login', {form: param}, function(err, response){
	if(err){
		// console.log(err);
		console.log('Error when attempting to get Auth from PLM');
	} else if (response.statusCode == 500) {
		console.log('Response Status Code: ' + response.statusCode + ' Internal Error')
	} else {
	console.log('Status Code: ' + response.statusCode)
	var resBody = JSON.parse(response.body);
	sessionid = resBody.sessionid;
	cookieString = "customer=CLUBW;JSESSIONID=" + sessionid.toString();
	console.log(cookieString + " is our Auth Key!");
	setOptions("", cookieString)
	console.log(options);
	console.log(' : PLM Authentication Successful \n -------------------------')
	return;
		}	
	})}

var checkPing = function(){
	request.get('http://www.google.com', function(err, res){
		if (err) { 
			console.log(err);
			return; }
		else {getAuth();
			return};
	})
}

// Check for Ping, which calls GetAuth if successful or prints the error if not.

checkPing();
//setTimeout(receiveWorkspaces, 7500);	
//setTimeout(receiveWines, 10000);


