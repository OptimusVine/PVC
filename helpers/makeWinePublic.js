var request = require('request');

request.put("http://localhost:3000/workspaces/56ac07fad983d3ce34bddb18/public");

//TO-DO .... I need to make it search for "Wine Information" and then use that ID to set it public
//TO-DO .... I need to call this helper script anytime I call the admin/update/workpsaces 