var mongoose = require('mongoose');

var WorkspacesSchema = new mongoose.Schema({
		data: {
			id: {type: Number}
		, 	category: {type: String}
		,	label: { type: String}
		},	
		uri: {type: String},
		public: {type: Boolean, default: false}
	});

WorkspacesSchema.methods.addWorkspace = function(cb) {
	this.save();
	console.log('I have save a wine via the addWorkspace function, doing any checks you need');
}

WorkspacesSchema.methods.setPublic = function(cb) {
	this.public = true;
	this.save()
	console.log('I have set ' + this.data.label + ' to Public = True.')
}

mongoose.model('Workspaces', WorkspacesSchema);