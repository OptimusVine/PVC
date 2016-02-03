var request = require('request');

//request.put("http://localhost:3000/workspaces/56ac07fad983d3ce34bddb18/public");

//TO-DO .... I need to make it search for "Wine Information" and then use that ID to set it public
//TO-DO .... I need to call this helper script anytime I call the admin/update/workpsaces 

var params = {
	name: 'Test Do',
	summary: 'This is the summary',
	wines: ['56ad66897070ffc5387352dc', '56ad66e28b8c6ac73811377e']
}

console.log(params.wines)

request.post("http://localhost:3000/todos", {form: params}, function(err, response){
	console.log(response.body);
})

//zachary.cecil@alaskaair.com