var mongoose = require('mongoose');

var WorkspacesSchema = new mongoose.Schema({
		data: {
			id: {type: Number}
		, 	category: {type: String}
		,	label: { type: String}
		},	
		uri: {type: String}
	});

WorkspacesSchema.methods.addWorkspace = function(cb) {
	this.save();
	console.log('I have save a wine via the addWorkspace function, doing any checks you need');
}

mongoose.model('Workspaces', WorkspacesSchema);