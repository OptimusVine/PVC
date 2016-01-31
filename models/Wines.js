var mongoose = require('mongoose');

var WineSchema = new mongoose.Schema({
	id: {type: String},
	description: {type: String},
	name: {type: String},
	varietal: String,
	vintage: {  type: Number, 
				min: 2000, 
				required: 'A valid vintage is required' },			
	appellation: {
		name: {type: String},
		country: {type: String}  },
	comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
	todos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Todo'}],
	url: String,
	plm_id: Number
});

WineSchema.methods.addWine = function(err) {
	if(this.save()){
	console.log('I saved a wine named ' + this.name);
}}

mongoose.model('Wine', WineSchema);