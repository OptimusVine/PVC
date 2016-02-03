var request = require('request');
var events = require('events');
var mongoose = require('mongoose');

var Wine = mongoose.model('Wine');

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
	console.log(' : Requesting PLM workspaces \n -------------------------')
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
	console.log(' : Requesting Wines from Wine Information [hard coded] \n -------------------------')
	console.log('Get Wines from PLM');
	resetOptions;
	setOptions("workspaces/52/items", cookieString);
	console.log(options.headers.Cookie);
	console.log(options.url);
	request(options, function(err, response){
		if(err){
			console.log(err);
		} else if (response.statusCode != 200) {
			console.log('Response Status Code: ' + response.statusCode)
		} else {
		console.log('Status Code: ' + response.statusCode)
		var resBody = JSON.parse(response.body);
		console.log(resBody.list.item[1])
		//workspaces = arrayWorkspaces(resBody.list);
		}
	})

}

var i4013 = {};

exports.receiveWine = function(){
	console.log(' : Requesting Wines from Wine Information [hard coded: ID=4013] \n -------------------------')
	resetOptions();
	setOptions("workspaces/52/items/4013", cookieString);
	request(options, function(err, response){
		if(err){
			console.log(err);
		} else if (response.statusCode != 200) {
			console.log('Response Status Code: ' + response.statusCode)
		} else {
		console.log('Status Code: ' + response.statusCode)
		var resBody = JSON.parse(response.body);
		console.log("******* Printing Body of Object " + resBody.item.details.dmsID + " *********")
		console.log(resBody)
		console.log("******* Printing Same of MetaData of Object " + resBody.item.details.dmsID + " *********")
		console.log(resBody.item.metaFields.entry[1].key)
		console.log(resBody.item.metaFields.entry[1].fieldData.value)
		i4013 = resBody.item;
		console.log(i4013);
		return(i4013);
		}
	})
}

exports.fetchWine = function(req, res, cb){
	console.log(' : Requesting Wines from Wine Information [ID : ' + req.record +'] \n -------------------------')
	resetOptions();
	setOptions("workspaces/52/items/" + req.record, cookieString);
	console.log(options)
	request(options, function(err, response){
		if(err){
			console.log(err);
			res.send("These is an Error [Check Console] when attempting to get Wine ID: " + req.record);
		} else if (response.statusCode != 200) {
			console.log('Response Status Code: ' + response.statusCode);
			if (response.statusCode === 404) {
				var msg404 = 'Check to see if there is a wine at this id via the UI';
				console.log(msg404);
				res.send(msg404);
			} else if (response.statusCode === 500) {
				var msg500 = 'Check if there is a PING - or - if your Auth has expired'
				console.log(msg500);
				res.send(msg500);
			}
		} else {
		console.log('Status Code: ' + response.statusCode)
		var resBody = JSON.parse(response.body);
		var resItem = resBody.item;
		res.json(resItem)
		cb(resItem);
		
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


exports.parseToWine = function(data, cb){
	var wine = {};
	var meta = data.metaFields.entry;

	wine.id = data.id;
	wine.url = data.uri;


	for (var i = 0, len = meta.length; i < len; i++) {
  			mapPlmToModel(meta[i].key, function(result){
  				if (meta[i].fieldData.label){
  				wine[result] = meta[i].fieldData.label
  				} else if ((meta[i].fieldData.value)) {
  				wine[result] = meta[i].fieldData.value	
  				} else {
  					console.log("We're missing label and value when parsing")
  				}
  			})
		}

	console.log(wine);
	return wine;
}

var mapPlmToModel = function(arrI, result){
	map = [
		["BRAND_NAME", "name"],
		["VARIETALS", "varietal"],
		["WINE_VINTAGE", "vintage"],
		["APPELLATION_STATE_PROVINCE", "appellation.name"]
		]

	for (var i = 0; i < map.length; i++){
		if ( map[i][0] == arrI){
			result (map[i][1])
		}
	}	
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

var checkPing = function(func){
	request.get('http://www.google.com', function(err, res){
		if (err) { 
			console.log("***** Failure on Ping to Google - ping NOT completed ****")
			console.log(err);
			console.log("***** Failure on Ping to Google - ping NOT completed ****")
			return; }
		else {func();
			return};
	})
}

// Check for Ping, which calls GetAuth if successful or prints the error if not.

//checkPing(getAuth);
//setTimeout(receiveWorkspaces, 7500);	
//setTimeout(receiveWines, 5000);
//setTimeout(receiveWine, 5000);


